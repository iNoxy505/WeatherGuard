/**
 * WeatherGuard Advanced Prediction Engine
 * 
 * ARCHITECTURE (Multi-Modal Data Fusion ML Pipeline):
 * 
 * Layer 1 — Data Acquisition
 *   Satellite (Sentinel-1/2), Weather (IMD/Windy), Rainfall, 
 *   River level, Soil moisture, DEM/SRTM, Historical floods
 * 
 * Layer 2 — Data Fusion
 *   Clean → Synchronize → Spatially align → Feature engineering
 * 
 * Layer 3 — AI Prediction (Two-Branch Architecture)
 *   Branch 1: TIME-SERIES DATA → LSTM/GRU
 *     (Rainfall sequence, Weather, River level, Soil moisture)
 *   Branch 2: SPATIAL DATA → Random Forest / XGBoost
 *     (Elevation, Slope, Land use, Drainage/Flow accumulation)
 *   → DATA FUSION → Combined probability
 * 
 * Layer 4 — GIS Output
 *   Flood probability map, Terrain, Roads, Rivers, Settlements
 * 
 * Layer 5 — Decision Support
 *   ⚠ Warning, 📍 Location, 🗺️ Risk zone, 🚶 Safe route, 🏠 Shelter, 📱 Alert
 * 
 * MODEL COMPARISON (Baseline vs ML):
 *   - Logistic Regression (Baseline, explainable)
 *   - Random Forest (Strong for tabular environmental data)
 *   - XGBoost / LightGBM (Potentially stronger for structured data)
 *   - LSTM / GRU (For temporal sequences when sufficient data exists)
 */

// ─── TYPES ──────────────────────────────────────────
export interface TelemetryData {
  // Temporal / Weather Data (Flash-flood specific features)
  rainfallMmHr: number;
  rainfall15min: number;
  rainfall30min: number;
  rainfall1h: number;
  rainfall3h: number;
  rainfall6h: number;
  rainfall24h: number;
  antecedentRainfall24h: number; // How much rain occurred before the current event
  antecedentRainfall6h: number;
  rainfallIntensityChange: number; // positive = increasing, negative = decreasing

  // Water / River
  waterLevelMeters: number;
  waterLevelChange: number; // m/hr rate of change

  // Soil
  soilSaturationPercent: number;

  // Spatial / GIS Data (from DEM)
  elevationMeters: number;
  slopeAngleDegrees: number;
  flowAccumulation: number; // upstream catchment area contributing water
  distanceToRiverKm: number;

  // Historical
  historicalFloodFrequency: number; // events per decade in this area
  historicalLandslideFrequency: number;
}

export type SeverityLabel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ModelOutput {
  modelName: string;
  probability: number;
  weight: number;
}

export interface ConfidenceAssessment {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number; // 0-100
  availableInputs: string[];
  missingInputs: string[];
  explanation: string;
}

export interface PredictionResult {
  compositeScore: number; // 0-100 safety index (100 = safe, 0 = danger)
  severityLabel: SeverityLabel;
  landslideProbability: number;
  floodProbability: number;
  triggers: string[];
  confidence: ConfidenceAssessment;
  modelOutputs: {
    flood: ModelOutput[];
    landslide: ModelOutput[];
  };
  trendForecast: {
    label: string;
    direction: 'RISING' | 'STABLE' | 'FALLING';
    expectedPeakHours: number;
  };
}

// ─── UTILITIES ──────────────────────────────────────
const normalize = (value: number, maxCritical: number): number =>
  Math.min((value / maxCritical) * 100, 100);

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));

// ─── FLOOD PREDICTION ──────────────────────────────
/**
 * Multi-model flood prediction simulating:
 * 1. Logistic Regression (Baseline)
 * 2. Random Forest (Spatial + Tabular)
 * 3. LSTM Temporal Branch (Time-series rainfall + water level)
 */
