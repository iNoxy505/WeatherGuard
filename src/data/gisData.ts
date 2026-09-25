/**
 * WeatherGuard GIS Data — Shimla Region, Himachal Pradesh, NW India
 * 
 * Contains all geospatial data for the map layers:
 * - Risk zones (flood + landslide polygons with simulated telemetry)
 * - Shelters, hospitals, relief centers
 * - IoT sensor locations
 * - Road network segments
 * - River/water body polylines
 * - Evacuation routes with lat/lng waypoints
 * - Rain intensity grid cells
 * - Cloud coverage regions
 */

// ─── TYPES ───────────────────────────────────────────────────
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface GeoCoord {
  latitude: number;
  longitude: number;
}

export interface RiskZone {
  id: string;
  name: string;
  type: 'flood' | 'landslide';
  risk: RiskLevel;
  probability: number;
  coordinates: GeoCoord[];
  // Telemetry for detail popup
  telemetry: {
    rainfall_mm_hr: number;
    waterLevel_m: number;
    soilSaturation_pct: number;
    slope_deg: number;
    elevation_m: number;
    flowAccumulation: number;
    trend: 'RISING' | 'STABLE' | 'FALLING';
  };
  confidence: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    availableSources: string[];
    unavailableSources: string[];
  };
}

export interface SafetyPoint {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'relief_center' | 'school';
  coordinate: GeoCoord;
  capacity?: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
}

export interface SensorPoint {
  id: string;
  name: string;
  type: 'rain' | 'water_level' | 'soil';
  coordinate: GeoCoord;
  reading: number;
  unit: string;
  status: 'ONLINE' | 'OFFLINE';
  lastUpdated: string;
}

export interface EvacRoute {
  id: string;
  fromName: string;
  toName: string;
  waypoints: GeoCoord[];
  distanceKm: number;
  estimatedMinutes: number;
  roadCondition: 'CLEAR' | 'MODERATE' | 'BLOCKED';
  avoidsZones: string[]; // IDs of risk zones this route avoids
}

export interface RainCell {
  id: string;
  coordinate: GeoCoord;
  intensity_mm_hr: number; // 0-150
  radius_m: number;
}

export interface CloudRegion {
  id: string;
  coordinates: GeoCoord[];
  coveragePct: number;
  type: 'cumulus' | 'cumulonimbus' | 'stratus';
  rainDensity: number; // 0-100
  windDirection: number; // 0-360 degrees
  windSpeed: number; // km/h
}

export interface RoadSegment {
  id: string;
  name: string;
  waypoints: GeoCoord[];
  condition: 'CLEAR' | 'MODERATE' | 'BLOCKED';
}

export interface RiverSegment {
  id: string;
  name: string;
  waypoints: GeoCoord[];
  waterLevel: number; // meters
  floodStage: number; // meters at which flooding begins
}

