import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect, Circle as SvgCircle, Text as SvgText, Path as SvgPath, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { BackgroundPattern } from '../../components/BackgroundPattern';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { useLocationStore } from '../../state/useLocationStore';
import { EVACUATION_ROUTES, getNearestRoute, getRoutePathD, EvacuationRoute } from '../../data/evacuationRoutes';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - 32;
const MAP_HEIGHT = 320;

interface Zone {
  id: string;
  name: string;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  landslideRisk: number; // 0-100
  x: number;
  y: number;
  w: number;
  h: number;
}

const ZONES: Zone[] = [
  { id: 'z1', name: 'Ward 1', risk: 'LOW', landslideRisk: 12, x: 10, y: 10, w: 120, h: 90 },
  { id: 'z2', name: 'Ward 2', risk: 'MODERATE', landslideRisk: 35, x: 140, y: 10, w: 110, h: 90 },
  { id: 'z3', name: 'Ward 3', risk: 'HIGH', landslideRisk: 72, x: 260, y: 10, w: 80, h: 90 },
  { id: 'z4', name: 'Market Area', risk: 'LOW', landslideRisk: 5, x: 10, y: 110, w: 100, h: 100 },
  { id: 'z5', name: 'River Bank', risk: 'CRITICAL', landslideRisk: 88, x: 120, y: 110, w: 130, h: 100 },
  { id: 'z6', name: 'Hilltop', risk: 'MODERATE', landslideRisk: 45, x: 260, y: 110, w: 80, h: 100 },
  { id: 'z7', name: 'School Zone', risk: 'LOW', landslideRisk: 8, x: 10, y: 220, w: 140, h: 80 },
  { id: 'z8', name: 'Relief Center', risk: 'LOW', landslideRisk: 3, x: 160, y: 220, w: 180, h: 80 },
];

const ROAD_CONDITION_COLORS: Record<string, string> = {
  CLEAR: '#4ADE80',
  MODERATE: '#FACC15',
  BLOCKED: '#F87171',
};

