import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
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
  const { colors } = useTheme();
  const isOutline = variant === 'outline';
  const sizeStyle = styles[size];

  const gradientMap: Record<string, string[]> = {
    primary: colors.gradient.accent,
    danger: colors.gradient.danger,
    warm: colors.gradient.warm,
  };

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: colors.accent.cyan }, sizeStyle, disabled && styles.disabled, style]}
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={gradientMap[variant] || gradientMap.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyle]}
      >
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
  gradient: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
    fontWeight: '700',
    letterSpacing: 0.3,
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