// ─── DEFAULT REGION ──────────────────────────────────────────
export const SHIMLA_REGION = {
  latitude: 31.1048,
  longitude: 77.1734,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

// ─── FLOOD RISK ZONES ────────────────────────────────────────
export const FLOOD_ZONES: RiskZone[] = [
  {
    id: 'flood_z1',
    name: 'Kufri Valley Basin',
    type: 'flood',
    risk: 'CRITICAL',
    probability: 87,
    coordinates: [
      { latitude: 31.0990, longitude: 77.1800 },
      { latitude: 31.0990, longitude: 77.1900 },
      { latitude: 31.0930, longitude: 77.1900 },
      { latitude: 31.0930, longitude: 77.1800 },
    ],
    telemetry: {
      rainfall_mm_hr: 84,
      waterLevel_m: 3.2,
      soilSaturation_pct: 88,
      slope_deg: 12,
      elevation_m: 720,
      flowAccumulation: 950,
      trend: 'RISING',
    },
    confidence: {
      level: 'HIGH',
      availableSources: ['Rainfall', 'Terrain (DEM)', 'Water Level Gauge', 'Soil Moisture (Sentinel-1)'],
      unavailableSources: ['Local IoT Sensor'],
    },
  },
  {
    id: 'flood_z2',
    name: 'Sutlej River Bend',
    type: 'flood',
    risk: 'HIGH',
    probability: 72,
    coordinates: [
      { latitude: 31.1100, longitude: 77.1600 },
      { latitude: 31.1100, longitude: 77.1700 },
      { latitude: 31.1040, longitude: 77.1700 },
      { latitude: 31.1040, longitude: 77.1600 },
    ],
    telemetry: {
      rainfall_mm_hr: 62,
      waterLevel_m: 2.8,
      soilSaturation_pct: 75,
      slope_deg: 8,
      elevation_m: 780,
      flowAccumulation: 780,
      trend: 'RISING',
    },
    confidence: {
      level: 'MEDIUM',
      availableSources: ['Rainfall', 'Terrain (DEM)', 'Historical Records'],
      unavailableSources: ['Water Level Gauge', 'Soil Sensor'],
    },
  },
  {
    id: 'flood_z3',
    name: 'Mall Road Drainage',
    type: 'flood',
    risk: 'MODERATE',
    probability: 42,
    coordinates: [
      { latitude: 31.1070, longitude: 77.1700 },
      { latitude: 31.1070, longitude: 77.1770 },
      { latitude: 31.1040, longitude: 77.1770 },
      { latitude: 31.1040, longitude: 77.1700 },
    ],
    telemetry: {
      rainfall_mm_hr: 35,
      waterLevel_m: 1.4,
      soilSaturation_pct: 55,
      slope_deg: 5,
      elevation_m: 850,
      flowAccumulation: 320,
      trend: 'STABLE',
    },
    confidence: {
      level: 'HIGH',
      availableSources: ['Rainfall', 'Terrain (DEM)', 'Water Level Gauge', 'Historical Records'],
      unavailableSources: [],
    },
  },
  {
    id: 'flood_z4',
    name: 'Mashobra Lowlands',
    type: 'flood',
    risk: 'LOW',
    probability: 18,
    coordinates: [
      { latitude: 31.1130, longitude: 77.1780 },
      { latitude: 31.1130, longitude: 77.1860 },
      { latitude: 31.1090, longitude: 77.1860 },
      { latitude: 31.1090, longitude: 77.1780 },
    ],
    telemetry: {
      rainfall_mm_hr: 15,
      waterLevel_m: 0.8,
      soilSaturation_pct: 35,
      slope_deg: 3,
      elevation_m: 920,
      flowAccumulation: 120,
      trend: 'STABLE',
    },
    confidence: {
      level: 'MEDIUM',
      availableSources: ['Rainfall', 'Terrain (DEM)'],
      unavailableSources: ['Water Level Gauge', 'Soil Sensor'],
    },
  },
];

// ─── LANDSLIDE RISK ZONES ────────────────────────────────────
export const LANDSLIDE_ZONES: RiskZone[] = [
  {
    id: 'slide_z1',
    name: 'Jakhu Hill Slope',
    type: 'landslide',
    risk: 'CRITICAL',
    probability: 91,
    coordinates: [
      { latitude: 31.1060, longitude: 77.1770 },
      { latitude: 31.1060, longitude: 77.1840 },
      { latitude: 31.1010, longitude: 77.1840 },
      { latitude: 31.1010, longitude: 77.1770 },
    ],
    telemetry: {
      rainfall_mm_hr: 78,
      waterLevel_m: 2.1,
      soilSaturation_pct: 92,
      slope_deg: 38,
      elevation_m: 1050,
      flowAccumulation: 680,
      trend: 'RISING',
    },
    confidence: {
      level: 'HIGH',
      availableSources: ['Slope (DEM)', 'Soil Moisture', 'Rainfall', 'Historical Landslide Records'],
      unavailableSources: [],
    },
  },
  {
    id: 'slide_z2',
    name: 'Summer Hill Ridge',
    type: 'landslide',
    risk: 'HIGH',
    probability: 68,
    coordinates: [
      { latitude: 31.1080, longitude: 77.1620 },
      { latitude: 31.1080, longitude: 77.1690 },
      { latitude: 31.1030, longitude: 77.1690 },
      { latitude: 31.1030, longitude: 77.1620 },
    ],
    telemetry: {
      rainfall_mm_hr: 55,
      waterLevel_m: 1.6,
      soilSaturation_pct: 78,
      slope_deg: 32,
      elevation_m: 980,
      flowAccumulation: 420,
      trend: 'RISING',
    },
    confidence: {
      level: 'MEDIUM',
      availableSources: ['Slope (DEM)', 'Rainfall', 'Satellite (Sentinel-2)'],
      unavailableSources: ['Local Soil Sensor', 'Historical Records'],
    },
  },
  {
    id: 'slide_z3',
    name: 'Tutikandi Slope',
    type: 'landslide',
    risk: 'MODERATE',
    probability: 45,
    coordinates: [
      { latitude: 31.0970, longitude: 77.1680 },
      { latitude: 31.0970, longitude: 77.1740 },
      { latitude: 31.0940, longitude: 77.1740 },
      { latitude: 31.0940, longitude: 77.1680 },
    ],
    telemetry: {
      rainfall_mm_hr: 30,
      waterLevel_m: 1.2,
      soilSaturation_pct: 60,
      slope_deg: 25,
      elevation_m: 880,
      flowAccumulation: 280,
      trend: 'STABLE',
    },
    confidence: {
      level: 'HIGH',
      availableSources: ['Slope (DEM)', 'Rainfall', 'Soil Moisture', 'Historical Records'],
      unavailableSources: [],
    },
  },
];

// ─── SAFETY POINTS ──────────────────────────────────────────
export const SAFETY_POINTS: SafetyPoint[] = [
  { id: 'sp1', name: 'IGMC Hospital', type: 'hospital', coordinate: { latitude: 31.1030, longitude: 77.1650 }, capacity: 500, status: 'OPEN' },
  { id: 'sp2', name: 'Kamla Nehru Hospital', type: 'hospital', coordinate: { latitude: 31.1005, longitude: 77.1720 }, capacity: 300, status: 'OPEN' },
  { id: 'sp3', name: 'Shimla Govt School', type: 'shelter', coordinate: { latitude: 31.0960, longitude: 77.1650 }, capacity: 200, status: 'OPEN' },
  { id: 'sp4', name: 'Ridge Relief Center', type: 'relief_center', coordinate: { latitude: 31.1050, longitude: 77.1710 }, capacity: 150, status: 'OPEN' },
  { id: 'sp5', name: 'Lakkar Bazaar Shelter', type: 'shelter', coordinate: { latitude: 31.1085, longitude: 77.1755 }, capacity: 100, status: 'OPEN' },
  { id: 'sp6', name: 'Sanjauli Relief Camp', type: 'relief_center', coordinate: { latitude: 31.0980, longitude: 77.1820 }, capacity: 250, status: 'OPEN' },
  { id: 'sp7', name: 'Auckland House School', type: 'school', coordinate: { latitude: 31.1020, longitude: 77.1680 }, capacity: 400, status: 'OPEN' },
];

// ─── SENSOR POINTS ──────────────────────────────────────────
export const SENSOR_POINTS: SensorPoint[] = [
  // Rain sensors
  { id: 'rs1', name: 'Ridge Rain Gauge', type: 'rain', coordinate: { latitude: 31.1055, longitude: 77.1725 }, reading: 84, unit: 'mm/hr', status: 'ONLINE', lastUpdated: '2 min ago' },
  { id: 'rs2', name: 'Jakhu Rain Gauge', type: 'rain', coordinate: { latitude: 31.1040, longitude: 77.1810 }, reading: 78, unit: 'mm/hr', status: 'ONLINE', lastUpdated: '3 min ago' },
  { id: 'rs3', name: 'Summer Hill AWS', type: 'rain', coordinate: { latitude: 31.1070, longitude: 77.1640 }, reading: 55, unit: 'mm/hr', status: 'ONLINE', lastUpdated: '1 min ago' },
  // Water level sensors
  { id: 'ws1', name: 'Sutlej River Gauge', type: 'water_level', coordinate: { latitude: 31.1090, longitude: 77.1630 }, reading: 2.8, unit: 'm', status: 'ONLINE', lastUpdated: '1 min ago' },
  { id: 'ws2', name: 'Kufri Stream Gauge', type: 'water_level', coordinate: { latitude: 31.0960, longitude: 77.1850 }, reading: 3.2, unit: 'm', status: 'ONLINE', lastUpdated: '4 min ago' },
  { id: 'ws3', name: 'Mall Road Drain', type: 'water_level', coordinate: { latitude: 31.1055, longitude: 77.1740 }, reading: 1.4, unit: 'm', status: 'OFFLINE', lastUpdated: '28 min ago' },
  // Soil sensors
  { id: 'ss1', name: 'Jakhu Soil Probe', type: 'soil', coordinate: { latitude: 31.1035, longitude: 77.1800 }, reading: 92, unit: '%', status: 'ONLINE', lastUpdated: '5 min ago' },
  { id: 'ss2', name: 'Summer Hill Probe', type: 'soil', coordinate: { latitude: 31.1060, longitude: 77.1660 }, reading: 78, unit: '%', status: 'ONLINE', lastUpdated: '5 min ago' },
];

// ─── RAIN INTENSITY CELLS ───────────────────────────────────
export const RAIN_CELLS: RainCell[] = [
  { id: 'rc1', coordinate: { latitude: 31.1080, longitude: 77.1680 }, intensity_mm_hr: 35, radius_m: 400 },
  { id: 'rc2', coordinate: { latitude: 31.1060, longitude: 77.1750 }, intensity_mm_hr: 55, radius_m: 350 },
  { id: 'rc3', coordinate: { latitude: 31.1040, longitude: 77.1810 }, intensity_mm_hr: 84, radius_m: 500 },
  { id: 'rc4', coordinate: { latitude: 31.1010, longitude: 77.1860 }, intensity_mm_hr: 78, radius_m: 450 },
  { id: 'rc5', coordinate: { latitude: 31.0970, longitude: 77.1700 }, intensity_mm_hr: 30, radius_m: 300 },
  { id: 'rc6', coordinate: { latitude: 31.0950, longitude: 77.1780 }, intensity_mm_hr: 65, radius_m: 400 },
  { id: 'rc7', coordinate: { latitude: 31.1100, longitude: 77.1620 }, intensity_mm_hr: 45, radius_m: 350 },
  { id: 'rc8', coordinate: { latitude: 31.1020, longitude: 77.1640 }, intensity_mm_hr: 25, radius_m: 300 },
];

export const CLOUD_REGIONS: CloudRegion[] = [
  {
    id: 'cl1',
    type: 'cumulonimbus',
    coveragePct: 90,
    rainDensity: 85,
    windDirection: 45,
    windSpeed: 24,
    coordinates: [
      { latitude: 31.1120, longitude: 77.1750 },
      { latitude: 31.1120, longitude: 77.1920 },
      { latitude: 31.1000, longitude: 77.1920 },
      { latitude: 31.1000, longitude: 77.1750 },
    ],
  },
  {
    id: 'cl2',
    type: 'cumulus',
    coveragePct: 60,
    rainDensity: 40,
    windDirection: 60,
    windSpeed: 18,
    coordinates: [
      { latitude: 31.1100, longitude: 77.1580 },
      { latitude: 31.1100, longitude: 77.1700 },
      { latitude: 31.1020, longitude: 77.1700 },
      { latitude: 31.1020, longitude: 77.1580 },
    ],
  },
  {
    id: 'cl3',
    type: 'stratus',
    coveragePct: 40,
    rainDensity: 15,
    windDirection: 30,
    windSpeed: 12,
    coordinates: [
      { latitude: 31.0990, longitude: 77.1620 },
      { latitude: 31.0990, longitude: 77.1760 },
      { latitude: 31.0920, longitude: 77.1760 },
      { latitude: 31.0920, longitude: 77.1620 },
    ],
  },
];

// ─── ROAD SEGMENTS ──────────────────────────────────────────
export const ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'rd1', name: 'NH-5 (Mall Road)',
    waypoints: [
      { latitude: 31.1090, longitude: 77.1600 },
      { latitude: 31.1070, longitude: 77.1660 },
      { latitude: 31.1050, longitude: 77.1720 },
      { latitude: 31.1030, longitude: 77.1780 },
    ],
    condition: 'CLEAR',
  },
  {
    id: 'rd2', name: 'Jakhu Road',
    waypoints: [
      { latitude: 31.1050, longitude: 77.1720 },
      { latitude: 31.1040, longitude: 77.1760 },
      { latitude: 31.1030, longitude: 77.1800 },
      { latitude: 31.1020, longitude: 77.1830 },
    ],
    condition: 'MODERATE',
  },
  {
    id: 'rd3', name: 'Circular Road',
    waypoints: [
      { latitude: 31.1030, longitude: 77.1650 },
      { latitude: 31.1010, longitude: 77.1690 },
      { latitude: 31.0990, longitude: 77.1730 },
      { latitude: 31.0970, longitude: 77.1770 },
    ],
    condition: 'CLEAR',
  },
  {
    id: 'rd4', name: 'Sanjauli Road',
    waypoints: [
      { latitude: 31.1030, longitude: 77.1780 },
      { latitude: 31.1010, longitude: 77.1800 },
      { latitude: 31.0990, longitude: 77.1820 },
      { latitude: 31.0975, longitude: 77.1840 },
    ],
    condition: 'BLOCKED',
  },
];

