import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api/apiClient';

export type SeverityBand = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface FactorTelemetry {
  name: string;
  value: number;
  unit: string;
  severity: SeverityBand;
}

export interface TelemetrySnapshot {
  zoneId: string;
  compositeScore: number;
  severityLabel: SeverityBand;
  factors: FactorTelemetry[];
  explanation: string[];
  computedAt: string;
  landslideRisk?: {
    probability: number;       // 0-100%
    slopeAngle: number;        // degrees
    soilType: string;
    triggerThreshold: number;   // mm of rain that could trigger
    prediction: SeverityBand;
    factors: string[];
  };
}

interface RiskStoreState {
  currentRisk: TelemetrySnapshot | null;
  isLoading: boolean;
  isConnected: boolean;
  lastSyncedAt: string | null;
  setConnected: (status: boolean) => void;
  fetchRiskData: (zoneId: string) => Promise<void>;
  loadCachedRisk: () => Promise<void>;
}

const CACHE_KEY = '@weatherguard_risk_snapshot';

const DEFAULT_FALLBACK_RISK: TelemetrySnapshot = {
  zoneId: 'zone_village_a_ward_3',
  compositeScore: 32,
  severityLabel: 'LOW',
  factors: [
    { name: 'Rainfall (24h)', value: 24, unit: 'mm', severity: 'LOW' },
    { name: 'Soil Saturation', value: 42, unit: '%', severity: 'LOW' },
    { name: 'River Level', value: 1.8, unit: 'm', severity: 'MODERATE' },
    { name: 'Wind Velocity', value: 38, unit: 'km/h', severity: 'LOW' },
    { name: 'Landslide Risk', value: 18, unit: '%', severity: 'LOW' },
  ],
  explanation: [
    'Precipitation levels remain well below seasonal saturation thresholds.',
    'Soil runoff channels are operating at adequate absorptive capacity.',
    'Landslide probability is low — slope stability is within safe parameters.',
  ],
  computedAt: new Date().toISOString(),
  landslideRisk: {
    probability: 18,
    slopeAngle: 32,
    soilType: 'laterite',
    triggerThreshold: 85,
    prediction: 'LOW',
    factors: [
      'Current soil saturation at 42% — well below critical 80% threshold',
      'No sustained heavy rainfall in the past 48 hours',
      'Slope angle of 32° is within moderate risk range but stable at current moisture levels',
      'Historical pattern shows landslide events require >100mm rainfall when soil is pre-saturated',
    ],
  },
};

export const useRiskStore = create<RiskStoreState>((set, get) => ({
  currentRisk: DEFAULT_FALLBACK_RISK,
  isLoading: false,
  isConnected: true,
  lastSyncedAt: new Date().toISOString(),

  setConnected: (status) => set({ isConnected: status }),

  loadCachedRisk: async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ currentRisk: parsed.data, lastSyncedAt: parsed.syncedAt });
      }
    } catch {
      // Retain in-memory fallback on retrieval failure
    }
  },

  fetchRiskData: async (zoneId: string) => {
    set({ isLoading: true });
    const response = await apiClient.getRiskData(zoneId);

    if (response.data) {
      const now = new Date().toISOString();
      set({ currentRisk: response.data, lastSyncedAt: now, isLoading: false });
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: response.data, syncedAt: now })
      );
    } else {
      await get().loadCachedRisk();
      set({ isLoading: false });
    }
  },
}));