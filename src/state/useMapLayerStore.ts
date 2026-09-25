/**
 * WeatherGuard Map Layer State Management
 * 
 * Controls the layer-based GIS interface:
 * - Base map mode (2D / 3D)
 * - Environmental layers (Rain, Clouds, Flood, Landslide, Water Level)
 * - Safety layers (Safe Zones, Shelters, Hospitals, Evacuation Routes, Roads)
 * - Sensor layers (Rain Sensors, Water-Level Sensors, Soil Sensors)
 * - Time mode (Current / Forecast / Historical)
 * - Timeline position
 */

import { create } from 'zustand';

export type MapMode = '2D' | '3D';
export type MapStyle = 'standard' | 'satellite' | 'terrain';
export type TimeMode = 'CURRENT' | 'FORECAST' | 'HISTORICAL';

export interface LayerConfig {
  id: string;
  label: string;
  icon: string;
  category: 'environmental' | 'safety' | 'sensors';
  enabled: boolean;
  opacity: number;
}

interface MapLayerState {
  // Base map
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;

  // Time
  timeMode: TimeMode;
  setTimeMode: (mode: TimeMode) => void;
  timelineHour: number; // 0-23, current hour offset for forecast
  setTimelineHour: (hour: number) => void;

  // Layers
  layers: LayerConfig[];
  toggleLayer: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;

  // Selected zone for detail popup
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;

  // Layer panel visibility
  isLayerPanelOpen: boolean;
  toggleLayerPanel: () => void;
}

const DEFAULT_LAYERS: LayerConfig[] = [
  // Environmental
  { id: 'rain', label: 'Rainfall', icon: 'rain', category: 'environmental', enabled: true, opacity: 0.7 },
  { id: 'clouds', label: 'Clouds', icon: 'cloud', category: 'environmental', enabled: true, opacity: 0.5 },
  { id: 'wind', label: 'Wind Direction', icon: 'wind', category: 'environmental', enabled: true, opacity: 0.7 },
  { id: 'flood', label: 'Flood Risk', icon: 'flood', category: 'environmental', enabled: true, opacity: 0.6 },
  { id: 'landslide', label: 'Landslide Risk', icon: 'landslide', category: 'environmental', enabled: false, opacity: 0.6 },
  { id: 'waterLevel', label: 'Water Level', icon: 'water', category: 'environmental', enabled: false, opacity: 0.7 },
  // Safety
  { id: 'safeZones', label: 'Safe Zones', icon: 'safe', category: 'safety', enabled: true, opacity: 1 },
  { id: 'shelters', label: 'Shelters', icon: 'shelter', category: 'safety', enabled: true, opacity: 1 },
  { id: 'hospitals', label: 'Hospitals', icon: 'hospital', category: 'safety', enabled: false, opacity: 1 },
  { id: 'evacRoutes', label: 'Evacuation Routes', icon: 'route', category: 'safety', enabled: false, opacity: 0.8 },
  { id: 'roads', label: 'Roads', icon: 'road', category: 'safety', enabled: false, opacity: 0.5 },
  // Sensors
  { id: 'rainSensors', label: 'Rain Sensors', icon: 'sensor', category: 'sensors', enabled: false, opacity: 1 },
  { id: 'waterSensors', label: 'Water-Level Sensors', icon: 'sensor', category: 'sensors', enabled: false, opacity: 1 },
  { id: 'soilSensors', label: 'Soil Sensors', icon: 'sensor', category: 'sensors', enabled: false, opacity: 1 },
];

export const useMapLayerStore = create<MapLayerState>((set) => ({
  mapMode: '2D',
  setMapMode: (mode) => set({ mapMode: mode }),

  mapStyle: 'standard',
  setMapStyle: (style) => set({ mapStyle: style }),

  timeMode: 'CURRENT',
  setTimeMode: (mode) => set({ timeMode: mode }),

  timelineHour: 0,
  setTimelineHour: (hour) => set({ timelineHour: hour }),

  layers: DEFAULT_LAYERS,
  toggleLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    })),
  setLayerOpacity: (id, opacity) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, opacity } : l
      ),
    })),

  selectedZoneId: null,
  setSelectedZoneId: (id) => set({ selectedZoneId: id }),

  isLayerPanelOpen: false,
  toggleLayerPanel: () => set((state) => ({ isLayerPanelOpen: !state.isLayerPanelOpen })),
}));