// ─── RIVER SEGMENTS ─────────────────────────────────────────
export const RIVER_SEGMENTS: RiverSegment[] = [
  {
    id: 'rv1', name: 'Sutlej River',
    waypoints: [
      { latitude: 31.1120, longitude: 77.1580 },
      { latitude: 31.1100, longitude: 77.1620 },
      { latitude: 31.1080, longitude: 77.1660 },
      { latitude: 31.1050, longitude: 77.1690 },
      { latitude: 31.1020, longitude: 77.1700 },
      { latitude: 31.0990, longitude: 77.1720 },
      { latitude: 31.0960, longitude: 77.1750 },
    ],
    waterLevel: 2.8,
    floodStage: 3.5,
  },
  {
    id: 'rv2', name: 'Kufri Nallah',
    waypoints: [
      { latitude: 31.1020, longitude: 77.1830 },
      { latitude: 31.0990, longitude: 77.1850 },
      { latitude: 31.0960, longitude: 77.1870 },
      { latitude: 31.0940, longitude: 77.1860 },
    ],
    waterLevel: 3.2,
    floodStage: 3.0,
  },
];

// ─── EVACUATION ROUTES (GEO) ────────────────────────────────
export const GEO_EVAC_ROUTES: EvacRoute[] = [
  {
    id: 'evac1',
    fromName: 'Jakhu Hill (Critical)',
    toName: 'Ridge Relief Center',
    waypoints: [
      { latitude: 31.1035, longitude: 77.1805 },
      { latitude: 31.1040, longitude: 77.1780 },
      { latitude: 31.1045, longitude: 77.1750 },
      { latitude: 31.1048, longitude: 77.1720 },
      { latitude: 31.1050, longitude: 77.1710 },
    ],
    distanceKm: 1.2,
    estimatedMinutes: 8,
    roadCondition: 'CLEAR',
    avoidsZones: ['flood_z1', 'slide_z1'],
  },
  {
    id: 'evac2',
    fromName: 'Kufri Valley',
    toName: 'Sanjauli Relief Camp',
    waypoints: [
      { latitude: 31.0960, longitude: 77.1850 },
      { latitude: 31.0970, longitude: 77.1835 },
      { latitude: 31.0975, longitude: 77.1825 },
      { latitude: 31.0980, longitude: 77.1820 },
    ],
    distanceKm: 0.6,
    estimatedMinutes: 4,
    roadCondition: 'MODERATE',
    avoidsZones: ['flood_z1'],
  },
  {
    id: 'evac3',
    fromName: 'Summer Hill',
    toName: 'IGMC Hospital',
    waypoints: [
      { latitude: 31.1060, longitude: 77.1650 },
      { latitude: 31.1050, longitude: 77.1655 },
      { latitude: 31.1040, longitude: 77.1650 },
      { latitude: 31.1030, longitude: 77.1650 },
    ],
    distanceKm: 0.4,
    estimatedMinutes: 3,
    roadCondition: 'CLEAR',
    avoidsZones: ['slide_z2'],
  },
];

