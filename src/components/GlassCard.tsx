import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, Spacing } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glowColor,
  noPadding = false,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.bg.glass,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.bg.glassBorder,
          ...colors.shadow.card,
        },
        !noPadding && { padding: Spacing.lg },
        glowColor ? {
          borderColor: glowColor,
          shadowColor: glowColor,
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
};
