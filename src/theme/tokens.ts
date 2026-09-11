/**
 * Nibras design tokens — TERMINAL REDESIGN (Sep 2026).
 *
 * SEVERITY COLOR-CODING RESTORED (Sep 11 2026): the monochrome-green
 * severity decision below was explicitly reversed by product decision.
 * Severity is once again color-coded — red/orange/yellow/green — on top
 * of the existing text-label convention ([CRITICAL]/[HIGH]/etc). This is
 * a deliberate re-confirmation, not an accidental revert. If touching
 * this again, confirm with the product owner first either way.
 */

export const color = {
  bg: '#0B0F14',
  surface: '#0D1420',
  surfaceElevated: '#122036',
  border: '#1C2530',
  borderSubtle: '#161D26',

  textPrimary: '#E5F0EB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',

  // Severity — color-coded (restored Sep 11 2026). Standard traffic-light
  // convention: red (critical) → orange (high) → yellow (medium) → green
  // (low). Still paired with text labels, not a replacement for them.
  critical: '#DC2626',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E',

  // AI/QVAC tier accent — terminal amber, kept distinct from the primary
  // green so "probabilistic AI" vs "deterministic pattern-match" still
  // reads as a different visual register, per the existing convention.
  aiAccent: '#FFB627',
  aiAccentBg: '#1A1508',
  aiAccentBorder: '#4D3A0F',

  // Dashboard-only secondary accent — terminal green, matches primary now
  // that the palette is unified. Kept as a separate token (not deleted)
  // since DashboardScreen.tsx references color.pulseAccent directly.
  pulseAccent: '#39FF88',
  pulseAccentBg: '#0F2415',
  pulseAccentBorder: '#1E6E4E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
};

// Terminal redesign fonts — loaded via useNibrasFonts() hook in App.tsx
// using @expo-google-fonts/orbitron and @expo-google-fonts/share-tech-mono.
// Falls back to 'monospace' if fonts fail to load — DO NOT reference these
// family names anywhere without confirming useNibrasFonts() has resolved
// first, or RN silently falls back to system font with no error.
export const font = {
  display: 'Orbitron_700Bold', // brand name, screen titles
  displayRegular: 'Orbitron_400Regular', // less-loud display use, if needed
  mono: 'ShareTechMono_400Regular', // everything else: body, labels, stats, snippets
};

export const type = {
  displayLarge: { fontSize: 26, fontWeight: '700' as const, fontFamily: font.display, letterSpacing: 1 },
  displayMedium: { fontSize: 20, fontWeight: '700' as const, fontFamily: font.display, letterSpacing: 0.5 },
  title: { fontSize: 16, fontWeight: '600' as const, fontFamily: font.mono },
  body: { fontSize: 14, fontWeight: '400' as const, fontFamily: font.mono },
  caption: { fontSize: 12, fontWeight: '600' as const, fontFamily: font.mono },
  statFigure: { fontSize: 32, fontWeight: '800' as const, fontFamily: font.mono },
  statLabel: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5, fontFamily: font.mono },
};
