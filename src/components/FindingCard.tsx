import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Finding, Severity } from '../rules/patternRules';
import { color, spacing, radius } from '../theme/tokens';

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: color.critical,
  HIGH: color.high,
  MEDIUM: color.medium,
  LOW: color.low,
};

export default function FindingCard({ finding }: { finding: Finding }) {
  return (
    <View style={[styles.card, { borderLeftColor: SEVERITY_COLOR[finding.severity] }]}>
      <Text style={[styles.cardSeverity, { color: SEVERITY_COLOR[finding.severity] }]}>
        {finding.severity}
      </Text>
      <Text style={styles.cardMessage}>{finding.message}</Text>
      <Text style={styles.cardMeta}>
        {finding.file}:{finding.line}
      </Text>
      <Text style={styles.cardSnippet}>{finding.snippet}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderLeftWidth: 4, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm },
  cardSeverity: { fontSize: 11, fontWeight: '800', marginBottom: spacing.xs },
  cardMessage: { color: color.textPrimary, fontSize: 14, marginBottom: spacing.xs },
  cardMeta: { color: color.textTertiary, fontSize: 12, marginBottom: spacing.xs },
  cardSnippet: { color: color.textSecondary, fontSize: 12, fontFamily: 'monospace' },
});
