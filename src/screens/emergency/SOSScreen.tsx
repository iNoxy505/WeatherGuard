import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { apiClient } from '../../services/api/apiClient';
import { smsService } from '../../services/sms/smsService';
import { useAuthStore } from '../../state/useAuthStore';
import { useRiskStore } from '../../state/useRiskStore';
import { WeatherIcon } from '../../components/WeatherIcon';
import { GlassCard } from '../../components/GlassCard';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const SOSScreen: React.FC = () => {
  const [isDispatching, setIsDispatching] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isConnected = useRiskStore((state) => state.isConnected);

  const triggerSOS = () => {
    Alert.alert(
      'Confirm Emergency Broadcast',
      'This action will transmit your precise GPS coordinates to response teams.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'SEND SOS NOW', style: 'destructive', onPress: executeEmergencySequence },
      ]
    );
  };

  const executeEmergencySequence = () => {
    setIsDispatching(true);

    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        if (isConnected) {
          const apiRes = await apiClient.dispatchSos({
            userId: user?.id || 'anonymous',
            latitude,
            longitude,
            method: 'app',
          });

          if (apiRes.data) {
            setIsDispatching(false);
            Alert.alert('SOS Transmitted', 'Emergency authorities notified of your position.');
            return;
          }
        }

        // Automatic fallback to native SMS transport when offline or on API failure
        await fallbackToSMS(latitude, longitude);
      },
      async () => {
        // Fallback with approximate coordinates if GPS accuracy times out
        await fallbackToSMS(0, 0);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  };

  const fallbackToSMS = async (lat: number, lng: number) => {
    const sent = await smsService.sendEmergencySMS({ latitude: lat, longitude: lng });
    setIsDispatching(false);
    if (!sent) {
      Alert.alert(
        'Manual Action Required',
        'Could not initialize SMS dispatcher. Dial 112 or contact local rescue services directly.'
      );
    }
  };

  return (
    <LinearGradient colors={Colors.gradient.primary} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <WeatherIcon name="sos" size={22} color={Colors.severity.critical.text} />
        <Text style={styles.headerTitle}>Emergency Rescue Channel</Text>
      </View>

      <Text style={styles.description}>
        Transmits your location immediately. If network connectivity is unavailable, the
        system will route your coordinates via cellular SMS fallback.
      </Text>

      {/* Connection Status */}
      <GlassCard style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? Colors.status.online : Colors.status.offline }]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Online — API dispatch active' : 'Offline — SMS fallback ready'}
          </Text>
        </View>
      </GlassCard>

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        <View style={styles.sosOuter}>
          <View style={styles.sosPulseRing} />
          <TouchableOpacity
            style={[styles.sosButton, isDispatching && styles.sosButtonDisabled]}
            onPress={triggerSOS}
            disabled={isDispatching}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isDispatching ? ['#991B1B', '#7F1D1D'] : ['#EF4444', '#DC2626', '#B91C1C']}
              style={styles.sosGradient}
            >
              <Text style={styles.sosButtonText}>
                {isDispatching ? 'LOCATING...' : 'SOS'}
              </Text>
              {!isDispatching && (
                <Text style={styles.sosSub}>Tap to broadcast</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* SMS Fallback */}
      <TouchableOpacity
        style={styles.manualSmsBtn}
        onPress={() => fallbackToSMS(0, 0)}
        disabled={isDispatching}
        activeOpacity={0.7}
      >
        <WeatherIcon name="alert" size={16} color={Colors.text.secondary} />
        <Text style={styles.manualSmsText}>Direct Emergency SMS Fallback</Text>
      </TouchableOpacity>

      {/* Emergency Numbers */}
      <GlassCard style={styles.numbersCard}>
        <Text style={styles.numbersTitle}>EMERGENCY CONTACTS</Text>
        <View style={styles.numberRow}>
          <Text style={styles.numberLabel}>National Emergency</Text>
          <Text style={styles.numberValue}>112</Text>
        </View>
        <View style={styles.numberRow}>
          <Text style={styles.numberLabel}>Fire & Rescue</Text>
          <Text style={styles.numberValue}>101</Text>
        </View>
        <View style={styles.numberRow}>
          <Text style={styles.numberLabel}>Ambulance</Text>
          <Text style={styles.numberValue}>108</Text>
        </View>
      </GlassCard>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.text.primary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },

  statusCard: {
    marginBottom: Spacing.xxl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
  },

  sosContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  sosOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosPulseRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    ...Colors.shadow.glow,
    shadowColor: '#DC2626',
  },
  sosGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  sosButtonDisabled: {
    opacity: 0.7,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.hero,
    fontWeight: '900',
    letterSpacing: 3,
  },
  sosSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 4,
  },

  manualSmsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bg.glass,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  manualSmsText: {
    color: Colors.text.secondary,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },

  numbersCard: {},
  numbersTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.text.tertiary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  numberLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  numberValue: {
    fontSize: FontSize.md,
    color: Colors.severity.critical.text,
    fontWeight: '800',
  },
});