// ─── FORECAST DATA (simulated hourly) ──────────────────────
export interface ForecastFrame {
  hourOffset: number; // 0 = now, 1 = +1h, etc.
  label: string;
  floodRisk: Record<string, RiskLevel>;
  landslideRisk: Record<string, RiskLevel>;
  rainfall_mm_hr: number;
  waterLevel_m: number;
}

export const FORECAST_FRAMES: ForecastFrame[] = [
  { hourOffset: 0, label: 'Now', floodRisk: { flood_z1: 'CRITICAL', flood_z2: 'HIGH', flood_z3: 'MODERATE', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'HIGH', slide_z3: 'MODERATE' }, rainfall_mm_hr: 84, waterLevel_m: 3.2 },
  { hourOffset: 1, label: '+1h', floodRisk: { flood_z1: 'CRITICAL', flood_z2: 'CRITICAL', flood_z3: 'HIGH', flood_z4: 'MODERATE' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'CRITICAL', slide_z3: 'HIGH' }, rainfall_mm_hr: 95, waterLevel_m: 3.6 },
  { hourOffset: 2, label: '+2h', floodRisk: { flood_z1: 'CRITICAL', flood_z2: 'CRITICAL', flood_z3: 'CRITICAL', flood_z4: 'HIGH' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'CRITICAL', slide_z3: 'CRITICAL' }, rainfall_mm_hr: 110, waterLevel_m: 4.1 },
  { hourOffset: 3, label: '+3h', floodRisk: { flood_z1: 'CRITICAL', flood_z2: 'HIGH', flood_z3: 'HIGH', flood_z4: 'MODERATE' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'HIGH', slide_z3: 'HIGH' }, rainfall_mm_hr: 70, waterLevel_m: 3.8 },
  { hourOffset: 4, label: '+4h', floodRisk: { flood_z1: 'HIGH', flood_z2: 'HIGH', flood_z3: 'MODERATE', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'HIGH', slide_z2: 'HIGH', slide_z3: 'MODERATE' }, rainfall_mm_hr: 45, waterLevel_m: 3.4 },
  { hourOffset: 5, label: '+5h', floodRisk: { flood_z1: 'HIGH', flood_z2: 'MODERATE', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'HIGH', slide_z2: 'MODERATE', slide_z3: 'MODERATE' }, rainfall_mm_hr: 25, waterLevel_m: 3.0 },
  { hourOffset: 6, label: '+6h', floodRisk: { flood_z1: 'MODERATE', flood_z2: 'LOW', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'MODERATE', slide_z2: 'MODERATE', slide_z3: 'LOW' }, rainfall_mm_hr: 10, waterLevel_m: 2.6 },
];

