import { Linking, Platform } from 'react-native';

const EMERGENCY_SMS_NUMBER = '112';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const smsService = {
  createEmergencyPayload: (coords: Coordinates, timestamp: string): string => {
    return (
      `EMERGENCY SOS: WeatherGuard safety alert dispatched.\n` +
      `Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}\n` +
      `Maps: https://maps.google.com/?q=${coords.latitude},${coords.longitude}\n` +
      `Time: ${timestamp}`
    );
  },

  sendEmergencySMS: async (coords: Coordinates): Promise<boolean> => {
    const timestamp = new Date().toISOString();
    const body = smsService.createEmergencyPayload(coords, timestamp);
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${EMERGENCY_SMS_NUMBER}${separator}body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) return false;
      await Linking.openURL(url);
      return true;
    } catch {
      return false;
    }
  },
};