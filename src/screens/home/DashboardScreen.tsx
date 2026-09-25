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
import { GlassCard } from '../../components/GlassCard';
import { RiskBadge } from '../../components/RiskBadge';
import { RiskGauge } from '../../components/RiskGauge';
import { QuickActionTile } from '../../components/QuickActionTile';
import { ForecastCard } from '../../components/ForecastCard';
import { AvatarCircle } from '../../components/AvatarCircle';
import { WeatherIcon } from '../../components/WeatherIcon';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';

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
      case 'CRITICAL': return Colors.severity.critical.accent;
      case 'HIGH': return Colors.severity.high.accent;
      case 'MODERATE': return Colors.severity.moderate.accent;
      default: return Colors.severity.low.accent;
    }
  };

  return (
    <LinearGradient colors={Colors.gradient.primary} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={Colors.accent.cyan}
            colors={[Colors.accent.cyan]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
            </Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <View style={styles.locationRow}>
              <WeatherIcon name="map" size={12} color={Colors.accent.cyan} />
              <Text style={styles.location}>{user?.homeZoneName || 'Unknown Zone'}</Text>
            </View>
          </View>
          <AvatarCircle name={user?.name || 'U'} size={50} color={user?.avatarColor || Colors.accent.cyan} />
        </View>

        {/* Hero Risk Card */}
        <GlassCard style={styles.heroCard} glowColor={getSeverityColor()}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Area Safety Index</Text>
              {currentRisk && <RiskBadge severity={currentRisk.severityLabel} />}
              <Text style={styles.heroScore}>
                {currentRisk?.compositeScore ?? '—'}
                <Text style={styles.heroScoreMax}> / 100</Text>
              </Text>
              <Text style={styles.syncText}>
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
          <View style={styles.factorStrip}>
            {currentRisk?.factors.map((factor) => (
              <View key={factor.name} style={styles.factorItem}>
                <View style={styles.factorTop}>
                  <Text style={styles.factorName} numberOfLines={1}>{factor.name}</Text>
                  <Text style={styles.factorVal}>{factor.value}{factor.unit}</Text>
                </View>
                <View style={styles.factorBarBg}>
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

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickActionTile
            icon="shield"
            label="Safety Score"
            subtitle="Full Breakdown"
            color={Colors.accent.cyan}
            onPress={() => navigation.navigate('RiskScore')}
          />
          <QuickActionTile
            icon="alert"
            label="Alerts"
            subtitle={unreadCount > 0 ? `${unreadCount} new` : 'Up to date'}
            color={Colors.accent.amber}
            onPress={() => navigation.navigate('AlertsTab')}
          />
          <QuickActionTile
            icon="sos"
            label="Emergency"
            subtitle="SOS Channel"
            color={Colors.severity.critical.accent}
            onPress={() => navigation.navigate('Emergency')}
          />
          <QuickActionTile
            icon="map"
            label="Zone Map"
            subtitle="Risk Zones"
            color={Colors.severity.moderate.accent}
            onPress={() => navigation.navigate('MapTab')}
          />
        </View>

        {/* Forecast */}
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
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
            <WeatherIcon name="storm" size={18} color={Colors.accent.amber} />
            <Text style={styles.insightTitle}>AI Safety Insight</Text>
          </View>
          {currentRisk?.explanation.map((item, idx) => (
            <View key={idx} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <Text style={styles.insightText}>{item}</Text>
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
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.text.primary,
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
    color: Colors.accent.cyan,
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
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroScore: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  heroScoreMax: {
    fontSize: FontSize.lg,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  syncText: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Factor strip
  factorStrip: {
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
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
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  factorVal: {
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  factorBarBg: {
    height: 4,
    backgroundColor: Colors.bg.glass,
    borderRadius: 2,
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Section
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text.primary,
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
    color: Colors.accent.amber,
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
    backgroundColor: Colors.text.tertiary,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});
