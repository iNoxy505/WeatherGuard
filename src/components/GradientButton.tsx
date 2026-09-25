import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme/colors';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'warm' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  size = 'medium',
}) => {
  const { colors, isDark } = useTheme();
  const isOutline = variant === 'outline';
  const sizeStyle = styles[size];

  const gradientMap: Record<string, string[]> = {
    primary: colors.gradient.accent,
    danger: colors.gradient.danger,
    warm: colors.gradient.warm,
  };

  const glowColorMap: Record<string, string> = {
    primary: colors.accent.cyan,
    danger: colors.severity.critical.accent,
    warm: colors.accent.amber,
  };

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: colors.accent.cyan, backgroundColor: isDark ? 'transparent' : 'rgba(255,255,255,0.5)' }, sizeStyle, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.accent.cyan} size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.outlineText, { color: colors.accent.cyan }, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  const activeGlow = glowColorMap[variant] || glowColorMap.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonWrapper,
        {
          shadowColor: activeGlow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.4 : 0.25,
          shadowRadius: 10,
          elevation: 6,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={gradientMap[variant] || gradientMap.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, sizeStyle]}
      >
        {/* Inner Glass Highlight for Glossy Effect */}
        <View style={styles.glassHighlight} />
        
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: BorderRadius.md,
  },
  gradient: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  glassHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    height: '50%',
    opacity: 0.8,
  },
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  medium: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: 0.5,
    zIndex: 1, // Above highlight
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  outlineButton: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
