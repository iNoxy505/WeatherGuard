import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, Polygon, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { useLocationStore } from '../../state/useLocationStore';
import { useMapLayerStore } from '../../state/useMapLayerStore';
import { LayerControlPanel } from '../../components/map/LayerControlPanel';
import { TimelineSlider } from '../../components/map/TimelineSlider';
import { ZoneDetailPopup } from '../../components/map/ZoneDetailPopup';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

import {
  SHIMLA_REGION,
  FLOOD_ZONES,
  LANDSLIDE_ZONES,
  SAFETY_POINTS,
  SENSOR_POINTS,
  RAIN_CELLS,
  CLOUD_REGIONS,
  ROAD_SEGMENTS,
  RIVER_SEGMENTS,
  GEO_EVAC_ROUTES,
  FORECAST_FRAMES,
  HISTORICAL_FRAMES,
  RISK_FILL_COLORS,
  RISK_STROKE_COLORS,
  RAIN_INTENSITY_COLOR,
  ROAD_CONDITION_COLORS,
  SAFETY_POINT_COLORS,
  RiskZone,
  RiskLevel,
} from '../../data/gisData';

const { width, height } = Dimensions.get('window');

// ─── DARK MAP STYLE ──────────────────────────────────
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
];

// ─── SAFETY POINT MARKER EMOJI ───────────────────────
const SAFETY_EMOJI: Record<string, string> = {
  shelter: '🏠',
  hospital: '🏥',
  relief_center: '⛑️',
  school: '🏫',
};

// ─── SENSOR MARKER EMOJI ─────────────────────────────
const SENSOR_EMOJI: Record<string, string> = {
  rain: '🌧️',
  water_level: '🌊',
  soil: '🌱',
};

