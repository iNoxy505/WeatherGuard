import { create } from 'zustand';
import Geolocation from '@react-native-community/geolocation';

// Default to Shimla, Himachal Pradesh, NW India
// Used as fallback for emulators without GPS
const SHIMLA_LAT = 31.1048;
const SHIMLA_LNG = 77.1734;

interface LocationState {
  latitude: number;
  longitude: number;
  isLocating: boolean;
  error: string | null;
  watchId: number | null;
  isUsingDefault: boolean;
  fetchLocation: () => void;
  startWatching: () => void;
  stopWatching: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  // Pre-locate to Shimla by default (emulator-safe)
  latitude: SHIMLA_LAT,
  longitude: SHIMLA_LNG,
  isLocating: false,
  error: null,
  watchId: null,
  isUsingDefault: true,

  fetchLocation: () => {
    set({ isLocating: true, error: null });

    // Add manual timeout to force fallback on emulators where Geolocation hangs
    const timeoutId = setTimeout(() => {
      set({
        latitude: SHIMLA_LAT,
        longitude: SHIMLA_LNG,
        isLocating: false,
        isUsingDefault: true,
        error: null,
      });
    }, 2000);

    Geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isLocating: false,
          isUsingDefault: false,
          error: null,
        });
      },
      (_err) => {
        clearTimeout(timeoutId);
        // On failure (emulator, no GPS, timeout), keep Shimla defaults
        set({
          latitude: SHIMLA_LAT,
          longitude: SHIMLA_LNG,
          isLocating: false,
          isUsingDefault: true,
          error: null, // don't show error — Shimla fallback is intentional
        });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  },

  startWatching: () => {
    const existing = get().watchId;
    if (existing !== null) return;

    const id = Geolocation.watchPosition(
      (pos) => {
        set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isUsingDefault: false,
          error: null,
        });
      },
      (_err) => {
        // Keep current position on watch errors
      },
      { enableHighAccuracy: false, distanceFilter: 10 }
    );
    set({ watchId: id });
  },

  stopWatching: () => {
    const id = get().watchId;
    if (id !== null) {
      Geolocation.clearWatch(id);
      set({ watchId: null });
    }
  },
}));
