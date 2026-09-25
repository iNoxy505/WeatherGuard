import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SeverityBand } from '../state/useRiskStore';
import { useTheme } from '../theme/ThemeContext';
import { FontSize } from '../theme/colors';

interface RiskGaugeProps {
  score: number;
  severity: SeverityBand;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, severity, size = 180 }) => {
  const { colors } = useTheme();
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gaugeColor = colors.severity[(severity.toLowerCase()) as keyof typeof colors.severity]?.accent || colors.severity.low.accent;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          stroke={colors.bg.glass}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Gauge fill */}
        <Circle
          stroke={gaugeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
        {/* Glow effect ring */}
        <Circle
          stroke={gaugeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth + 8}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          opacity={0.15}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={[styles.scoreText, { color: gaugeColor }]}>{score}</Text>
        <Text style={[styles.subText, { color: colors.text.tertiary }]}>INDEX / 100</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginTop: -2,
    letterSpacing: 0.5,
  },
});