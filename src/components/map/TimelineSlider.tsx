import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useMapLayerStore } from '../../state/useMapLayerStore';
import { FORECAST_FRAMES, HISTORICAL_FRAMES } from '../../data/gisData';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

/**
 * Timeline Slider for the map.
 * Shows a horizontal scrollable time bar at the bottom.
 * - In CURRENT mode: shows a single "NOW" indicator
 * - In FORECAST mode: shows +1h through +6h with risk level indicators
 * - In HISTORICAL mode: shows -6h through -1h with risk level indicators
 */
export const TimelineSlider: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { timeMode, timelineHour, setTimelineHour } = useMapLayerStore();

  if (timeMode === 'CURRENT') return null;

  const frames = timeMode === 'FORECAST' ? FORECAST_FRAMES.slice(1) : HISTORICAL_FRAMES;

  // Determine the overall severity for each frame (worst of any zone)
  const getFrameColor = (frame: typeof frames[0]) => {
    const allRisks = [
      ...Object.values(frame.floodRisk),
      ...Object.values(frame.landslideRisk),
    ];
    if (allRisks.includes('CRITICAL')) return '#F87171';
    if (allRisks.includes('HIGH')) return '#FB923C';
    if (allRisks.includes('MODERATE')) return '#FACC15';
    return '#4ADE80';
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(10, 14, 26, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          borderTopColor: colors.border.subtle,
        },
      ]}
    >
      {/* Mode label */}
      <View style={styles.labelRow}>
        <Text style={[styles.modeLabel, { color: colors.accent.cyan }]}>
          {timeMode === 'FORECAST' ? '⏱ FORECAST' : '📜 HISTORICAL'}
        </Text>
        <Text style={[styles.infoLabel, { color: colors.text.muted }]}>
          Rain: {frames[Math.abs(timelineHour)]?.rainfall_mm_hr ?? '--'} mm/hr  •  
          Water: {frames[Math.abs(timelineHour)]?.waterLevel_m ?? '--'} m
        </Text>
      </View>

      {/* Timeline track */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}
      >
        {frames.map((frame, idx) => {
          const isSelected = idx === Math.abs(timelineHour);
          const dotColor = getFrameColor(frame);
          return (
            <TouchableOpacity
              key={frame.hourOffset}
              style={[
                styles.tick,
                isSelected && {
                  backgroundColor: isDark ? 'rgba(0, 212, 255, 0.15)' : 'rgba(2, 132, 199, 0.10)',
                  borderColor: colors.accent.cyan,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setTimelineHour(idx)}
              activeOpacity={0.7}
            >
              {/* Risk dot */}
              <View style={[styles.riskDot, { backgroundColor: dotColor }]} />
              {/* Label */}
              <Text
                style={[
                  styles.tickLabel,
                  {
                    color: isSelected ? colors.text.primary : colors.text.muted,
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {frame.label}
              </Text>
              {/* Rainfall bar */}
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, (frame.rainfall_mm_hr / 120) * 24),
                      backgroundColor: dotColor,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm + 4,
    borderTopWidth: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  modeLabel: {
    fontSize: FontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs - 1,
  },
  track: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  tick: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    minWidth: 52,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  tickLabel: {
    fontSize: FontSize.xs,
    marginBottom: 4,
  },
  barContainer: {
    width: 14,
    height: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 10,
    borderRadius: 2,
  },
});