// ─── HISTORICAL DATA ────────────────────────────────────────
export const HISTORICAL_FRAMES: ForecastFrame[] = [
  { hourOffset: -6, label: '-6h', floodRisk: { flood_z1: 'LOW', flood_z2: 'LOW', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'LOW', slide_z2: 'LOW', slide_z3: 'LOW' }, rainfall_mm_hr: 5, waterLevel_m: 1.2 },
  { hourOffset: -5, label: '-5h', floodRisk: { flood_z1: 'LOW', flood_z2: 'LOW', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'LOW', slide_z2: 'LOW', slide_z3: 'LOW' }, rainfall_mm_hr: 12, waterLevel_m: 1.4 },
  { hourOffset: -4, label: '-4h', floodRisk: { flood_z1: 'MODERATE', flood_z2: 'LOW', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'MODERATE', slide_z2: 'LOW', slide_z3: 'LOW' }, rainfall_mm_hr: 28, waterLevel_m: 1.8 },
  { hourOffset: -3, label: '-3h', floodRisk: { flood_z1: 'HIGH', flood_z2: 'MODERATE', flood_z3: 'LOW', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'HIGH', slide_z2: 'MODERATE', slide_z3: 'LOW' }, rainfall_mm_hr: 52, waterLevel_m: 2.5 },
  { hourOffset: -2, label: '-2h', floodRisk: { flood_z1: 'HIGH', flood_z2: 'HIGH', flood_z3: 'MODERATE', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'HIGH', slide_z3: 'MODERATE' }, rainfall_mm_hr: 68, waterLevel_m: 3.1 },
  { hourOffset: -1, label: '-1h', floodRisk: { flood_z1: 'CRITICAL', flood_z2: 'HIGH', flood_z3: 'MODERATE', flood_z4: 'LOW' }, landslideRisk: { slide_z1: 'CRITICAL', slide_z2: 'HIGH', slide_z3: 'MODERATE' }, rainfall_mm_hr: 80, waterLevel_m: 3.4 },
];

