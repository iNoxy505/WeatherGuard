import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAlertStore } from '../../state/useAlertStore';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { GradientButton } from '../../components/GradientButton';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const AlertDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { alerts, markRead } = useAlertStore();
  const { colors } = useTheme();
  const alertId = route.params?.alertId;
  const alert = alerts.find((a) => a.id === alertId);

  useEffect(() => {
    if (alert && alert.is_read === 0) {
      markRead(alert.id);
    }
  }, [alertId]);

  if (!alert) {
    return (
      <LinearGradient colors={colors.gradient.primary} style={styles.container}>
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: colors.text.secondary }]}>Alert not found</Text>
        </View>
      </LinearGradient>
    );
  }

  const sevConfig: Record<string, { color: string; bgColor: string; icon: 'storm' | 'alert' | 'wind' | 'sun' }> = {
    CRITICAL: { color: colors.severity.critical.text, bgColor: colors.severity.critical.bg, icon: 'storm' },
    HIGH: { color: colors.severity.high.text, bgColor: colors.severity.high.bg, icon: 'alert' },
    MODERATE: { color: colors.severity.moderate.text, bgColor: colors.severity.moderate.bg, icon: 'wind' },
    LOW: { color: colors.severity.low.text, bgColor: colors.severity.low.bg, icon: 'sun' },
  };

  const config = sevConfig[alert.severity] || sevConfig.LOW;

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Severity Banner */}
        <View style={[styles.banner, { backgroundColor: config.bgColor }]}>
          <View style={styles.bannerInner}>
            <View style={[styles.iconCircle, { backgroundColor: `${config.color}30` }]}>
              <WeatherIcon name={config.icon} size={32} color={config.color} />
            </View>
            <View style={[styles.severityPill, { backgroundColor: `${config.color}30` }]}>
              <Text style={[styles.severityText, { color: config.color }]}>
                {alert.severity} SEVERITY
              </Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text.primary }]}>{alert.title}</Text>
        <Text style={[styles.time, { color: colors.text.tertiary }]}>
          Issued: {new Date(alert.created_at).toLocaleString()}
        </Text>

        {/* Description Card */}
        <GlassCard style={styles.descCard}>
          <Text style={[styles.descLabel, { color: colors.text.tertiary }]}>ALERT DETAILS</Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>{alert.description}</Text>
        </GlassCard>

        {/* Recommended Actions */}
        <GlassCard style={styles.actionsCard}>
          <Text style={[styles.descLabel, { color: colors.text.tertiary }]}>RECOMMENDED ACTIONS</Text>
          <View style={styles.actionRow}>
            <WeatherIcon name="check" size={14} color={colors.severity.low.text} />
            <Text style={[styles.actionText, { color: colors.text.secondary }]}>Monitor official weather updates</Text>
          </View>
          <View style={styles.actionRow}>
            <WeatherIcon name="check" size={14} color={colors.severity.low.text} />
            <Text style={[styles.actionText, { color: colors.text.secondary }]}>Prepare emergency supplies and evacuation kit</Text>
          </View>
          <View style={styles.actionRow}>
            <WeatherIcon name="check" size={14} color={colors.severity.low.text} />
            <Text style={[styles.actionText, { color: colors.text.secondary }]}>Keep phone charged for SOS dispatch</Text>
          </View>
          {alert.severity === 'CRITICAL' && (
            <View style={styles.actionRow}>
              <WeatherIcon name="alert" size={14} color={colors.severity.critical.text} />
              <Text style={[styles.actionText, { color: colors.severity.critical.text }]}>
                Evacuate to designated safe zone immediately
              </Text>
            </View>
          )}
        </GlassCard>

        {/* Emergency Button */}
        <GradientButton
          title="Emergency SOS"
          onPress={() => navigation.navigate('Emergency' as never)}
          variant="danger"
          size="large"
          style={styles.emergencyBtn}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: FontSize.md },

  banner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  bannerInner: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  severityPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  severityText: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    letterSpacing: 1,
  },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    marginBottom: Spacing.xs,
  },
  time: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.xxl,
  },

  descCard: {
    marginBottom: Spacing.lg,
  },
  descLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    lineHeight: 24,
  },

  actionsCard: {
    marginBottom: Spacing.xxl,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  actionText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },

  emergencyBtn: {
    marginBottom: Spacing.lg,
  },
});
