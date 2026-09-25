import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { WeatherIcon } from './WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../theme/colors';

interface ForecastCardProps {
  day: string;
  condition: 'sun' | 'rain' | 'storm' | 'cloud' | 'wind';
  tempHigh: number;
  tempLow: number;
  precipitation: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  condition,
  tempHigh,
  tempLow,
  precipitation,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.bg.glass, borderColor: colors.bg.glassBorder }]}>
      <Text style={[styles.day, { color: colors.text.secondary }]}>{day}</Text>
      <WeatherIcon name={condition} size={28} color={colors.accent.cyan} />
      <View style={styles.temps}>
        <Text style={[styles.high, { color: colors.text.primary }]}>{tempHigh}°</Text>
        <Text style={[styles.low, { color: colors.text.tertiary }]}>{tempLow}°</Text>
      </View>
      <View style={styles.precip}>
        <WeatherIcon name="rain" size={10} color={colors.text.tertiary} />
        <Text style={[styles.precipText, { color: colors.text.tertiary }]}>{precipitation}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
  },
  day: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 6,
  },
  high: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  low: {
    fontSize: FontSize.sm,
  },
  precip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  precipText: {
    fontSize: FontSize.xs,
  },
});
