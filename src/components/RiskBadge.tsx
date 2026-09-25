import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SeverityBand } from '../state/useRiskStore';
import { useTheme } from '../theme/ThemeContext';
import { FontSize } from '../theme/colors';

interface RiskBadgeProps {
  severity: SeverityBand;
  size?: 'small' | 'medium' | 'large';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'medium' }) => {
  const { colors } = useTheme();
  const config = colors.severity[(severity.toLowerCase()) as keyof typeof colors.severity] || colors.severity.low;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, styles[size]]}>
      <Text style={[styles.text, { color: config.text }, styles[`${size}Text`]]}>
        {severity} RISK
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: { paddingHorizontal: 6, paddingVertical: 2 },
  medium: { paddingHorizontal: 10, paddingVertical: 4 },
  large: { paddingHorizontal: 14, paddingVertical: 6 },
  text: { fontWeight: '800', letterSpacing: 0.5 },
  smallText: { fontSize: FontSize.xs },
  mediumText: { fontSize: FontSize.sm },
  largeText: { fontSize: FontSize.md },
});