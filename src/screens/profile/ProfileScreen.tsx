import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../state/useAuthStore';
import { useTheme } from '../../theme/ThemeContext';
import { AvatarCircle } from '../../components/AvatarCircle';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of WeatherGuard?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'edit' as const, label: 'Edit Profile', subtitle: 'Name, email, zone', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'settings' as const, label: 'Settings', subtitle: 'Notifications, display', onPress: () => navigation.navigate('Settings') },
    { icon: 'history' as const, label: 'Weather History', subtitle: 'Past rain & flood data', onPress: () => navigation.navigate('WeatherHistory') },
    { icon: 'bell' as const, label: 'Alert Preferences', subtitle: 'Custom notifications', onPress: () => navigation.navigate('Settings') },
  ];

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileTop}>
            <AvatarCircle
              name={user?.name || 'U'}
              size={72}
              color={user?.avatarColor || colors.accent.cyan}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text.primary }]}>{user?.name || 'User'}</Text>
              <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>{user?.email || ''}</Text>
              <View style={[styles.roleBadge, { backgroundColor: colors.accent.cyanGlow }]}>
                <Text style={[styles.roleText, { color: colors.accent.cyan }]}>{user?.role?.toUpperCase() || 'RESIDENT'}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border.subtle }]} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{user?.homeZoneName || '—'}</Text>
              <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Home Zone</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>Active</Text>
              <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Status</Text>
            </View>
          </View>
        </GlassCard>

        {/* Menu Items */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Account</Text>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} onPress={item.onPress} activeOpacity={0.7}>
            <GlassCard style={styles.menuCard}>
              <View style={styles.menuRow}>
                <View style={[styles.menuIcon, { backgroundColor: colors.accent.cyanGlow }]}>
                  <WeatherIcon name={item.icon} size={18} color={colors.accent.cyan} />
                </View>
                <View style={styles.menuText}>
                  <Text style={[styles.menuLabel, { color: colors.text.primary }]}>{item.label}</Text>
                  <Text style={[styles.menuSubtitle, { color: colors.text.tertiary }]}>{item.subtitle}</Text>
                </View>
                <WeatherIcon name="arrow-right" size={16} color={colors.text.muted} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}

        {/* App Info */}
        <GlassCard style={styles.appInfoCard}>
          <View style={styles.appInfoRow}>
            <WeatherIcon name="shield" size={18} color={colors.accent.cyan} />
            <View style={styles.appInfoText}>
              <Text style={[styles.appName, { color: colors.text.primary }]}>WeatherGuard</Text>
              <Text style={[styles.appVersion, { color: colors.text.tertiary }]}>Version 1.0.0 · Build 100</Text>
            </View>
          </View>
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <WeatherIcon name="logout" size={18} color={colors.severity.critical.text} />
          <Text style={[styles.logoutText, { color: colors.severity.critical.text }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  header: {
    paddingTop: 60,
    marginBottom: Spacing.xxl,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
  },

  profileCard: {
    marginBottom: Spacing.xxl,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: '900',
  },
  profileEmail: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  roleText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },

  menuCard: {
    marginBottom: Spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  menuSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },

  appInfoCard: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  appInfoText: {},
  appName: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  appVersion: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
