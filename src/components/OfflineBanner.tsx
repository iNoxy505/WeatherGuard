import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FontSize, Spacing } from '../theme/colors';

export const OfflineBanner: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.banner}>
      <View style={[styles.indicator, { backgroundColor: colors.status.offline }]} />
      <Text style={[styles.text, { color: colors.accent.amber }]}>
        Operating Offline · Using last synced cache & SMS emergency dispatch
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});