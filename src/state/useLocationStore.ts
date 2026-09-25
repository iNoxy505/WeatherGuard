import { create } from 'zustand';
import Geolocation from '@react-native-community/geolocation';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLocating: boolean;
  error: string | null;
  watchId: number | null;
  fetchLocation: () => void;
  startWatching: () => void;
  stopWatching: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  latitude: null,
  longitude: null,
  isLocating: false,
  error: null,
  watchId: null,

  fetchLocation: () => {
    set({ isLocating: true, error: null });
    Geolocation.getCurrentPosition(
      (pos) => {
        set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isLocating: false,
          error: null,
        });
      },
      (err) => {
        set({ isLocating: false, error: err.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
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
          error: null,
        });
      },
      (err) => {
        set({ error: err.message });
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
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
