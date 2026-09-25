import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRiskStore } from '../../state/useRiskStore';
import { RiskGauge } from '../../components/RiskGauge';
import { RiskBadge } from '../../components/RiskBadge';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';

const SEVERITY_ICON: Record<string, 'sun' | 'wind' | 'storm' | 'alert'> = {
  LOW: 'sun',
  MODERATE: 'wind',
  HIGH: 'alert',
  CRITICAL: 'storm',
};

export const RiskScoreScreen: React.FC = () => {
  const currentRisk = useRiskStore((state) => state.currentRisk);

  if (!currentRisk) {
    return (
      <LinearGradient colors={Colors.gradient.primary} style={styles.container}>
        <View style={styles.centerContainer}>
          <WeatherIcon name="cloud" size={40} color={Colors.text.tertiary} />
          <Text style={styles.emptyText}>Telemetry data loading or unavailable.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gauge */}
        <View style={styles.gaugeContainer}>
          <RiskGauge score={currentRisk.compositeScore} severity={currentRisk.severityLabel} size={200} />
          <View style={styles.badgeWrapper}>
            <RiskBadge severity={currentRisk.severityLabel} size="large" />
          </View>
        </View>

        {/* Explanation */}
        <GlassCard style={styles.card}>
          <View style={styles.cardTitleRow}>
            <WeatherIcon name="storm" size={16} color={Colors.accent.amber} />
            <Text style={styles.cardHeader}>Why is this score calculated?</Text>
          </View>
          {currentRisk.explanation.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Factor Breakdown */}
        <GlassCard style={styles.card}>
          <View style={styles.cardTitleRow}>
            <WeatherIcon name="settings" size={16} color={Colors.accent.cyan} />
            <Text style={styles.cardHeader}>Sensor Weighting Breakdown</Text>
          </View>
          {currentRisk.factors.map((factor) => {
            const icon = SEVERITY_ICON[factor.severity] || 'cloud';
            return (
              <View key={factor.name} style={styles.factorItem}>
                <View style={styles.factorLeft}>
                  <View style={styles.factorIcon}>
                    <WeatherIcon
                      name={icon}
                      size={14}
                      color={Colors.severity[factor.severity.toLowerCase() as keyof typeof Colors.severity]?.text || Colors.text.secondary}
                    />
                  </View>
                  <View>
                    <Text style={styles.factorLabel}>{factor.name}</Text>
                    <Text style={styles.factorValue}>
                      {factor.value} {factor.unit}
                    </Text>
                  </View>
                </View>
                <RiskBadge severity={factor.severity} size="small" />
              </View>
            );
          })}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, alignItems: 'center', paddingBottom: 100 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: { color: Colors.text.tertiary, fontSize: FontSize.md },

  gaugeContainer: { marginVertical: Spacing.xxl, alignItems: 'center' },
  badgeWrapper: { marginTop: Spacing.lg },

  card: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.text.tertiary,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  factorIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bg.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  factorValue: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    fontWeight: '700',
    marginTop: 2,
  },
});