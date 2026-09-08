/**
 * QVAC-powered semantic analysis — the categories regex genuinely cannot
 * detect: null pointer risk, race conditions, performance bottlenecks.
 *
 * Labeled "AI Analysis" in the UI, never merged with pattern-match findings.
 * This is inherently probabilistic — the model can miss things or flag
 * false positives. Don't let UI copy imply certainty this tier doesn't have.
 */

import { generate, isModelLoaded, loadModel, isQvacAvailable } from '../qvac/qvacClient';
import { Finding } from './patternRules';

export type SemanticCategory = 'null-pointer' | 'race-condition' | 'performance';

export interface SemanticFinding {
  category: SemanticCategory;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  suggestedFix: string;
  lineHint?: string; // model's best-effort line reference, not guaranteed accurate
}

const SYSTEM_PROMPT = `You are a code review assistant analyzing a code snippet for three specific issue types:
1. null-pointer: accessing a property/method on a value that could be null/undefined
2. race-condition: shared state modified without synchronization, or async operations with ordering assumptions that may not hold
3. performance: obvious bottlenecks — O(n^2)+ where better exists, unnecessary re-renders, blocking calls in hot paths

Respond ONLY with a JSON array, no markdown fences, no preamble. Each element:
{"category": "null-pointer"|"race-condition"|"performance", "confidence": "high"|"medium"|"low", "explanation": "one sentence", "suggestedFix": "one sentence", "lineHint": "the exact, verbatim offending line or code fragment copied character-for-character from the input — never a paraphrased description of the location"}

If you find nothing in a category, omit it. If you find nothing at all, respond with an empty array: []
Do not invent issues that aren't present. Only report what you can actually see in the code.`;

export interface DeepScanResult {
  findings: SemanticFinding[];
  tokensPerSecond: number;
  modelLoadedThisRun: boolean;
}

export async function runSemanticScan(
  code: string,
  onModelLoadProgress?: (pct: number) => void,
  patternFindings: Finding[] = []
): Promise<DeepScanResult> {
  if (!isQvacAvailable()) {
    throw new Error('QVAC unavailable on this build.');
  }

  let modelLoadedThisRun = false;
  if (!isModelLoaded()) {
    modelLoadedThisRun = true;
    await loadModel(onModelLoadProgress);
  }

  // Cap input size — this is a code-review pass, not a full-file dump.
  // Long pastes get truncated with a visible note rather than silently
  // failing or blowing the context window.
  // Budget: ctx_size 3072 - maxTokens 600 (output) - ~260 (system prompt,
  // measured 1053 chars / ~4 chars-per-token for prose) ≈ 2100 tokens left
  // for the userPrompt wrapper + code. CONFIRMED FAILURE (Sep 6): 7000 chars
  // at an assumed 3.2 chars/token estimate overflowed on a real dense
  // HTML/CSS/JS file (62818 chars raw) — minified/template-literal-heavy
  // code tokenizes denser than that estimate assumed. Recalculated at a
  // safer 2.5 chars/token for dense code: 2100 tokens * 2.5 = 5250,
  // rounded down to 5000 for real margin. Recalculate this if ctx_size,
  // maxTokens, or SYSTEM_PROMPT length change — this number is derived,
  // not arbitrary, and has already been wrong once.
  const MAX_CHARS = 5000;
  // Windowed assembly (below) deliberately selects code AROUND
  // pattern-match hits — SQL concatenation, promise chains, template
  // literals — which is denser and tokenizes worse than the 2.5
  // chars/token estimate MAX_CHARS is based on (that estimate already
  // came from a dense-code failure once, see comment above). A random
  // file-head slice sometimes lands on sparse boilerplate; windowed
  // selection never does. Confirmed overflow (Sep 8) on a 62KB file at
  // the full 5000-char windowed budget. Cutting to 3200 gives real
  // margin for the worst-case density windowing guarantees encountering.
  const WINDOWED_MAX_CHARS = 3200;
  const truncated = code.length > MAX_CHARS;

  // Build codeForPrompt from windows around known pattern-match hits when
  // the file is too big to send whole. Blind head-truncation (the old
  // behavior) always fed the model the file's first page, so on any file
  // where the real issues live past byte 5000 — like a 62KB dense file
  // with critical findings at line 900+ — the AI tier silently never saw
  // them and reported a false-clean result. Windowing around pattern-match
  // line numbers biases the AI's limited view toward the code most likely
  // to have additional issues, instead of always the same unlucky prefix.
  let codeForPrompt = code;
  let windowNote = '';

  if (truncated) {
    if (patternFindings.length > 0) {
      const lines = code.split('\n');
      const WINDOW = 20;
      const ranges: [number, number][] = patternFindings
        .map((f) => [Math.max(0, f.line - 1 - WINDOW), Math.min(lines.length, f.line - 1 + WINDOW)] as [number, number])
        .sort((a, b) => a[0] - b[0]);

      const merged: [number, number][] = [];
      for (const [start, end] of ranges) {
        const last = merged[merged.length - 1];
        if (last && start <= last[1]) {
          last[1] = Math.max(last[1], end);
        } else {
          merged.push([start, end]);
        }
      }

      let assembled = '';
      for (const [start, end] of merged) {
        const chunk = `// ...lines ${start + 1}-${end}...\n` + lines.slice(start, end).join('\n') + '\n';
        if (assembled.length + chunk.length > WINDOWED_MAX_CHARS) break;
        assembled += chunk;
      }

      codeForPrompt = assembled || code.slice(0, WINDOWED_MAX_CHARS);
      windowNote = `[Note: file too large for full analysis — showing ${merged.length} region(s) around ${patternFindings.length} pattern-match finding(s), not the full file]\n\n`;
    } else {
      codeForPrompt = code.slice(0, MAX_CHARS);
      windowNote = `[Note: code truncated to first ${MAX_CHARS} characters]\n\n`;
    }
  }

  const userPrompt = `${windowNote}Analyze this code:\n\n${codeForPrompt}`;

  const result = await generate(SYSTEM_PROMPT, userPrompt, { maxTokens: 600 });

  let findings: SemanticFinding[] = [];
  try {
    const cleaned = result.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      findings = parsed.filter(
        (f) =>
          f &&
          typeof f.category === 'string' &&
          typeof f.explanation === 'string' &&
          ['null-pointer', 'race-condition', 'performance'].includes(f.category)
      );
    }
  } catch {
    // Model didn't return valid JSON — fail to empty rather than crash
    // the scan. The pattern-match findings still stand on their own.
    findings = [];
  }

  return {
    findings,
    tokensPerSecond: result.tokensPerSecond,
    modelLoadedThisRun,
  };
}