// ─── MAIN COMPONENT ─────────────────────────────────
export const MapViewScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { latitude, longitude, isLocating, fetchLocation } = useLocationStore();
  const {
    mapMode,
    mapStyle,
    timeMode,
    timelineHour,
    layers,
    isLayerPanelOpen,
    toggleLayerPanel,
    selectedZoneId,
    setSelectedZoneId,
  } = useMapLayerStore();

  const mapRef = useRef<MapView>(null);

  // Helper: check if a layer is enabled
  const isLayerOn = (id: string) => layers.find((l) => l.id === id)?.enabled ?? false;

  // ─── TIME-DEPENDENT RISK LEVELS ─────────────
  const getTimeAdjustedRisk = (zoneId: string, type: 'flood' | 'landslide'): RiskLevel | null => {
    if (timeMode === 'CURRENT') return null; // use zone's default
    const frames = timeMode === 'FORECAST' ? FORECAST_FRAMES : HISTORICAL_FRAMES;
    const idx = Math.min(Math.abs(timelineHour), frames.length - 1);
    const frame = frames[idx];
    const riskMap = type === 'flood' ? frame.floodRisk : frame.landslideRisk;
    return (riskMap[zoneId] as RiskLevel) ?? null;
  };

  // ─── SELECTED ZONE DATA ─────────────────────
  const selectedZone: RiskZone | null = useMemo(() => {
    if (!selectedZoneId) return null;
    return (
      FLOOD_ZONES.find((z) => z.id === selectedZoneId) ||
      LANDSLIDE_ZONES.find((z) => z.id === selectedZoneId) ||
      null
    );
  }, [selectedZoneId]);

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleLocateMe = () => {
    fetchLocation();
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      mapRef.current?.animateToRegion(SHIMLA_REGION);
    }
  };

  // ─── RENDER ────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ═══ MAP ═══ */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapStyle}
        initialRegion={SHIMLA_REGION}
        customMapStyle={isDark ? darkMapStyle : undefined}
        pitchEnabled={mapMode === '3D'}
        rotateEnabled={mapMode === '3D'}
        camera={
          mapMode === '3D'
            ? {
                center: { latitude: SHIMLA_REGION.latitude, longitude: SHIMLA_REGION.longitude },
                pitch: 55,
                heading: 30,
                altitude: 3000,
                zoom: 14,
              }
            : undefined
        }
      >
        {/* ── RAIN LAYER ──────────────────── */}
        {isLayerOn('rain') &&
          RAIN_CELLS.map((cell) => (
            <Circle
              key={cell.id}
              center={cell.coordinate}
              radius={cell.radius_m}
              fillColor={RAIN_INTENSITY_COLOR(cell.intensity_mm_hr)}
              strokeColor="transparent"
            />
          ))}

        {/* ── CLOUD LAYER ─────────────────── */}
        {isLayerOn('clouds') &&
          CLOUD_REGIONS.map((cloud) => {
            // Color based on rain density (0-100)
            const density = cloud.rainDensity || 0;
            let fillColor = 'rgba(200, 200, 210, 0.20)'; // light/stratus
            if (density > 75) {
              fillColor = 'rgba(100, 100, 120, 0.55)'; // dense/cumulonimbus
            } else if (density > 40) {
              fillColor = 'rgba(160, 160, 180, 0.40)'; // medium/cumulus
            }

            return (
              <Polygon
                key={cloud.id}
                coordinates={cloud.coordinates}
                fillColor={fillColor}
                strokeColor="rgba(150, 150, 170, 0.4)"
                strokeWidth={1}
              />
            );
          })}

        {/* ── WIND DIRECTION LAYER ──────────── */}
        {isLayerOn('wind') &&
          CLOUD_REGIONS.map((cloud) => {
            // Find rough center of cloud for wind marker
            const latSum = cloud.coordinates.reduce((sum, c) => sum + c.latitude, 0);
            const lngSum = cloud.coordinates.reduce((sum, c) => sum + c.longitude, 0);
            const center = {
              latitude: latSum / cloud.coordinates.length,
              longitude: lngSum / cloud.coordinates.length,
            };

            return (
              <Marker
                key={`wind_${cloud.id}`}
                coordinate={center}
                rotation={cloud.windDirection}
                anchor={{ x: 0.5, y: 0.5 }}
                title={`Wind: ${cloud.windSpeed} km/h`}
                description={`Direction: ${cloud.windDirection}°`}
                icon={undefined} // Default marker
                flat={true} // Rotates with the map
              >
                <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 24, transform: [{ rotate: '-45deg' }] }}>➤</Text>
                </View>
              </Marker>
            );
          })}

        {/* ── FLOOD RISK LAYER ────────────── */}
        {isLayerOn('flood') &&
          FLOOD_ZONES.map((zone) => {
            const risk = getTimeAdjustedRisk(zone.id, 'flood') ?? zone.risk;
            return (
              <Polygon
                key={zone.id}
                coordinates={zone.coordinates}
                fillColor={RISK_FILL_COLORS[risk]}
                strokeColor={RISK_STROKE_COLORS[risk]}
                strokeWidth={selectedZoneId === zone.id ? 3 : 1.5}
                tappable
                onPress={() =>
                  setSelectedZoneId(zone.id === selectedZoneId ? null : zone.id)
                }
              />
            );
          })}

        {/* ── LANDSLIDE RISK LAYER ────────── */}
        {isLayerOn('landslide') &&
          LANDSLIDE_ZONES.map((zone) => {
            const risk = getTimeAdjustedRisk(zone.id, 'landslide') ?? zone.risk;
            return (
              <Polygon
                key={zone.id}
                coordinates={zone.coordinates}
                fillColor={RISK_FILL_COLORS[risk]}
                strokeColor={RISK_STROKE_COLORS[risk]}
                strokeWidth={selectedZoneId === zone.id ? 3 : 1.5}
                tappable
                lineDashPattern={[6, 4]} // dashed to distinguish from flood
                onPress={() =>
                  setSelectedZoneId(zone.id === selectedZoneId ? null : zone.id)
                }
              />
            );
          })}

        {/* ── WATER LEVEL LAYER (rivers) ──── */}
        {isLayerOn('waterLevel') &&
          RIVER_SEGMENTS.map((river) => {
            const isFlooding = river.waterLevel >= river.floodStage;
            return (
              <Polyline
                key={river.id}
                coordinates={river.waypoints}
                strokeColor={isFlooding ? '#F87171' : '#60A5FA'}
                strokeWidth={isFlooding ? 4 : 2.5}
                lineDashPattern={isFlooding ? undefined : [8, 4]}
              />
            );
          })}

        {/* ── ROAD LAYER ──────────────────── */}
        {isLayerOn('roads') &&
          ROAD_SEGMENTS.map((road) => (
            <Polyline
              key={road.id}
              coordinates={road.waypoints}
              strokeColor={ROAD_CONDITION_COLORS[road.condition]}
              strokeWidth={2}
              lineDashPattern={road.condition === 'BLOCKED' ? [4, 4] : undefined}
            />
          ))}

        {/* ── SAFE ZONE LAYER ─────────────── */}
        {isLayerOn('safeZones') &&
          SAFETY_POINTS.filter((sp) => sp.type === 'relief_center' || sp.type === 'shelter').map(
            (sp) => (
              <Circle
                key={`sz_${sp.id}`}
                center={sp.coordinate}
                radius={250}
                fillColor="rgba(74, 222, 128, 0.12)"
                strokeColor="#4ADE80"
                strokeWidth={1}
              />
            )
          )}

        {/* ── SHELTER MARKERS ─────────────── */}
        {isLayerOn('shelters') &&
          SAFETY_POINTS.filter((sp) => sp.type === 'shelter' || sp.type === 'relief_center' || sp.type === 'school').map(
            (sp) => (
              <Marker
                key={sp.id}
                coordinate={sp.coordinate}
                title={sp.name}
                description={`${sp.type.toUpperCase()} • Capacity: ${sp.capacity} • ${sp.status}`}
                pinColor={SAFETY_POINT_COLORS[sp.type]}
              />
            )
          )}

        {/* ── HOSPITAL MARKERS ────────────── */}
        {isLayerOn('hospitals') &&
          SAFETY_POINTS.filter((sp) => sp.type === 'hospital').map((sp) => (
            <Marker
              key={sp.id}
              coordinate={sp.coordinate}
              title={sp.name}
              description={`HOSPITAL • Capacity: ${sp.capacity} • ${sp.status}`}
              pinColor="#60A5FA"
            />
          ))}

        {/* ── EVACUATION ROUTE LAYER ──────── */}
        {isLayerOn('evacRoutes') &&
          GEO_EVAC_ROUTES.map((route) => (
            <React.Fragment key={route.id}>
              <Polyline
                coordinates={route.waypoints}
                strokeColor="#4ADE80"
                strokeWidth={3}
                lineDashPattern={[10, 6]}
              />
              {/* End marker */}
              <Marker
                coordinate={route.waypoints[route.waypoints.length - 1]}
                title={route.toName}
                description={`${route.distanceKm}km • ${route.estimatedMinutes}min • ${route.roadCondition}`}
                pinColor="#4ADE80"
              />
            </React.Fragment>
          ))}

        {/* ── SENSOR MARKERS ──────────────── */}
        {isLayerOn('rainSensors') &&
          SENSOR_POINTS.filter((s) => s.type === 'rain').map((s) => (
            <Marker
              key={s.id}
              coordinate={s.coordinate}
              title={`${s.name} (${s.status})`}
              description={`${s.reading} ${s.unit} • Updated: ${s.lastUpdated}`}
              pinColor={s.status === 'ONLINE' ? '#60A5FA' : '#64748B'}
            />
          ))}
        {isLayerOn('waterSensors') &&
          SENSOR_POINTS.filter((s) => s.type === 'water_level').map((s) => (
            <Marker
              key={s.id}
              coordinate={s.coordinate}
              title={`${s.name} (${s.status})`}
              description={`${s.reading} ${s.unit} • Updated: ${s.lastUpdated}`}
              pinColor={s.status === 'ONLINE' ? '#818CF8' : '#64748B'}
            />
          ))}
        {isLayerOn('soilSensors') &&
          SENSOR_POINTS.filter((s) => s.type === 'soil').map((s) => (
            <Marker
              key={s.id}
              coordinate={s.coordinate}
              title={`${s.name} (${s.status})`}
              description={`${s.reading} ${s.unit} • Updated: ${s.lastUpdated}`}
              pinColor={s.status === 'ONLINE' ? '#A78BFA' : '#64748B'}
            />
          ))}

        {/* ── USER LOCATION ───────────────── */}
        {latitude && longitude && (
          <Marker
            coordinate={{ latitude, longitude }}
            title="Your Location"
            pinColor={colors.accent.cyan}
          />
        )}

        {/* ── FALLBACK SHIMLA PIN ─────────── */}
        {(!latitude || !longitude) && (
          <Marker
            coordinate={{ latitude: SHIMLA_REGION.latitude, longitude: SHIMLA_REGION.longitude }}
            title="Shimla Center"
            pinColor={colors.accent.cyan}
          />
        )}
      </MapView>

      {/* ═══ FLOATING UI OVERLAYS ═══ */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {/* ── Top Bar ─────────────────────── */}
        <View style={styles.topBar}>
          <GlassCard style={styles.headerCard}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  WEATHERGUARD MAP
                </Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  {latitude
                    ? `GPS: ${latitude.toFixed(4)}, ${longitude?.toFixed(4)}`
                    : 'Shimla Region, NW India'}{' '}
                  • Windy.com API
                </Text>
              </View>
              {/* Mode badges */}
              <View style={styles.modeBadges}>
                <View
                  style={[
                    styles.modeBadge,
                    {
                      backgroundColor: colors.accent.cyanGlow,
                      borderColor: colors.accent.cyan,
                    },
                  ]}
                >
                  <Text style={[styles.modeBadgeText, { color: colors.accent.cyan }]}>
                    {mapMode}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* ── Action Buttons Row ─────────── */}
          <View style={styles.actionRow}>
            {/* Layer Toggle */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isLayerPanelOpen
                    ? colors.accent.cyan
                    : colors.bg.glass,
                  borderColor: colors.accent.cyan,
                },
              ]}
              onPress={toggleLayerPanel}
            >
              <WeatherIcon
                name="layers"
                size={16}
                color={isLayerPanelOpen ? (isDark ? '#0A0E1A' : '#fff') : colors.accent.cyan}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  {
                    color: isLayerPanelOpen
                      ? (isDark ? '#0A0E1A' : '#fff')
                      : colors.accent.cyan,
                  },
                ]}
              >
                Layers
              </Text>
            </TouchableOpacity>

            {/* Locate Me */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.bg.glass, borderColor: colors.accent.cyan },
              ]}
              onPress={handleLocateMe}
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

            {/* Evacuation toggle */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isLayerOn('evacRoutes')
                    ? colors.severity.low.text
                    : colors.bg.glass,
                  borderColor: colors.severity.low.text,
                },
              ]}
              onPress={() => useMapLayerStore.getState().toggleLayer('evacRoutes')}
            >
              <WeatherIcon
                name="route"
                size={16}
                color={isLayerOn('evacRoutes') ? (isDark ? '#0A0E1A' : '#fff') : colors.severity.low.text}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  {
                    color: isLayerOn('evacRoutes')
                      ? (isDark ? '#0A0E1A' : '#fff')
                      : colors.severity.low.text,
                  },
                ]}
              >
                Safe Exit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer pushes detail popup to bottom */}
        <View style={styles.spacer} pointerEvents="none" />

        {/* ── Active Layers Badge ─────────── */}
        <View style={styles.activeBadgeRow}>
          {layers
            .filter((l) => l.enabled)
            .map((l) => (
              <View
                key={l.id}
                style={[
                  styles.activeBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(0, 212, 255, 0.10)'
                      : 'rgba(2, 132, 199, 0.08)',
                    borderColor: colors.accent.cyan + '40',
                  },
                ]}
              >
                <Text style={[styles.activeBadgeText, { color: colors.accent.cyan }]}>
                  {l.label}
                </Text>
              </View>
            ))}
        </View>

        {/* ── Zone Detail Popup ────────────── */}
        {selectedZone && (
          <ZoneDetailPopup
            zone={selectedZone}
            onClose={() => setSelectedZoneId(null)}
          />
        )}
      </View>

      {/* ═══ TIMELINE SLIDER (bottom) ═══ */}
      <TimelineSlider />

      {/* ═══ LAYER CONTROL PANEL (slides from right) ═══ */}
      <LayerControlPanel />
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: Spacing.md,
  },
  topBar: {
    gap: Spacing.sm,
  },
  headerCard: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  modeBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  modeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  spacer: {
    flex: 1,
  },
  activeBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  activeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
