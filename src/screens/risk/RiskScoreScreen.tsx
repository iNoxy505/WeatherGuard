import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRiskStore } from '../../state/useRiskStore';
import { useTheme } from '../../theme/ThemeContext';
import { RiskGauge } from '../../components/RiskGauge';
import { RiskBadge } from '../../components/RiskBadge';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

const SEVERITY_ICON: Record<string, 'sun' | 'wind' | 'storm' | 'alert' | 'landslide'> = {
  LOW: 'sun',
  MODERATE: 'wind',
  HIGH: 'alert',
  CRITICAL: 'storm',
};

export const RiskScoreScreen: React.FC = () => {
  const currentRisk = useRiskStore((state) => state.currentRisk);
  const { colors } = useTheme();

  if (!currentRisk) {
    return (
      <LinearGradient colors={colors.gradient.primary} style={styles.container}>
        <View style={styles.centerContainer}>
          <WeatherIcon name="cloud" size={40} color={colors.text.tertiary} />
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>Telemetry data loading or unavailable.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
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
            <WeatherIcon name="database" size={16} color={colors.accent.amber} />
            <Text style={[styles.cardHeader, { color: colors.text.primary }]}>Multi-Source ML Pipeline Analysis</Text>
          </View>
          
          {/* Models Used Pill */}
          {currentRisk.mlModelsUsed && (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12}}>
              {currentRisk.mlModelsUsed.map((m) => (
                <View key={m} style={[styles.modelPill, { backgroundColor: colors.bg.glass, borderColor: colors.border.subtle }]}>
                  <Text style={{color: colors.text.secondary, fontSize: 10, fontWeight: '700'}}>{m}</Text>
                </View>
              ))}
            </View>
          )}

          {currentRisk.explanation.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: colors.text.tertiary }]} />
              <Text style={[styles.bulletText, { color: colors.text.secondary }]}>{item}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Temporal Water Level Trend (LSTM Simulation) */}
        {currentRisk.waterLevelTrend && (
          <GlassCard style={styles.card}>
             <View style={styles.cardTitleRow}>
              <WeatherIcon name="rain" size={16} color={colors.accent.cyan} />
              <Text style={[styles.cardHeader, { color: colors.text.primary }]}>LSTM Water Level Trend & Forecast</Text>
            </View>
            <View style={styles.trendGraph}>
              {currentRisk.waterLevelTrend.history.map((val, idx) => {
                const height = Math.min((val / 5) * 100, 100); // 5m max
                return (
                  <View key={`hist-${idx}`} style={styles.barWrapper}>
                    <View style={[styles.trendBar, { height: `${height}%`, backgroundColor: colors.accent.cyan }]} />
                    <Text style={[styles.barLabel, { color: colors.text.tertiary }]}>{currentRisk.waterLevelTrend!.timestamps[idx]}</Text>
                  </View>
                );
              })}
              {/* Forecast (Dashed or red/orange to indicate prediction) */}
              {currentRisk.waterLevelTrend.forecast.map((val, idx) => {
                const height = Math.min((val / 5) * 100, 100);
                return (
                  <View key={`fore-${idx}`} style={styles.barWrapper}>
                    <View style={[styles.trendBar, { height: `${height}%`, backgroundColor: colors.severity.critical.bg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.severity.critical.text }]} />
                    <Text style={[styles.barLabel, { color: colors.severity.critical.text, fontWeight: '700' }]}>+{(idx+1)}h</Text>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        )}

        {/* Factor Breakdown */}
        <GlassCard style={styles.card}>
          <View style={styles.cardTitleRow}>
            <WeatherIcon name="settings" size={16} color={colors.accent.cyan} />
            <Text style={[styles.cardHeader, { color: colors.text.primary }]}>Sensor Weighting Breakdown</Text>
          </View>
          {currentRisk.factors.map((factor) => {
            const icon = factor.name.includes('Landslide') ? 'landslide' : (SEVERITY_ICON[factor.severity] || 'cloud');
            return (
              <View key={factor.name} style={[styles.factorItem, { borderBottomColor: colors.border.subtle }]}>
                <View style={styles.factorLeft}>
                  <View style={[styles.factorIcon, { backgroundColor: colors.bg.glass }]}>
                    <WeatherIcon
                      name={icon as any}
                      size={14}
                      color={colors.severity[factor.severity.toLowerCase() as keyof typeof colors.severity]?.text || colors.text.secondary}
                    />
                  </View>
                  <View>
                    <Text style={[styles.factorLabel, { color: colors.text.secondary }]}>{factor.name}</Text>
                    <Text style={[styles.factorValue, { color: colors.text.primary }]}>
                      {factor.value} {factor.unit}
                    </Text>
                  </View>
                </View>
                <RiskBadge severity={factor.severity} size="small" />
              </View>
            );
          })}
        </GlassCard>

        {/* Landslide Deep Dive */}
        {currentRisk.landslideRisk && (
          <GlassCard style={styles.card} glowColor={
            colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.accent
          }>
            <View style={styles.cardTitleRow}>
              <WeatherIcon name="landslide" size={16} color={colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.text || colors.accent.amber} />
              <Text style={[styles.cardHeader, { color: colors.text.primary }]}>Landslide Risk Analysis</Text>
            </View>

            <View style={styles.lsStatsRow}>
              <View style={styles.lsStat}>
                <Text style={[styles.lsStatBig, { color: colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.text }]}>
                  {currentRisk.landslideRisk.probability}%
                </Text>
                <Text style={[styles.lsStatLabel, { color: colors.text.tertiary }]}>Probability</Text>
              </View>
              <View style={styles.lsStat}>
                <Text style={[styles.lsStatBig, { color: colors.text.primary }]}>{currentRisk.landslideRisk.slopeAngle}°</Text>
                <Text style={[styles.lsStatLabel, { color: colors.text.tertiary }]}>Slope</Text>
              </View>
              <View style={styles.lsStat}>
                <Text style={[styles.lsStatBig, { color: colors.text.primary }]}>{currentRisk.landslideRisk.triggerThreshold}mm</Text>
                <Text style={[styles.lsStatLabel, { color: colors.text.tertiary }]}>Trigger</Text>
              </View>
            </View>

            {currentRisk.landslideRisk.factors.map((f, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: colors.text.tertiary }]} />
                <Text style={[styles.bulletText, { color: colors.text.secondary }]}>{f}</Text>
              </View>
            ))}
          </GlassCard>
        )}
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
  emptyText: { fontSize: FontSize.md },

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
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  modelPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: 30,
  },
  trendBar: {
    width: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    position: 'absolute',
    bottom: -15,
  },

  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  factorValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginTop: 2,
  },

  // Landslide section
  lsStatsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  lsStat: {
    flex: 1,
    alignItems: 'center',
  },
  lsStatBig: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
  },
  lsStatLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
});