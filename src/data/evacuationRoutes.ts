/**
 * Evacuation route data for each zone.
 * Each route has waypoints (SVG coordinates) and a destination safe zone.
 */

export interface EvacuationRoute {
  id: string;
  fromZone: string;
  toZone: string;
  toName: string;
  waypoints: { x: number; y: number }[];
  distanceKm: number;
  estimatedMinutes: number;
  roadCondition: 'CLEAR' | 'MODERATE' | 'BLOCKED';
}

export const EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'route_z1_z8',
    fromZone: 'z1',
    toZone: 'z8',
    toName: 'Relief Center',
    waypoints: [
      { x: 70, y: 100 },
      { x: 70, y: 180 },
      { x: 160, y: 180 },
      { x: 250, y: 260 },
    ],
    distanceKm: 1.2,
    estimatedMinutes: 8,
    roadCondition: 'CLEAR',
  },
  {
    id: 'route_z2_z8',
    fromZone: 'z2',
    toZone: 'z8',
    toName: 'Relief Center',
    waypoints: [
      { x: 195, y: 100 },
      { x: 195, y: 180 },
      { x: 250, y: 260 },
    ],
    distanceKm: 0.9,
    estimatedMinutes: 6,
    roadCondition: 'CLEAR',
  },
  {
    id: 'route_z3_z8',
    fromZone: 'z3',
    toZone: 'z8',
    toName: 'Relief Center',
    waypoints: [
      { x: 300, y: 100 },
      { x: 300, y: 180 },
      { x: 250, y: 260 },
    ],
    distanceKm: 1.5,
    estimatedMinutes: 10,
    roadCondition: 'MODERATE',
  },
  {
    id: 'route_z4_z7',
    fromZone: 'z4',
    toZone: 'z7',
    toName: 'School Zone',
    waypoints: [
      { x: 60, y: 210 },
      { x: 80, y: 260 },
    ],
    distanceKm: 0.4,
    estimatedMinutes: 3,
    roadCondition: 'CLEAR',
  },
  {
    id: 'route_z5_z8',
    fromZone: 'z5',
    toZone: 'z8',
    toName: 'Relief Center',
    waypoints: [
      { x: 185, y: 210 },
      { x: 250, y: 260 },
    ],
    distanceKm: 0.7,
    estimatedMinutes: 5,
    roadCondition: 'MODERATE',
  },
  {
    id: 'route_z6_z8',
    fromZone: 'z6',
    toZone: 'z8',
    toName: 'Relief Center',
    waypoints: [
      { x: 300, y: 210 },
      { x: 300, y: 260 },
      { x: 250, y: 260 },
    ],
    distanceKm: 0.6,
    estimatedMinutes: 4,
    roadCondition: 'CLEAR',
  },
];

export const SAFE_ZONES = [
  { id: 'z7', name: 'School Zone', x: 10, y: 220, w: 140, h: 80 },
  { id: 'z8', name: 'Relief Center', x: 160, y: 220, w: 180, h: 80 },
];

export function getNearestRoute(fromZoneId: string): EvacuationRoute | null {
  const routes = EVACUATION_ROUTES.filter((r) => r.fromZone === fromZoneId);
  if (routes.length === 0) return null;
  // Return the one with shortest time
  return routes.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)[0];
}

export function getRoutePathD(route: EvacuationRoute): string {
  if (route.waypoints.length === 0) return '';
  let d = `M ${route.waypoints[0].x} ${route.waypoints[0].y}`;
  for (let i = 1; i < route.waypoints.length; i++) {
    d += ` L ${route.waypoints[i].x} ${route.waypoints[i].y}`;
  }
  return d;
}