// ─── COLOR HELPERS ──────────────────────────────────────────
export const RISK_FILL_COLORS: Record<RiskLevel, string> = {
  LOW: 'rgba(74, 222, 128, 0.25)',
  MODERATE: 'rgba(250, 204, 21, 0.30)',
  HIGH: 'rgba(251, 146, 60, 0.35)',
  CRITICAL: 'rgba(248, 113, 113, 0.40)',
};

export const RISK_STROKE_COLORS: Record<RiskLevel, string> = {
  LOW: '#4ADE80',
  MODERATE: '#FACC15',
  HIGH: '#FB923C',
  CRITICAL: '#F87171',
};

export const RAIN_INTENSITY_COLOR = (intensity: number): string => {
  if (intensity < 20) return 'rgba(100, 180, 255, 0.20)';
  if (intensity < 40) return 'rgba(80, 150, 255, 0.35)';
  if (intensity < 60) return 'rgba(60, 120, 255, 0.50)';
  if (intensity < 80) return 'rgba(40, 80, 220, 0.60)';
  if (intensity < 100) return 'rgba(80, 40, 200, 0.65)';
  return 'rgba(150, 30, 180, 0.70)';
};

export const ROAD_CONDITION_COLORS: Record<string, string> = {
  CLEAR: '#4ADE80',
  MODERATE: '#FACC15',
  BLOCKED: '#F87171',
};

export const SAFETY_POINT_COLORS: Record<string, string> = {
  shelter: '#4ADE80',
  hospital: '#60A5FA',
  relief_center: '#A78BFA',
  school: '#FACC15',
};
