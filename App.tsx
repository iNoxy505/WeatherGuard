import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { Navigation } from './src/Navigation';
import { OfflineBanner } from './src/components/OfflineBanner';
import { useRiskStore } from './src/state/useRiskStore';
import { useAuthStore } from './src/state/useAuthStore';
import { useThemeStore } from './src/state/useThemeStore';

function AppContent() {
  const { colors, isDark } = useTheme();
  const setConnected = useRiskStore((state) => state.setConnected);
  const isConnected = useRiskStore((state) => state.isConnected);
  const loadSession = useAuthStore((state) => state.loadSession);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    // Load existing session from DB on app startup
    loadSession();

    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe();
  }, [setConnected, loadSession]);

  // Load user theme preference once user is available
  useEffect(() => {
    if (user?.id) {
      loadTheme(user.id);
    }
  }, [user?.id, loadTheme]);

  if (isLoading) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.bg.primary }]}>
        <ActivityIndicator size="large" color={colors.accent.cyan} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg.primary}
      />
      {!isConnected && <OfflineBanner />}
      <Navigation />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});