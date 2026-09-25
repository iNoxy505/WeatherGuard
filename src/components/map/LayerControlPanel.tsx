import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useMapLayerStore, MapMode, MapStyle, TimeMode, LayerConfig } from '../../state/useMapLayerStore';
import { GlassCard } from '../GlassCard';
import { WeatherIcon, IconName } from '../WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

// ─── Layer Toggle Row ─────────────────────────────────
const LayerToggleRow: React.FC<{
  layer: LayerConfig;
  onToggle: () => void;
  colors: any;
}> = ({ layer, onToggle, colors }) => (
  <TouchableOpacity
    style={[
      styles.layerRow,
      {
        backgroundColor: layer.enabled
          ? (colors.accent.cyanGlow || 'rgba(0,212,255,0.12)')
          : 'transparent',
        borderColor: layer.enabled ? colors.accent.cyan : colors.border.subtle,
      },
    ]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={[
      styles.checkbox,
      {
        borderColor: layer.enabled ? colors.accent.cyan : colors.text.muted,
        backgroundColor: layer.enabled ? colors.accent.cyan : 'transparent',
      },
    ]}>
      {layer.enabled && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text
      style={[
        styles.layerLabel,
        { color: layer.enabled ? colors.text.primary : colors.text.secondary },
      ]}
    >
      {layer.label}
    </Text>
  </TouchableOpacity>
);

// ─── Section Header ───────────────────────────────────
const SectionHeader: React.FC<{ title: string; icon: IconName; colors: any }> = ({
  title,
  icon,
  colors,
}) => (
  <View style={styles.sectionHeader}>
    <WeatherIcon name={icon} size={14} color={colors.accent.cyan} />
    <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>{title}</Text>
  </View>
);

// ─── Main Component ───────────────────────────────────
export const LayerControlPanel: React.FC = () => {
  const { colors, isDark } = useTheme();
  const {
    mapMode,
    setMapMode,
    mapStyle,
    setMapStyle,
    timeMode,
    setTimeMode,
    layers,
    toggleLayer,
    isLayerPanelOpen,
    toggleLayerPanel,
  } = useMapLayerStore();

  if (!isLayerPanelOpen) return null;

  const environmentalLayers = layers.filter((l) => l.category === 'environmental');
  const safetyLayers = layers.filter((l) => l.category === 'safety');
  const sensorLayers = layers.filter((l) => l.category === 'sensors');

  return (
    <View style={[styles.panelOverlay]}>
      <TouchableOpacity style={styles.backdrop} onPress={toggleLayerPanel} activeOpacity={1} />
      <View
        style={[
          styles.panel,
          {
            backgroundColor: isDark ? 'rgba(10, 14, 26, 0.95)' : 'rgba(241, 245, 249, 0.97)',
            borderColor: colors.border.default,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.panelHeader}>
          <Text style={[styles.panelTitle, { color: colors.text.primary }]}>
            MAP LAYERS
          </Text>
          <TouchableOpacity onPress={toggleLayerPanel} style={styles.closeBtn}>
            <Text style={{ color: colors.text.muted, fontSize: 20 }}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* ── Base Map Mode ──────────── */}
          <SectionHeader title="VIEW MODE" icon="map" colors={colors} />
          <View style={styles.toggleRow}>
            {(['2D', '3D'] as MapMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      mapMode === mode ? colors.accent.cyan : colors.bg.glass,
                    borderColor:
                      mapMode === mode ? colors.accent.cyan : colors.border.subtle,
                  },
                ]}
                onPress={() => setMapMode(mode)}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    {
                      color:
                        mapMode === mode
                          ? (isDark ? '#0A0E1A' : '#FFFFFF')
                          : colors.text.secondary,
                    },
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Map Style ──────────────── */}
          <SectionHeader title="MAP STYLE" icon="layers" colors={colors} />
          <View style={styles.toggleRow}>
            {([
              { key: 'standard', label: 'Standard' },
              { key: 'satellite', label: 'Satellite' },
              { key: 'terrain', label: 'Terrain' },
            ] as { key: MapStyle; label: string }[]).map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.timeModeBtn, // Reusing timeModeBtn styles since it's 3 items
                  {
                    backgroundColor:
                      mapStyle === key ? colors.accent.cyan : colors.bg.glass,
                    borderColor:
                      mapStyle === key ? colors.accent.cyan : colors.border.subtle,
                  },
                ]}
                onPress={() => setMapStyle(key)}
              >
                <Text
                  style={[
                    styles.timeModeBtnText,
                    {
                      color:
                        mapStyle === key
                          ? (isDark ? '#0A0E1A' : '#FFFFFF')
                          : colors.text.secondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Time Mode ─────────────── */}
          <SectionHeader title="TIME MODE" icon="clock" colors={colors} />
          <View style={styles.toggleRow}>
            {([
              { key: 'CURRENT', label: 'Current' },
              { key: 'FORECAST', label: 'Forecast' },
              { key: 'HISTORICAL', label: 'History' },
            ] as { key: TimeMode; label: string }[]).map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.timeModeBtn,
                  {
                    backgroundColor:
                      timeMode === key ? colors.accent.cyan : colors.bg.glass,
                    borderColor:
                      timeMode === key ? colors.accent.cyan : colors.border.subtle,
                  },
                ]}
                onPress={() => setTimeMode(key)}
              >
                <Text
                  style={[
                    styles.timeModeBtnText,
                    {
                      color:
                        timeMode === key
                          ? (isDark ? '#0A0E1A' : '#FFFFFF')
                          : colors.text.secondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Environmental Layers ──── */}
          <SectionHeader title="ENVIRONMENTAL" icon="rain" colors={colors} />
          {environmentalLayers.map((layer) => (
            <LayerToggleRow
              key={layer.id}
              layer={layer}
              onToggle={() => toggleLayer(layer.id)}
              colors={colors}
            />
          ))}

          {/* ── Safety Layers ─────────── */}
          <SectionHeader title="SAFETY" icon="safe" colors={colors} />
          {safetyLayers.map((layer) => (
            <LayerToggleRow
              key={layer.id}
              layer={layer}
              onToggle={() => toggleLayer(layer.id)}
              colors={colors}
            />
          ))}

          {/* ── Sensor Layers ─────────── */}
          <SectionHeader title="SENSORS" icon="sensor" colors={colors} />
          {sensorLayers.map((layer) => (
            <LayerToggleRow
              key={layer.id}
              layer={layer}
              onToggle={() => toggleLayer(layer.id)}
              colors={colors}
            />
          ))}
        </ScrollView>

        {/* Data source badge */}
        <View style={[styles.dataBadge, { borderTopColor: colors.border.subtle }]}>
          <Text style={[styles.dataBadgeText, { color: colors.text.muted }]}>
            Data: Windy.com API • SRTM DEM • IMD • Sentinel-1/2
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panelOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  panel: {
    width: PANEL_WIDTH,
    borderLeftWidth: 1,
    paddingTop: 60,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  panelTitle: {
    fontSize: FontSize.md,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  timeModeBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeModeBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: 4,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  layerLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dataBadge: {
    borderTopWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  dataBadgeText: {
    fontSize: FontSize.xs - 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
