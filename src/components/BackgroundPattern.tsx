import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface BackgroundPatternProps {
  isDark: boolean;
  variant?: 'dots' | 'grid' | 'topography';
}

/**
 * SVG-based decorative background pattern overlay.
 * Renders subtle patterns that adapt to dark/light theme.
 */
export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  isDark,
  variant = 'topography',
}) => {
  const opacity = isDark ? 0.04 : 0.06;
  const color = isDark ? '#FFFFFF' : '#000000';

  const renderDots = () => {
    const dots: React.ReactNode[] = [];
    const spacing = 30;
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        dots.push(
          <Circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={1}
            fill={color}
            opacity={opacity}
          />
        );
      }
    }
    return dots;
  };

  const renderGrid = () => {
    const lines: React.ReactNode[] = [];
    const spacing = 40;
    for (let x = 0; x < width; x += spacing) {
      lines.push(
        <Line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke={color}
          strokeWidth={0.5}
          opacity={opacity}
        />
      );
    }
    for (let y = 0; y < height; y += spacing) {
      lines.push(
        <Line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={color}
          strokeWidth={0.5}
          opacity={opacity}
        />
      );
    }
    return lines;
  };

  const renderTopography = () => {
    const circles: React.ReactNode[] = [];
    const centerPoints = [
      { cx: width * 0.2, cy: height * 0.15 },
      { cx: width * 0.7, cy: height * 0.3 },
      { cx: width * 0.4, cy: height * 0.6 },
      { cx: width * 0.85, cy: height * 0.75 },
      { cx: width * 0.15, cy: height * 0.85 },
    ];

    centerPoints.forEach((point, pIdx) => {
      for (let r = 20; r <= 120; r += 18) {
        circles.push(
          <Circle
            key={`topo-${pIdx}-${r}`}
            cx={point.cx}
            cy={point.cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            opacity={opacity * 0.8}
          />
        );
      }
    });
    return circles;
  };

  const renderPattern = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'grid':
        return renderGrid();
      case 'topography':
      default:
        return renderTopography();
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <G>{renderPattern()}</G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
