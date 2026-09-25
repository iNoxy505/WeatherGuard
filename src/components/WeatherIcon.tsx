import React from 'react';
import Svg, { Path, Circle, G, Line, Polyline } from 'react-native-svg';

export type IconName = 'sun' | 'moon' | 'rain' | 'storm' | 'wind' | 'flood' | 'cloud' | 'shield' | 'alert' | 'map' | 'user' | 'settings' | 'bell' | 'logout' | 'edit' | 'check' | 'arrow-right' | 'home' | 'sos' | 'landslide' | 'route' | 'location' | 'history' | 'database';

interface WeatherIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, size = 24, color = '#F8FAFC' }) => {
  const icons: Record<string, React.ReactNode> = {
    sun: (
      <G>
        <Circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
    moon: (
      <G>
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    rain: (
      <G>
        <Path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="8" y1="16" x2="8" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="16" y1="16" x2="16" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
    storm: (
      <G>
        <Path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" fill="none" stroke={color} strokeWidth="2" />
        <Polyline points="13 11 9 17 15 17 11 23" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    wind: (
      <G>
        <Path d="M9.59 4.59A2 2 0 1 1 11 8H2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M12.59 19.41A2 2 0 1 0 14 16H2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
    flood: (
      <G>
        <Path d="M2 18c1.5-1.5 3-2 4.5-2s3 .5 4.5 2 3 2 4.5 2 3-.5 4.5-2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M2 14c1.5-1.5 3-2 4.5-2s3 .5 4.5 2 3 2 4.5 2 3-.5 4.5-2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M2 10c1.5-1.5 3-2 4.5-2s3 .5 4.5 2 3 2 4.5 2 3-.5 4.5-2" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
    cloud: (
      <G>
        <Path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    shield: (
      <G>
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={color} strokeWidth="2" />
        <Polyline points="9 12 11 14 15 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    alert: (
      <G>
        <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="12" cy="17" r="0.5" fill={color} stroke={color} strokeWidth="1" />
      </G>
    ),
    map: (
      <G>
        <Path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="8" y1="2" x2="8" y2="18" stroke={color} strokeWidth="2" />
        <Line x1="16" y1="6" x2="16" y2="22" stroke={color} strokeWidth="2" />
      </G>
    ),
    user: (
      <G>
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    settings: (
      <G>
        <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    bell: (
      <G>
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    logout: (
      <G>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke={color} strokeWidth="2" />
        <Polyline points="16 17 21 12 16 7" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
    edit: (
      <G>
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    check: (
      <G>
        <Polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    'arrow-right': (
      <G>
        <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Polyline points="12 5 19 12 12 19" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    home: (
      <G>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke={color} strokeWidth="2" />
        <Polyline points="9 22 9 12 15 12 15 22" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    sos: (
      <G>
        <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="12" cy="16" r="0.5" fill={color} stroke={color} strokeWidth="1" />
      </G>
    ),
    landslide: (
      <G>
        <Path d="M2 22L8 12L14 18L22 6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 6h6v6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="4" y1="18" x2="6" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <Line x1="6" y1="20" x2="9" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </G>
    ),
    route: (
      <G>
        <Circle cx="12" cy="5" r="3" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="12" y1="8" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
        <Path d="M9 19l3 3 3-3" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="22" r="1" fill={color} />
      </G>
    ),
    location: (
      <G>
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="10" r="3" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
    history: (
      <G>
        <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
        <Polyline points="12 6 12 12 16 14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    database: (
      <G>
        <Path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4z" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4" fill="none" stroke={color} strokeWidth="2" />
      </G>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name] || icons.cloud}
    </Svg>
  );
};