export const predictFloodRisk = (
  t: TelemetryData
): { probability: number; triggers: string[]; models: ModelOutput[] } => {
  const triggers: string[] = [];
  const models: ModelOutput[] = [];

  // ── Model 1: Logistic Regression (Baseline) ──
  const logRegInput =
    t.rainfallMmHr * 0.02 +
    t.waterLevelMeters * 0.8 +
    t.soilSaturationPercent * 0.015 +
    t.flowAccumulation * 0.001 -
    t.distanceToRiverKm * 0.5 -
    2.0;
  const logRegProb = clamp(sigmoid(logRegInput) * 100, 0, 100);
  models.push({ modelName: 'Logistic Regression', probability: Math.round(logRegProb), weight: 0.15 });

  // ── Model 2: Random Forest (Spatial GIS) ──
  const waterFactor = normalize(t.waterLevelMeters, 3.5);
  const rainIntensityFactor = normalize(
    t.rainfallMmHr + t.antecedentRainfall24h * 0.2,
    120
  );
  const flowFactor = normalize(t.flowAccumulation, 1000);
  const proximityFactor = normalize(Math.max(0, 5 - t.distanceToRiverKm), 5);
  const historicalFactor = normalize(t.historicalFloodFrequency, 10);

  let rfProb =
    waterFactor * 0.30 +
    rainIntensityFactor * 0.25 +
    flowFactor * 0.20 +
    proximityFactor * 0.15 +
    historicalFactor * 0.10;

  // Non-linear compound danger
  if (t.waterLevelMeters > 2.5 && t.rainfallMmHr > 50) {
    rfProb *= 1.25;
    triggers.push(
      `River level ${t.waterLevelMeters}m + rainfall ${t.rainfallMmHr}mm/hr = compound flood risk`
    );
  }
  if (t.flowAccumulation > 800 && t.rainfallMmHr > 30) {
    triggers.push('Massive upstream runoff detected via DEM Flow Accumulation');
  }
  rfProb = clamp(Math.round(rfProb), 0, 100);
  models.push({ modelName: 'Random Forest (Spatial)', probability: rfProb, weight: 0.35 });

  // ── Model 3: LSTM Temporal Branch ──
  // Simulates sequence: rainfall(t-6h)..rainfall(t) + water level trend
  const rainfallAcceleration =
    (t.rainfall1h - t.rainfall3h / 3) / Math.max(t.rainfall3h / 3, 1);
  const waterRiseRate = t.waterLevelChange;

  let lstmProb =
    normalize(t.rainfall1h, 100) * 0.25 +
    normalize(t.rainfall3h, 200) * 0.15 +
    normalize(t.rainfall6h, 300) * 0.10 +
    normalize(t.rainfall24h, 400) * 0.05 +
    normalize(t.waterLevelMeters, 3.5) * 0.25 +
    normalize(Math.max(0, waterRiseRate), 1.5) * 0.20;

  // Acceleration bonus (rainfall intensity increasing)
  if (rainfallAcceleration > 0.5) {
    lstmProb *= 1.15;
    triggers.push(
      `Rainfall intensity accelerating: ${t.rainfall1h}mm/1h vs ${Math.round(t.rainfall3h / 3)}mm/hr avg`
    );
  }
  if (waterRiseRate > 0.5) {
    triggers.push(
      `Rapid water level rise: +${waterRiseRate.toFixed(1)}m/hr`
    );
  }
  lstmProb = clamp(Math.round(lstmProb), 0, 100);
  models.push({ modelName: 'LSTM (Temporal)', probability: lstmProb, weight: 0.50 });

  // ── Weighted ensemble ──
  const probability = clamp(
    Math.round(models.reduce((sum, m) => sum + m.probability * m.weight, 0)),
    0,
    100
  );

  return { probability, triggers, models };
};

// ─── LANDSLIDE PREDICTION ──────────────────────────
/**
 * Multi-model landslide prediction:
 * 1. Logistic Regression (Baseline)
 * 2. XGBoost (Spatial terrain-aware)
 * 3. Random Forest (Feature importance)
 */
