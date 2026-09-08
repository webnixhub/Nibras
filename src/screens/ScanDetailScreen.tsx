import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import FindingCard from '../components/FindingCard';
import { ScanRecord } from '../store/useNibrasStore';
import { color, spacing, type as t } from '../theme/tokens';

type ScanDetailRouteParams = { 'Scan Detail': { record: ScanRecord } };

export default function ScanDetailScreen() {
  const route = useRoute<RouteProp<ScanDetailRouteParams, 'Scan Detail'>>();
  const { record } = route.params;

  const total =
    record.severityCounts.CRITICAL +
    record.severityCounts.HIGH +
    record.severityCounts.MEDIUM +
    record.severityCounts.LOW;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{record.mode === 'guard' ? 'Guard Mode' : 'Vault Mode'} Scan</Text>
      <Text style={styles.subtitle}>
        {new Date(record.timestamp).toLocaleDateString()} ·{' '}
        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.meta}>
        {record.fileCount} file{record.fileCount !== 1 ? 's' : ''} · {total} finding
        {total !== 1 ? 's' : ''}
      </Text>

      {record.findings.length === 0 && (
        <Text style={styles.empty}>No pattern-match findings recorded for this scan.</Text>
      )}
      {record.findings.map((f, i) => (
        <FindingCard key={`${f.ruleId}-${i}`} finding={f} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  content: { padding: spacing.xl, paddingBottom: 60 },
  title: { ...t.displayLarge, color: color.textPrimary },
  subtitle: { ...t.body, color: color.textSecondary, marginTop: spacing.xs },
  meta: { ...t.body, color: color.textTertiary, marginBottom: spacing.lg },
  empty: { color: color.textTertiary, textAlign: 'center', marginTop: 40 },
});