export const MapViewScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { latitude, longitude, isLocating, fetchLocation } = useLocationStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [activeRoute, setActiveRoute] = useState<EvacuationRoute | null>(null);

  const RISK_COLORS: Record<string, string> = {
    LOW: isDark ? 'rgba(74, 222, 128, 0.3)' : 'rgba(22, 163, 74, 0.15)',
    MODERATE: isDark ? 'rgba(250, 204, 21, 0.3)' : 'rgba(202, 138, 4, 0.15)',
    HIGH: isDark ? 'rgba(251, 146, 60, 0.35)' : 'rgba(234, 88, 12, 0.15)',
    CRITICAL: isDark ? 'rgba(248, 113, 113, 0.4)' : 'rgba(220, 38, 38, 0.15)',
  };

  const RISK_STROKE: Record<string, string> = {
    LOW: colors.severity.low.text,
    MODERATE: colors.severity.moderate.text,
    HIGH: colors.severity.high.text,
    CRITICAL: colors.severity.critical.text,
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Map real GPS to SVG coordinates (rough approximation for demo)
  const userMarkerX = latitude ? 185 + ((longitude || 0) % 1) * 100 : 185;
  const userMarkerY = latitude ? 155 + ((latitude || 0) % 1) * 50 : 155;

  const findUserZone = (): string | null => {
    // Simple check: which zone rectangle contains the user marker
    for (const zone of ZONES) {
      if (
        userMarkerX >= zone.x &&
        userMarkerX <= zone.x + zone.w &&
        userMarkerY >= zone.y &&
        userMarkerY <= zone.y + zone.h
      ) {
        return zone.id;
      }
    }
    return 'z5'; // Default to River Bank for demo
  };

  const handleSafeExit = () => {
    const userZone = findUserZone() || 'z5';
    const route = getNearestRoute(userZone);
    if (route) {
      setActiveRoute(route);
      setShowRoutes(true);
    }
  };

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <BackgroundPattern isDark={isDark} variant="grid" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>Zone Risk Map</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {latitude ? `GPS: ${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` : 'Visualize safety levels across zones'}
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.accent.cyanGlow }]}>
            <WeatherIcon name="map" size={22} color={colors.accent.cyan} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.accent.cyanGlow, borderColor: colors.accent.cyan }]}
            onPress={fetchLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={colors.accent.cyan} />
            ) : (
              <WeatherIcon name="location" size={16} color={colors.accent.cyan} />
            )}
            <Text style={[styles.actionBtnText, { color: colors.accent.cyan }]}>
              {isLocating ? 'Locating...' : 'Locate Me'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.severity.low.bg, borderColor: colors.severity.low.text }]}
            onPress={handleSafeExit}
          >
            <WeatherIcon name="route" size={16} color={colors.severity.low.text} />
            <Text style={[styles.actionBtnText, { color: colors.severity.low.text }]}>Safe Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, showRoutes ? { backgroundColor: colors.severity.moderate.bg, borderColor: colors.severity.moderate.text } : { backgroundColor: colors.bg.glass, borderColor: colors.border.default }]}
            onPress={() => { setShowRoutes(!showRoutes); if (!showRoutes) setActiveRoute(null); }}
          >
            <WeatherIcon name="landslide" size={16} color={showRoutes ? colors.severity.moderate.text : colors.text.secondary} />
            <Text style={[styles.actionBtnText, { color: showRoutes ? colors.severity.moderate.text : colors.text.secondary }]}>
              {showRoutes ? 'Hide Routes' : 'All Routes'}
            </Text>
          </TouchableOpacity>
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
                  strokeWidth={selectedZone === zone.id ? 2.5 : 1.5}
                  onPress={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                />
                <SvgText
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 - 10}
                  fill={colors.text.primary}
                  fontSize={11}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {zone.name}
                </SvgText>
                <SvgText
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 + 5}
                  fill={RISK_STROKE[zone.risk]}
                  fontSize={9}
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {zone.risk}
                </SvgText>
                {/* Landslide indicator */}
                {zone.landslideRisk > 40 && (
                  <>
                    <SvgCircle
                      cx={zone.x + zone.w - 12}
                      cy={zone.y + 12}
                      r={8}
                      fill={zone.landslideRisk > 70 ? colors.severity.critical.bg : colors.severity.moderate.bg}
                      stroke={zone.landslideRisk > 70 ? colors.severity.critical.text : colors.severity.moderate.text}
                      strokeWidth={1}
                    />
                    <SvgText
                      x={zone.x + zone.w - 12}
                      y={zone.y + 15}
                      fill={zone.landslideRisk > 70 ? colors.severity.critical.text : colors.severity.moderate.text}
                      fontSize={7}
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      LS
                    </SvgText>
                  </>
                )}
              </React.Fragment>
            ))}

            {/* Evacuation routes */}
            {showRoutes && !activeRoute && EVACUATION_ROUTES.map((route) => (
              <SvgPath
                key={route.id}
                d={getRoutePathD(route)}
                fill="none"
                stroke={ROAD_CONDITION_COLORS[route.roadCondition]}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={0.7}
              />
            ))}

            {/* Active route (highlighted) */}
            {activeRoute && (
              <SvgPath
                d={getRoutePathD(activeRoute)}
                fill="none"
                stroke={colors.severity.low.text}
                strokeWidth={3}
                strokeDasharray="8 4"
                opacity={1}
              />
            )}

            {/* User location marker */}
            <SvgCircle cx={userMarkerX} cy={userMarkerY} r={6} fill={colors.accent.cyan} />
            <SvgCircle cx={userMarkerX} cy={userMarkerY} r={12} fill="none" stroke={colors.accent.cyan} strokeWidth={1.5} opacity={0.4} />
            <SvgCircle cx={userMarkerX} cy={userMarkerY} r={18} fill="none" stroke={colors.accent.cyan} strokeWidth={1} opacity={0.2} />
          </Svg>
        </GlassCard>

        {/* Active Route Card */}
        {activeRoute && (
          <GlassCard style={styles.routeCard} glowColor={colors.severity.low.text}>
            <View style={styles.routeHeader}>
              <WeatherIcon name="route" size={18} color={colors.severity.low.text} />
              <Text style={[styles.routeTitle, { color: colors.text.primary }]}>Safe Exit Route</Text>
            </View>
            <View style={styles.routeDetails}>
              <View style={styles.routeDetailItem}>
                <Text style={[styles.routeDetailLabel, { color: colors.text.tertiary }]}>Destination</Text>
                <Text style={[styles.routeDetailValue, { color: colors.text.primary }]}>{activeRoute.toName}</Text>
              </View>
              <View style={[styles.routeDetailDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.routeDetailItem}>
                <Text style={[styles.routeDetailLabel, { color: colors.text.tertiary }]}>Distance</Text>
                <Text style={[styles.routeDetailValue, { color: colors.text.primary }]}>{activeRoute.distanceKm} km</Text>
              </View>
              <View style={[styles.routeDetailDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.routeDetailItem}>
                <Text style={[styles.routeDetailLabel, { color: colors.text.tertiary }]}>ETA</Text>
                <Text style={[styles.routeDetailValue, { color: colors.text.primary }]}>{activeRoute.estimatedMinutes} min</Text>
              </View>
            </View>
            <View style={styles.routeConditionRow}>
              <View style={[styles.routeConditionDot, { backgroundColor: ROAD_CONDITION_COLORS[activeRoute.roadCondition] }]} />
              <Text style={[styles.routeConditionText, { color: colors.text.secondary }]}>
                Road condition: {activeRoute.roadCondition}
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Legend */}
        <GlassCard style={styles.legendCard}>
          <Text style={[styles.legendTitle, { color: colors.text.tertiary }]}>RISK LEGEND</Text>
          <View style={styles.legendRow}>
            {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((level) => (
              <View key={level} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: RISK_STROKE[level] }]} />
                <Text style={[styles.legendText, { color: colors.text.secondary }]}>{level}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.legendDivider, { backgroundColor: colors.border.subtle }]} />
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent.cyan }]} />
              <Text style={[styles.legendText, { color: colors.text.secondary }]}>Your Location</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.severity.moderate.text, width: 10, height: 10, borderRadius: 5 }]}>
                <Text style={{ fontSize: 5, color: '#FFF', textAlign: 'center', lineHeight: 10 }}>LS</Text>
              </View>
              <Text style={[styles.legendText, { color: colors.text.secondary }]}>Landslide Risk</Text>
            </View>
          </View>
        </GlassCard>

        {/* Zone Details */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Zone Details</Text>
        {ZONES.map((zone) => (
          <GlassCard key={zone.id} style={styles.zoneDetailCard}>
            <View style={styles.zoneRow}>
              <View style={[styles.zoneDot, { backgroundColor: RISK_STROKE[zone.risk] }]} />
              <View style={styles.zoneInfo}>
                <Text style={[styles.zoneName, { color: colors.text.primary }]}>{zone.name}</Text>
                <Text style={[styles.zoneId, { color: colors.text.muted }]}>{zone.id.toUpperCase()}</Text>
              </View>
              <View style={styles.zoneRightCol}>
                <View style={[styles.riskPill, { backgroundColor: RISK_COLORS[zone.risk] }]}>
                  <Text style={[styles.riskPillText, { color: RISK_STROKE[zone.risk] }]}>
                    {zone.risk}
                  </Text>
                </View>
                {zone.landslideRisk > 20 && (
                  <Text style={[styles.landslideSmall, {
                    color: zone.landslideRisk > 70 ? colors.severity.critical.text :
                           zone.landslideRisk > 40 ? colors.severity.moderate.text :
                           colors.text.tertiary
                  }]}>
                    LS: {zone.landslideRisk}%
                  </Text>
                )}
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },

  mapCard: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },

  // Route card
  routeCard: {
    marginBottom: Spacing.lg,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  routeTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  routeDetailLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  routeDetailValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  routeDetailDivider: {
    width: 1,
    height: 28,
  },
  routeConditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeConditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeConditionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  legendCard: {
    marginBottom: Spacing.xxl,
  },
  legendTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
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
    fontWeight: '700',
  },
  legendDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
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
  },
  zoneId: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  zoneRightCol: {
    alignItems: 'flex-end',
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
  landslideSmall: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginTop: 2,
  },
});
