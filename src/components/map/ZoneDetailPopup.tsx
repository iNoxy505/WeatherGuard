import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../GlassCard';
import { WeatherIcon } from '../WeatherIcon';
import { RiskZone, RISK_STROKE_COLORS } from '../../data/gisData';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

/**
 * Detail popup shown when a risk zone (flood or landslide) is tapped on the map.
 * Displays telemetry data, probability, confidence level, and data sources.
 */
interface Props {
  zone: RiskZone;
  onClose: () => void;
}

export const ZoneDetailPopup: React.FC<Props> = ({ zone, onClose }) => {
  const { colors, isDark } = useTheme();
  const riskColor = RISK_STROKE_COLORS[zone.risk];
  const t = zone.telemetry;
  const c = zone.confidence;

  const confidenceColor =
    c.level === 'HIGH' ? '#4ADE80' : c.level === 'MEDIUM' ? '#FACC15' : '#F87171';

  return (
    <GlassCard style={styles.container} glowColor={riskColor}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <WeatherIcon
            name={zone.type === 'flood' ? 'flood' : 'landslide'}
            size={18}
            color={riskColor}
          />
          <View>
            <Text style={[styles.zoneName, { color: colors.text.primary }]}>
              {zone.name}
            </Text>
            <Text style={[styles.zoneType, { color: colors.text.muted }]}>
              {zone.type === 'flood' ? 'FLOOD RISK' : 'LANDSLIDE RISK'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={{ color: colors.text.muted, fontSize: 18 }}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Risk Badge + Probability */}
      <View style={styles.riskRow}>
        <View style={[styles.riskBadge, { backgroundColor: riskColor + '25', borderColor: riskColor }]}>
          <Text style={[styles.riskLabel, { color: riskColor }]}>{zone.risk}</Text>
        </View>
        <View style={styles.probContainer}>
          <Text style={[styles.probValue, { color: riskColor }]}>{zone.probability}%</Text>
          <Text style={[styles.probLabel, { color: colors.text.muted }]}>Probability</Text>
        </View>
        <View style={styles.trendContainer}>
          <Text style={[styles.trendArrow, {
            color: t.trend === 'RISING' ? '#F87171' : t.trend === 'FALLING' ? '#4ADE80' : '#FACC15'
          }]}>
            {t.trend === 'RISING' ? '↑' : t.trend === 'FALLING' ? '↓' : '→'}
          </Text>
          <Text style={[styles.trendLabel, { color: colors.text.muted }]}>{t.trend}</Text>
        </View>
      </View>

      {/* Telemetry Grid */}
      <View style={styles.telemetryGrid}>
        <TelemetryItem label="Rainfall" value={`${t.rainfall_mm_hr}`} unit="mm/hr" colors={colors} />
        <TelemetryItem label="Water Level" value={`${t.waterLevel_m}`} unit="m" colors={colors} />
        <TelemetryItem label="Soil Sat." value={`${t.soilSaturation_pct}`} unit="%" colors={colors} />
        <TelemetryItem label="Slope" value={`${t.slope_deg}`} unit="°" colors={colors} />
        <TelemetryItem label="Elevation" value={`${t.elevation_m}`} unit="m" colors={colors} />
        <TelemetryItem label="Flow Accum." value={`${t.flowAccumulation}`} unit="kU" colors={colors} />
      </View>

      {/* Confidence / Data Quality */}
      <View style={[styles.confidenceSection, { borderTopColor: colors.border.subtle }]}>
        <View style={styles.confidenceHeader}>
          <Text style={[styles.confidenceLabel, { color: colors.text.tertiary }]}>
            DATA CONFIDENCE
          </Text>
          <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor + '25', borderColor: confidenceColor }]}>
            <Text style={[styles.confidenceValue, { color: confidenceColor }]}>{c.level}</Text>
          </View>
        </View>
        <View style={styles.sourcesList}>
          {c.availableSources.map((s, i) => (
            <Text key={i} style={[styles.sourceItem, { color: '#4ADE80' }]}>✓ {s}</Text>
          ))}
          {c.unavailableSources.map((s, i) => (
            <Text key={i} style={[styles.sourceItem, { color: '#F87171' }]}>✕ {s}</Text>
          ))}
        </View>
      </View>
    </GlassCard>
  );
};

const TelemetryItem: React.FC<{
  label: string;
  value: string;
  unit: string;
  colors: any;
}> = ({ label, value, unit, colors }) => (
  <View style={styles.telemetryItem}>
    <Text style={[styles.telemetryValue, { color: colors.text.primary }]}>
      {value}
      <Text style={[styles.telemetryUnit, { color: colors.text.muted }]}> {unit}</Text>
    </Text>
    <Text style={[styles.telemetryLabel, { color: colors.text.tertiary }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  zoneName: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  zoneType: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  riskBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  riskLabel: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    letterSpacing: 1,
  },
  probContainer: {
    alignItems: 'center',
  },
  probValue: {
    fontSize: FontSize.xl,
    fontWeight: '900',
  },
  probLabel: {
    fontSize: FontSize.xs - 1,
    fontWeight: '600',
  },
  trendContainer: {
    alignItems: 'center',
  },
  trendArrow: {
    fontSize: FontSize.xl,
    fontWeight: '900',
  },
  trendLabel: {
    fontSize: FontSize.xs - 1,
    fontWeight: '600',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  telemetryItem: {
    width: '30%',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  telemetryValue: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  telemetryUnit: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  telemetryLabel: {
    fontSize: FontSize.xs - 1,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  confidenceSection: {
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confidenceLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  confidenceValue: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  sourcesList: {
    gap: 2,
  },
  sourceItem: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
