import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuthStore } from '../../state/useAuthStore';
import { useThemeStore } from '../../state/useThemeStore';
import { useTheme } from '../../theme/ThemeContext';
import { databaseService } from '../../services/database/DatabaseService';
import { GlassCard } from '../../components/GlassCard';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const SettingsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { colors, isDark } = useTheme();
  const themeToggle = useThemeStore((state) => state.toggleTheme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSound, setAlertSound] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;
    const settings = await databaseService.getSettings(user.id);
    if (settings) {
      setNotificationsEnabled(settings.notifications_enabled === 1);
      setAlertSound(settings.alert_sound === 1);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    if (!user) return;
    const updates: any = {};
    updates[key] = value ? 1 : 0;
    await databaseService.updateSettings(user.id, updates);
  };

  const toggleNotifications = (val: boolean) => {
    setNotificationsEnabled(val);
    updateSetting('notifications_enabled', val);
  };

  const toggleDarkMode = (val: boolean) => {
    themeToggle();
    updateSetting('dark_mode', val);
  };

  const toggleAlertSound = (val: boolean) => {
    setAlertSound(val);
    updateSetting('alert_sound', val);
  };

  return (
    <LinearGradient colors={colors.gradient.primary} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>NOTIFICATIONS</Text>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.bg.glass }]}>
              <WeatherIcon name="bell" size={18} color={colors.accent.cyan} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Push Notifications</Text>
              <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>Receive weather alerts and updates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.bg.input, true: colors.accent.cyanGlow }}
              thumbColor={notificationsEnabled ? colors.accent.cyan : colors.text.muted}
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.bg.glass }]}>
              <WeatherIcon name="alert" size={18} color={colors.accent.amber} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Alert Sound</Text>
              <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>Play sound for critical alerts</Text>
            </View>
            <Switch
              value={alertSound}
              onValueChange={toggleAlertSound}
              trackColor={{ false: colors.bg.input, true: colors.accent.amberGlow }}
              thumbColor={alertSound ? colors.accent.amber : colors.text.muted}
            />
          </View>
        </GlassCard>

        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>DISPLAY</Text>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.bg.glass }]}>
              <WeatherIcon name={isDark ? 'moon' : 'sun'} size={18} color={colors.accent.cyan} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.bg.input, true: colors.accent.cyanGlow }}
              thumbColor={isDark ? colors.accent.cyan : colors.text.muted}
            />
          </View>
        </GlassCard>

        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>DATA & PRIVACY</Text>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.bg.glass }]}>
              <WeatherIcon name="shield" size={18} color={colors.severity.low.text} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Data Stored Locally</Text>
              <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>All account data is stored securely on your device using SQLite encryption</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.bg.glass }]}>
              <WeatherIcon name="location" size={18} color={colors.text.tertiary} />
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Location Services</Text>
              <Text style={[styles.settingDesc, { color: colors.text.tertiary }]}>GPS is used for map positioning, safe exit routing, and SOS dispatch</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  settingCard: {
    marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: FontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },
});
