import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect, Line, Text as SvgText, Circle as SvgCircle, Path as SvgPath } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { databaseService } from '../../services/database/DatabaseService';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 140;

interface HistoryRecord {
  date: string;
  rainfall_mm: number;
  river_level_m: number;
  soil_saturation_pct: number;
  flood_level: string;
  water_accumulation_mm: number;
  landslide_risk_pct: number;
  landslide_occurred: number;
  notes: string;
}

interface LandslideRecord {
  date: string;
  severity: string;
  slope_angle_deg: number;
  soil_type: string;
  rainfall_trigger_mm: number;
  casualties: number;
  damage_estimate: string;
  notes: string;
}

const FLOOD_LEVEL_COLORS: Record<string, string> = {
  NONE: '#4ADE80',
  MINOR: '#FACC15',
  MODERATE: '#FB923C',
  SEVERE: '#F87171',
};

export const WeatherHistoryScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [landslides, setLandslides] = useState<LandslideRecord[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const h = await databaseService.getWeatherHistory('zone_village_a_ward_3', 12);
      const ls = await databaseService.getLandslideRecords('zone_village_a_ward_3');
      const s = await databaseService.getWeatherStats('zone_village_a_ward_3');
      setHistory(h);
      setLandslides(ls);
      setStats(s);
    } catch (err) {
      // Handle gracefully
    }
  };

  // Build mini bar chart data from history (reversed so oldest is left)
  const chartData = [...history].reverse();
  const maxRainfall = Math.max(...chartData.map((d) => d.rainfall_mm), 1);

  const renderRainfallChart = () => {
    if (chartData.length === 0) return null;
    const barWidth = Math.min(20, (CHART_WIDTH - 20) / chartData.length - 4);
    const barGap = 4;

    return (
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Horizontal guide lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <Line
            key={pct}
            x1={0}
            y1={CHART_HEIGHT - CHART_HEIGHT * pct}
            x2={CHART_WIDTH}
            y2={CHART_HEIGHT - CHART_HEIGHT * pct}
            stroke={colors.border.subtle}
            strokeWidth={0.5}
          />
        ))}
        {/* Bars */}
        {chartData.map((d, i) => {
          const barHeight = (d.rainfall_mm / maxRainfall) * (CHART_HEIGHT - 20);
          const x = i * (barWidth + barGap) + 10;
          const y = CHART_HEIGHT - barHeight;
          const barColor = d.landslide_occurred
            ? colors.severity.critical.text
            : d.rainfall_mm > 80
            ? colors.severity.high.text
            : d.rainfall_mm > 40
            ? colors.severity.moderate.text
            : colors.severity.low.text;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                fill={barColor}
                opacity={0.8}
              />
              {/* Landslide marker */}
              {d.landslide_occurred === 1 && (
                <SvgCircle cx={x + barWidth / 2} cy={y - 8} r={4} fill={colors.severity.critical.text} />
              )}
              {/* Date label */}
              <SvgText
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 2}
                fill={colors.text.muted}
                fontSize={7}
                textAnchor="middle"
              >
                {d.date.slice(8)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        {stats && (
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <WeatherIcon name="database" size={16} color={colors.accent.cyan} />
              <Text style={[styles.statsTitle, { color: colors.text.primary }]}>Historical Summary</Text>
              <Text style={[styles.statsCount, { color: colors.text.tertiary }]}>{stats.total_records} records</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.avg_rainfall?.toFixed(1)}</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>mm avg rain</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.severity.high.text }]}>{stats.max_rainfall?.toFixed(1)}</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>mm max rain</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.avg_river_level?.toFixed(1)}</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>m avg river</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.severity.critical.text }]}>{stats.total_landslides}</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>landslides</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.severity.moderate.text }]}>{stats.avg_landslide_risk?.toFixed(0)}%</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>avg LS risk</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.severity.critical.text }]}>{stats.max_landslide_risk?.toFixed(0)}%</Text>
                <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>max LS risk</Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Rainfall Chart */}
        <GlassCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <WeatherIcon name="rain" size={16} color={colors.accent.cyan} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Rainfall History (mm)</Text>
          </View>
          <View style={styles.chartContainer}>
            {renderRainfallChart()}
          </View>
          <View style={styles.chartLegendRow}>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: colors.severity.critical.text }]} />
              <Text style={[styles.chartLegendText, { color: colors.text.tertiary }]}>Landslide event</Text>
            </View>
          </View>
        </GlassCard>

        {/* Landslide History */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Landslide Records</Text>
        {landslides.map((ls, idx) => {
          const sevColor = colors.severity[(ls.severity.toLowerCase() as keyof typeof colors.severity)] || colors.severity.low;
          return (
            <GlassCard key={idx} style={styles.lsCard}>
              <View style={styles.lsHeader}>
                <WeatherIcon name="landslide" size={16} color={sevColor.text} />
                <Text style={[styles.lsDate, { color: colors.text.primary }]}>{ls.date}</Text>
                <View style={[styles.lsSeverityPill, { backgroundColor: sevColor.bg }]}>
                  <Text style={[styles.lsSeverityText, { color: sevColor.text }]}>{ls.severity}</Text>
                </View>
              </View>
              <View style={styles.lsDetails}>
                <View style={styles.lsDetailRow}>
                  <Text style={[styles.lsDetailLabel, { color: colors.text.tertiary }]}>Slope Angle</Text>
                  <Text style={[styles.lsDetailValue, { color: colors.text.primary }]}>{ls.slope_angle_deg}°</Text>
                </View>
                <View style={styles.lsDetailRow}>
                  <Text style={[styles.lsDetailLabel, { color: colors.text.tertiary }]}>Soil Type</Text>
                  <Text style={[styles.lsDetailValue, { color: colors.text.primary }]}>{ls.soil_type}</Text>
                </View>
                <View style={styles.lsDetailRow}>
                  <Text style={[styles.lsDetailLabel, { color: colors.text.tertiary }]}>Rainfall Trigger</Text>
                  <Text style={[styles.lsDetailValue, { color: colors.text.primary }]}>{ls.rainfall_trigger_mm} mm</Text>
                </View>
                <View style={styles.lsDetailRow}>
                  <Text style={[styles.lsDetailLabel, { color: colors.text.tertiary }]}>Casualties</Text>
                  <Text style={[styles.lsDetailValue, { color: ls.casualties > 0 ? colors.severity.critical.text : colors.text.primary }]}>{ls.casualties}</Text>
                </View>
              </View>
              <Text style={[styles.lsNotes, { color: colors.text.secondary }]}>{ls.notes}</Text>
              <Text style={[styles.lsDamage, { color: colors.text.tertiary }]}>Damage: {ls.damage_estimate}</Text>
            </GlassCard>
          );
        })}

        {/* Daily Records */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Daily Weather Records</Text>
        {history.map((record, idx) => (
          <GlassCard key={idx} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={[styles.recordDate, { color: colors.text.primary }]}>{record.date}</Text>
              <View style={[styles.floodPill, { backgroundColor: FLOOD_LEVEL_COLORS[record.flood_level] + '30' }]}>
                <Text style={[styles.floodPillText, { color: FLOOD_LEVEL_COLORS[record.flood_level] }]}>
                  {record.flood_level}
                </Text>
              </View>
            </View>
            <View style={styles.recordGrid}>
              <View style={styles.recordItem}>
                <WeatherIcon name="rain" size={12} color={colors.text.tertiary} />
                <Text style={[styles.recordValue, { color: colors.text.primary }]}>{record.rainfall_mm}mm</Text>
              </View>
              <View style={styles.recordItem}>
                <WeatherIcon name="flood" size={12} color={colors.text.tertiary} />
                <Text style={[styles.recordValue, { color: colors.text.primary }]}>{record.river_level_m}m</Text>
              </View>
              <View style={styles.recordItem}>
                <WeatherIcon name="cloud" size={12} color={colors.text.tertiary} />
                <Text style={[styles.recordValue, { color: colors.text.primary }]}>{record.soil_saturation_pct}%</Text>
              </View>
              <View style={styles.recordItem}>
                <WeatherIcon name="landslide" size={12} color={record.landslide_risk_pct > 60 ? colors.severity.critical.text : colors.text.tertiary} />
                <Text style={[styles.recordValue, { color: record.landslide_risk_pct > 60 ? colors.severity.critical.text : colors.text.primary }]}>{record.landslide_risk_pct}%</Text>
              </View>
            </View>
            {record.notes ? (
              <Text style={[styles.recordNotes, { color: colors.text.secondary }]}>{record.notes}</Text>
            ) : null}
            {record.landslide_occurred === 1 && (
              <View style={[styles.landslideAlert, { backgroundColor: colors.severity.critical.bg }]}>
                <WeatherIcon name="alert" size={12} color={colors.severity.critical.text} />
                <Text style={[styles.landslideAlertText, { color: colors.severity.critical.text }]}>
                  Landslide occurred on this date
                </Text>
              </View>
            )}
          </GlassCard>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  // Stats card
  statsCard: { marginBottom: Spacing.lg },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    flex: 1,
  },
  statsCount: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '33%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  statUnit: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },

  // Chart
  chartCard: { marginBottom: Spacing.xxl },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLegendText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },

  // Section
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },

  // Landslide records
  lsCard: { marginBottom: Spacing.md },
  lsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  lsDate: {
    fontSize: FontSize.md,
    fontWeight: '700',
    flex: 1,
  },
  lsSeverityPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  lsSeverityText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  lsDetails: {
    marginBottom: Spacing.sm,
  },
  lsDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  lsDetailLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  lsDetailValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  lsNotes: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  lsDamage: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
  },

  // Daily records
  recordCard: { marginBottom: Spacing.sm },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recordDate: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  floodPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  floodPillText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  recordGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  recordNotes: {
    fontSize: FontSize.xs,
    lineHeight: 16,
  },
  landslideAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  landslideAlertText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
