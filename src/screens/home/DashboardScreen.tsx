import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../state/useAuthStore';
import { useRiskStore } from '../../state/useRiskStore';
import { useAlertStore } from '../../state/useAlertStore';
import { useTheme } from '../../theme/ThemeContext';
import { BackgroundPattern } from '../../components/BackgroundPattern';
import { GlassCard } from '../../components/GlassCard';
import { RiskBadge } from '../../components/RiskBadge';
import { RiskGauge } from '../../components/RiskGauge';
import { QuickActionTile } from '../../components/QuickActionTile';
import { ForecastCard } from '../../components/ForecastCard';
import { AvatarCircle } from '../../components/AvatarCircle';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

const { width } = Dimensions.get('window');

const FORECAST_DATA = [
  { day: 'Today', condition: 'cloud' as const, tempHigh: 28, tempLow: 21, precipitation: 30 },
  { day: 'Tue', condition: 'rain' as const, tempHigh: 26, tempLow: 20, precipitation: 70 },
  { day: 'Wed', condition: 'storm' as const, tempHigh: 24, tempLow: 19, precipitation: 85 },
  { day: 'Thu', condition: 'rain' as const, tempHigh: 25, tempLow: 20, precipitation: 60 },
  { day: 'Fri', condition: 'cloud' as const, tempHigh: 27, tempLow: 21, precipitation: 25 },
  { day: 'Sat', condition: 'sun' as const, tempHigh: 30, tempLow: 22, precipitation: 10 },
];

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const { currentRisk, isLoading, fetchRiskData, lastSyncedAt } = useRiskStore();
  const { unreadCount, fetchAlerts } = useAlertStore();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (user?.homeZoneId) {
      fetchRiskData(user.homeZoneId);
    }
    fetchAlerts();
  }, [user?.homeZoneId]);

  const onRefresh = () => {
    if (user?.homeZoneId) fetchRiskData(user.homeZoneId);
    fetchAlerts();
  };

  const getSeverityColor = () => {
    switch (currentRisk?.severityLabel) {
      case 'CRITICAL': return colors.severity.critical.accent;
      case 'HIGH': return colors.severity.high.accent;
      case 'MODERATE': return colors.severity.moderate.accent;
      default: return colors.severity.low.accent;
    }
  };

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <BackgroundPattern isDark={isDark} variant="topography" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.accent.cyan}
            colors={[colors.accent.cyan]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
            </Text>
            <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.name || 'User'}</Text>
            <View style={styles.locationRow}>
              <WeatherIcon name="map" size={12} color={colors.accent.cyan} />
              <Text style={[styles.location, { color: colors.accent.cyan }]}>{user?.homeZoneName || 'Unknown Zone'}</Text>
            </View>
          </View>
          <AvatarCircle name={user?.name || 'U'} size={50} color={user?.avatarColor || colors.accent.cyan} />
        </View>

        {/* Hero Risk Card */}
        <GlassCard style={styles.heroCard} glowColor={getSeverityColor()}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={[styles.heroLabel, { color: colors.text.secondary }]}>Area Safety Index</Text>
              {currentRisk && <RiskBadge severity={currentRisk.severityLabel} />}
              <Text style={[styles.heroScore, { color: colors.text.primary }]}>
                {currentRisk?.compositeScore ?? '—'}
                <Text style={[styles.heroScoreMax, { color: colors.text.tertiary }]}> / 100</Text>
              </Text>
              <Text style={[styles.syncText, { color: colors.text.muted }]}>
                Last sync: {lastSyncedAt
                  ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Pending'}
              </Text>
            </View>
            <View style={styles.heroRight}>
              {currentRisk && (
                <RiskGauge
                  score={currentRisk.compositeScore}
                  severity={currentRisk.severityLabel}
                  size={110}
                />
              )}
            </View>
          </View>

          {/* Factor mini bars */}
          <View style={[styles.factorStrip, { borderTopColor: colors.border.subtle }]}>
            {currentRisk?.factors.map((factor) => (
              <View key={factor.name} style={styles.factorItem}>
                <View style={styles.factorTop}>
                  <Text style={[styles.factorName, { color: colors.text.secondary }]} numberOfLines={1}>{factor.name}</Text>
                  <Text style={[styles.factorVal, { color: colors.text.primary }]}>{factor.value}{factor.unit}</Text>
                </View>
                <View style={[styles.factorBarBg, { backgroundColor: colors.bg.glass }]}>
                  <View
                    style={[
                      styles.factorBarFill,
                      {
                        width: `${Math.min(factor.value, 100)}%`,
                        backgroundColor: getSeverityColor(),
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Landslide Prediction Card */}
        {currentRisk?.landslideRisk && (
          <GlassCard style={styles.landslideCard} glowColor={
            currentRisk.landslideRisk.prediction === 'CRITICAL' ? colors.severity.critical.accent :
            currentRisk.landslideRisk.prediction === 'HIGH' ? colors.severity.high.accent :
            currentRisk.landslideRisk.prediction === 'MODERATE' ? colors.severity.moderate.accent :
            colors.severity.low.accent
          }>
            <View style={styles.landslideHeader}>
              <WeatherIcon name="landslide" size={18} color={colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.text || colors.accent.amber} />
              <Text style={[styles.landslideTitle, { color: colors.text.primary }]}>Landslide Prediction</Text>
              <View style={[styles.landslideChip, { backgroundColor: colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.bg }]}>
                <Text style={[styles.landslideChipText, { color: colors.severity[currentRisk.landslideRisk.prediction.toLowerCase() as keyof typeof colors.severity]?.text }]}>
                  {currentRisk.landslideRisk.probability}%
                </Text>
              </View>
            </View>
            <View style={styles.landslideStats}>
              <View style={styles.landslideStatItem}>
                <Text style={[styles.landslideStatLabel, { color: colors.text.tertiary }]}>Slope</Text>
                <Text style={[styles.landslideStatValue, { color: colors.text.primary }]}>{currentRisk.landslideRisk.slopeAngle}°</Text>
              </View>
              <View style={[styles.landslideStatDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.landslideStatItem}>
                <Text style={[styles.landslideStatLabel, { color: colors.text.tertiary }]}>Soil</Text>
                <Text style={[styles.landslideStatValue, { color: colors.text.primary }]}>{currentRisk.landslideRisk.soilType}</Text>
              </View>
              <View style={[styles.landslideStatDivider, { backgroundColor: colors.border.subtle }]} />
              <View style={styles.landslideStatItem}>
                <Text style={[styles.landslideStatLabel, { color: colors.text.tertiary }]}>Trigger</Text>
                <Text style={[styles.landslideStatValue, { color: colors.text.primary }]}>{currentRisk.landslideRisk.triggerThreshold}mm</Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickActionTile
            icon="shield"
            label="Safety Score"
            subtitle="Full Breakdown"
            color={colors.accent.cyan}
            onPress={() => navigation.navigate('RiskScore')}
          />
          <QuickActionTile
            icon="alert"
            label="Alerts"
            subtitle={unreadCount > 0 ? `${unreadCount} new` : 'Up to date'}
            color={colors.accent.amber}
            onPress={() => navigation.navigate('AlertsTab')}
          />
          <QuickActionTile
            icon="sos"
            label="Emergency"
            subtitle="SOS Channel"
            color={colors.severity.critical.accent}
            onPress={() => navigation.navigate('Emergency')}
          />
          <QuickActionTile
            icon="history"
            label="History"
            subtitle="Past Data"
            color={colors.severity.moderate.accent}
            onPress={() => navigation.navigate('WeatherHistory')}
          />
        </View>

        {/* Forecast */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>5-Day Forecast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.forecastScroll}
        >
          {FORECAST_DATA.map((item) => (
            <ForecastCard key={item.day} {...item} />
          ))}
        </ScrollView>

        {/* AI Insight */}
        <GlassCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <WeatherIcon name="storm" size={18} color={colors.accent.amber} />
            <Text style={[styles.insightTitle, { color: colors.accent.amber }]}>AI Safety Insight</Text>
          </View>
          {currentRisk?.explanation.map((item, idx) => (
            <View key={idx} style={styles.insightRow}>
              <View style={[styles.insightDot, { backgroundColor: colors.text.tertiary }]} />
              <Text style={[styles.insightText, { color: colors.text.secondary }]}>{item}</Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  headerLeft: {},
  greeting: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  userName: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  location: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },

  // Hero card
  heroCard: {
    marginBottom: Spacing.xxl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    marginLeft: Spacing.md,
  },
  heroLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroScore: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    marginTop: Spacing.sm,
  },
  heroScoreMax: {
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  syncText: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },

  // Factor strip
  factorStrip: {
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },
  factorItem: {
    marginBottom: Spacing.sm,
  },
  factorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorName: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  factorVal: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  factorBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Landslide card
  landslideCard: {
    marginBottom: Spacing.xxl,
  },
  landslideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  landslideTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    flex: 1,
  },
  landslideChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  landslideChipText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  landslideStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landslideStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  landslideStatLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  landslideStatValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  landslideStatDivider: {
    width: 1,
    height: 28,
  },

  // Section
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },

  // Quick Actions
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },

  // Forecast
  forecastScroll: {
    marginBottom: Spacing.xxl,
  },

  // Insight
  insightCard: {
    marginBottom: Spacing.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  insightTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  insightDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
});
