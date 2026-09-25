import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { WeatherIcon, IconName } from './WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../theme/colors';

interface QuickActionTileProps {
  icon: IconName;
  label: string;
  subtitle?: string;
  color?: string;
  onPress: () => void;
}

export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  icon,
  label,
  subtitle,
  color,
  onPress,
}) => {
  const { colors } = useTheme();
  const tileColor = color || colors.accent.cyan;

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: colors.bg.glass, borderColor: colors.bg.glassBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${tileColor}18` }]}>
        <WeatherIcon name={icon} size={22} color={tileColor} />
      </View>
      <Text style={[styles.label, { color: colors.text.primary }]} numberOfLines={1}>{label}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.text.tertiary }]} numberOfLines={1}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '47%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
    textAlign: 'center',
  },
});
