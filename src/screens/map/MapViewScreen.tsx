import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect, Circle as SvgCircle, Text as SvgText } from 'react-native-svg';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - 32;
const MAP_HEIGHT = 320;

interface Zone {
  id: string;
  name: string;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  x: number;
  y: number;
  w: number;
  h: number;
}

const ZONES: Zone[] = [
  { id: 'z1', name: 'Ward 1', risk: 'LOW', x: 10, y: 10, w: 120, h: 90 },
  { id: 'z2', name: 'Ward 2', risk: 'MODERATE', x: 140, y: 10, w: 110, h: 90 },
  { id: 'z3', name: 'Ward 3', risk: 'HIGH', x: 260, y: 10, w: 80, h: 90 },
  { id: 'z4', name: 'Market Area', risk: 'LOW', x: 10, y: 110, w: 100, h: 100 },
  { id: 'z5', name: 'River Bank', risk: 'CRITICAL', x: 120, y: 110, w: 130, h: 100 },
  { id: 'z6', name: 'Hilltop', risk: 'MODERATE', x: 260, y: 110, w: 80, h: 100 },
  { id: 'z7', name: 'School Zone', risk: 'LOW', x: 10, y: 220, w: 140, h: 80 },
  { id: 'z8', name: 'Relief Center', risk: 'LOW', x: 160, y: 220, w: 180, h: 80 },
];

const RISK_COLORS: Record<string, string> = {
  LOW: 'rgba(74, 222, 128, 0.3)',
  MODERATE: 'rgba(250, 204, 21, 0.3)',
  HIGH: 'rgba(251, 146, 60, 0.35)',
  CRITICAL: 'rgba(248, 113, 113, 0.4)',
};

const RISK_STROKE: Record<string, string> = {
  LOW: '#4ADE80',
  MODERATE: '#FACC15',
  HIGH: '#FB923C',
  CRITICAL: '#F87171',
};

export const MapViewScreen: React.FC = () => {
  return (
    <LinearGradient colors={Colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Zone Risk Map</Text>
            <Text style={styles.subtitle}>Visualize safety levels across zones</Text>
          </View>
          <View style={styles.headerIcon}>
            <WeatherIcon name="map" size={22} color={Colors.accent.cyan} />
          </View>
        </View>

        {/* Map Area */}
        <GlassCard style={styles.mapCard} noPadding>
          <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH - 2} ${MAP_HEIGHT}`}>
            {ZONES.map((zone) => (
              <React.Fragment key={zone.id}>
                <Rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  rx={8}
                  fill={RISK_COLORS[zone.risk]}
                  stroke={RISK_STROKE[zone.risk]}
                  strokeWidth={1.5}
                />
                <SvgText
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 - 6}
                  fill={Colors.text.primary}
                  fontSize={11}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {zone.name}
                </SvgText>
                <SvgText
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 + 10}
                  fill={RISK_STROKE[zone.risk]}
                  fontSize={9}
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {zone.risk}
                </SvgText>
              </React.Fragment>
            ))}

            {/* Pulsing marker for user location */}
            <SvgCircle cx={185} cy={155} r={6} fill={Colors.accent.cyan} />
            <SvgCircle cx={185} cy={155} r={12} fill="none" stroke={Colors.accent.cyan} strokeWidth={1.5} opacity={0.4} />
          </Svg>
        </GlassCard>

        {/* Legend */}
        <GlassCard style={styles.legendCard}>
          <Text style={styles.legendTitle}>RISK LEGEND</Text>
          <View style={styles.legendRow}>
            {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((level) => (
              <View key={level} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: RISK_STROKE[level] }]} />
                <Text style={styles.legendText}>{level}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Zone Details */}
        <Text style={styles.sectionTitle}>Zone Details</Text>
        {ZONES.map((zone) => (
          <GlassCard key={zone.id} style={styles.zoneDetailCard}>
            <View style={styles.zoneRow}>
              <View style={[styles.zoneDot, { backgroundColor: RISK_STROKE[zone.risk] }]} />
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneId}>{zone.id.toUpperCase()}</Text>
              </View>
              <View style={[styles.riskPill, { backgroundColor: RISK_COLORS[zone.risk] }]}>
                <Text style={[styles.riskPillText, { color: RISK_STROKE[zone.risk] }]}>
                  {zone.risk}
                </Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent.cyanGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapCard: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },

  legendCard: {
    marginBottom: Spacing.xxl,
  },
  legendTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.text.tertiary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  zoneDetailCard: {
    marginBottom: Spacing.sm,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  zoneId: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  riskPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  riskPillText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