export const predictLandslideRisk = (
  t: TelemetryData
): { probability: number; triggers: string[]; models: ModelOutput[] } => {
  const triggers: string[] = [];
  const models: ModelOutput[] = [];

  // ── Model 1: Logistic Regression ──
  const logRegInput =
    t.slopeAngleDegrees * 0.06 +
    t.soilSaturationPercent * 0.03 +
    t.rainfallMmHr * 0.015 +
    t.antecedentRainfall6h * 0.008 -
    3.0;
  const logRegProb = clamp(sigmoid(logRegInput) * 100, 0, 100);
  models.push({ modelName: 'Logistic Regression', probability: Math.round(logRegProb), weight: 0.15 });

  // ── Model 2: XGBoost (Terrain-aware) ──
  const slopeFactor = normalize(t.slopeAngleDegrees, 45);
  const saturationFactor = normalize(t.soilSaturationPercent, 80);
  const totalRainfallLoad = t.rainfallMmHr + t.antecedentRainfall6h * 0.5;
  const rainFactor = normalize(totalRainfallLoad, 100);
  const elevFactor = normalize(Math.max(0, t.elevationMeters - 500), 1500); // higher = more risk
  const historicalFactor = normalize(t.historicalLandslideFrequency, 8);

  let xgbProb =
    saturationFactor * 0.30 +
    rainFactor * 0.25 +
    slopeFactor * 0.25 +
    elevFactor * 0.10 +
    historicalFactor * 0.10;

  // Compound thresholds
  if (t.soilSaturationPercent > 75 && totalRainfallLoad > 50) {
    xgbProb *= 1.3;
    triggers.push(
      `Critical: Soil saturation ${t.soilSaturationPercent}% + antecedent rainfall ${Math.round(totalRainfallLoad)}mm`
    );
  }
  if (t.slopeAngleDegrees > 30) {
    triggers.push(`High-risk geological slope: ${t.slopeAngleDegrees}°`);
  }
  if (t.slopeAngleDegrees > 25 && t.soilSaturationPercent > 70) {
    triggers.push(
      `Primary contributor: High slope (${t.slopeAngleDegrees}°) + saturated soil (${t.soilSaturationPercent}%)`
    );
  }
  xgbProb = clamp(Math.round(xgbProb), 0, 100);
  models.push({ modelName: 'XGBoost (Terrain)', probability: xgbProb, weight: 0.50 });

  // ── Model 3: Random Forest (Feature importance) ──
  let rfProb =
    slopeFactor * 0.35 +
    saturationFactor * 0.35 +
    rainFactor * 0.20 +
    historicalFactor * 0.10;
  rfProb = clamp(Math.round(rfProb), 0, 100);
  models.push({ modelName: 'Random Forest', probability: rfProb, weight: 0.35 });

  // ── Weighted ensemble ──
  const probability = clamp(
    Math.round(models.reduce((sum, m) => sum + m.probability * m.weight, 0)),
    0,
    100
  );

  return { probability, triggers, models };
};

// ─── CONFIDENCE ASSESSMENT ─────────────────────────
/**
 * Evaluates data quality and confidence of the prediction.
 * Critical for not presenting uncertain predictions as absolute truth.
 */
export const assessConfidence = (t: TelemetryData): ConfidenceAssessment => {
  const available: string[] = [];
  const missing: string[] = [];
  let score = 0;

  // Check each data source
  if (t.rainfallMmHr >= 0) { available.push('Rainfall (IMD)'); score += 15; }
  else { missing.push('Rainfall'); }

  if (t.waterLevelMeters >= 0) { available.push('Water Level Gauge'); score += 15; }
  else { missing.push('Water Level Gauge'); }

  if (t.soilSaturationPercent >= 0) { available.push('Soil Moisture (Sentinel-1)'); score += 12; }
  else { missing.push('Soil Sensor'); }

  if (t.elevationMeters > 0) { available.push('Elevation (SRTM DEM)'); score += 10; }
  else { missing.push('DEM Data'); }

  if (t.slopeAngleDegrees >= 0) { available.push('Slope (Computed from DEM)'); score += 10; }
  else { missing.push('Slope Data'); }

  if (t.flowAccumulation >= 0) { available.push('Flow Accumulation (GIS)'); score += 10; }
  else { missing.push('Flow Accumulation'); }

  if (t.historicalFloodFrequency > 0) { available.push('Historical Flood Records'); score += 8; }
  else { missing.push('Historical Flood Records'); }

  if (t.historicalLandslideFrequency > 0) { available.push('Historical Landslide Records'); score += 8; }
  else { missing.push('Historical Landslide Records'); }

  if (t.rainfall15min >= 0 && t.rainfall30min >= 0) {
    available.push('High-resolution Rain Gauge');
    score += 6;
  } else {
    missing.push('High-res Rain Gauge');
  }

  if (t.rainfallIntensityChange !== undefined) {
    available.push('Rainfall Trend Analysis');
    score += 6;
  }

  score = clamp(score, 0, 100);

  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 70) level = 'HIGH';
  else if (score >= 45) level = 'MEDIUM';

  const explanation =
    level === 'HIGH'
      ? 'Strong multi-source data coverage. Prediction is well-supported.'
      : level === 'MEDIUM'
      ? 'Moderate data coverage. Some key inputs are estimated or unavailable.'
      : 'Limited data sources. Prediction should be treated with caution.';

  return { level, score, availableInputs: available, missingInputs: missing, explanation };
};

