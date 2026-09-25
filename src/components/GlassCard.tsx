import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  const { colors, isDark } = useTheme();

  return (
    <LinearGradient
      colors={colors.gradient.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        {
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
          ...colors.shadow.card,
        },
        !noPadding && { padding: Spacing.lg },
        glowColor ? {
          borderColor: glowColor,
          shadowColor: glowColor,
          shadowOpacity: isDark ? 0.3 : 0.4,
          shadowRadius: 15,
          elevation: 8,
        } : undefined,
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  }
});
