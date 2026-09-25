import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAlertStore, AlertItem } from '../../state/useAlertStore';
import { useTheme } from '../../theme/ThemeContext';
import { AlertCard } from '../../components/AlertCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing } from '../../theme/colors';

export const AlertsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { alerts, isLoading, fetchAlerts } = useAlertStore();
  const { colors } = useTheme();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const renderAlert = ({ item }: { item: AlertItem }) => (
    <AlertCard
      id={item.id}
      severity={item.severity}
      title={item.title}
      description={item.description}
      createdAt={item.created_at}
      isRead={item.is_read === 1}
      onPress={() => navigation.navigate('AlertDetail', { alertId: item.id })}
    />
  );

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text.primary }]}>Weather Alerts</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {alerts.filter((a) => a.is_read === 0).length} unread alerts
          </Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: colors.accent.amberGlow }]}>
          <WeatherIcon name="bell" size={22} color={colors.accent.amber} />
        </View>
      </View>

      {/* Alert List */}
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={() => fetchAlerts()}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.empty}>
            <WeatherIcon name="check" size={40} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No alerts at this time</Text>
            <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>You're all clear! We'll notify you when conditions change.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