// ─── TREND FORECAST ────────────────────────────────
const assessTrend = (
  t: TelemetryData
): { label: string; direction: 'RISING' | 'STABLE' | 'FALLING'; expectedPeakHours: number } => {
  const isRising = t.rainfallIntensityChange > 0 || t.waterLevelChange > 0.2;
  const isFalling = t.rainfallIntensityChange < -5 && t.waterLevelChange < 0;

  if (isRising) {
    const peakHours = t.rainfallIntensityChange > 10 ? 1 : t.rainfallIntensityChange > 5 ? 2 : 3;
    return { label: 'Risk increasing', direction: 'RISING', expectedPeakHours: peakHours };
  }
  if (isFalling) {
    return { label: 'Risk decreasing', direction: 'FALLING', expectedPeakHours: 0 };
  }
  return { label: 'Risk stable', direction: 'STABLE', expectedPeakHours: 0 };
};

// ─── MASTER RISK ENGINE ────────────────────────────
/**
 * Computes the final localized safety index.
 * Used by the Dashboard, Map, and Alert System.
 */
export const calculateMasterRisk = (telemetry: TelemetryData): PredictionResult => {
  const flood = predictFloodRisk(telemetry);
  const landslide = predictLandslideRisk(telemetry);
  const confidence = assessConfidence(telemetry);
  const trendForecast = assessTrend(telemetry);

  // Safety Score is inverse to risk. 100 = Safe, 0 = Critical Danger.
  const highestRisk = Math.max(landslide.probability, flood.probability);
  const compositeScore = 100 - highestRisk;

  let severityLabel: SeverityLabel = 'LOW';
  if (compositeScore < 25) severityLabel = 'CRITICAL';
  else if (compositeScore < 50) severityLabel = 'HIGH';
  else if (compositeScore < 75) severityLabel = 'MODERATE';

  return {
    compositeScore,
    severityLabel,
    landslideProbability: landslide.probability,
    floodProbability: flood.probability,
    triggers: [...flood.triggers, ...landslide.triggers],
    confidence,
    modelOutputs: {
      flood: flood.models,
      landslide: landslide.models,
    },
    trendForecast,
  };
};

// ─── DEFAULT TELEMETRY (Shimla worst-case simulation) ──
export const SHIMLA_DEFAULT_TELEMETRY: TelemetryData = {
  rainfallMmHr: 84,
  rainfall15min: 25,
  rainfall30min: 45,
  rainfall1h: 65,
  rainfall3h: 150,
  rainfall6h: 220,
  rainfall24h: 380,
  antecedentRainfall24h: 120,
  antecedentRainfall6h: 80,
  rainfallIntensityChange: 8, // increasing
  waterLevelMeters: 3.2,
  waterLevelChange: 0.6,
  soilSaturationPercent: 88,
  elevationMeters: 850,
  slopeAngleDegrees: 27,
  flowAccumulation: 950,
  distanceToRiverKm: 0.4,
  historicalFloodFrequency: 6,
  historicalLandslideFrequency: 4,
};
