/**
 * WeatherGuard Premium Design Tokens
 * Dual-theme glassmorphism design system
 */

export interface ThemeColors {
  bg: {
    primary: string;
    secondary: string;
    card: string;
    glass: string;
    glassBorder: string;
    elevated: string;
    input: string;
    inputFocused: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  accent: {
    cyan: string;
    cyanDark: string;
    cyanGlow: string;
    amber: string;
    amberDark: string;
    amberGlow: string;
  };
  severity: {
    low: { bg: string; text: string; accent: string };
    moderate: { bg: string; text: string; accent: string };
    high: { bg: string; text: string; accent: string };
    critical: { bg: string; text: string; accent: string };
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
    online: string;
    offline: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
  };
  gradient: {
    primary: string[];
    card: string[];
    accent: string[];
    warm: string[];
    danger: string[];
    hero: string[];
    welcome: string[];
  };
  shadow: {
    glow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    subtle: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export const DarkColors: ThemeColors = {
  bg: {
    primary: '#0A0E1A',
    secondary: '#111827',
    card: 'rgba(26, 31, 53, 0.85)',
    glass: 'rgba(255, 255, 255, 0.06)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    elevated: '#1A1F35',
    input: 'rgba(255, 255, 255, 0.08)',
    inputFocused: 'rgba(255, 255, 255, 0.12)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    muted: '#475569',
    inverse: '#0F172A',
  },
  accent: {
    cyan: '#00D4FF',
    cyanDark: '#0891B2',
    cyanGlow: 'rgba(0, 212, 255, 0.25)',
    amber: '#FFB800',
    amberDark: '#D97706',
    amberGlow: 'rgba(255, 184, 0, 0.25)',
  },
  severity: {
    low: { bg: 'rgba(22, 163, 74, 0.15)', text: '#4ADE80', accent: '#16A34A' },
    moderate: { bg: 'rgba(202, 138, 4, 0.15)', text: '#FACC15', accent: '#CA8A04' },
    high: { bg: 'rgba(234, 88, 12, 0.15)', text: '#FB923C', accent: '#EA580C' },
    critical: { bg: 'rgba(220, 38, 38, 0.15)', text: '#F87171', accent: '#DC2626' },
  },
  status: {
    success: '#4ADE80',
    warning: '#FACC15',
    error: '#F87171',
    info: '#60A5FA',
    online: '#4ADE80',
    offline: '#F59E0B',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    primary: ['#0A0E1A', '#111827', '#1A1F35'],
    card: ['rgba(26, 31, 53, 0.9)', 'rgba(17, 24, 39, 0.9)'],
    accent: ['#00D4FF', '#0891B2'],
    warm: ['#FFB800', '#F59E0B'],
    danger: ['#DC2626', '#991B1B'],
    hero: ['#0A0E1A', '#0F172A', '#1E293B'],
    welcome: ['#0A0E1A', '#0C1222', '#162033'],
  },
  shadow: {
    glow: {
      shadowColor: '#00D4FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    subtle: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

export const LightColors: ThemeColors = {
  bg: {
    primary: '#F1F5F9',
    secondary: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.75)', // More translucent for glass effect
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.9)',
    elevated: '#FFFFFF',
    input: 'rgba(0, 0, 0, 0.03)',
    inputFocused: 'rgba(0, 0, 0, 0.06)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  accent: {
    cyan: '#0284C7',
    cyanDark: '#0369A1',
    cyanGlow: 'rgba(2, 132, 199, 0.2)',
    amber: '#EA580C',
    amberDark: '#C2410C',
    amberGlow: 'rgba(234, 88, 12, 0.2)',
  },
  severity: {
    low: { bg: 'rgba(22, 163, 74, 0.1)', text: '#16A34A', accent: '#15803D' },
    moderate: { bg: 'rgba(234, 179, 8, 0.15)', text: '#CA8A04', accent: '#A16207' },
    high: { bg: 'rgba(249, 115, 22, 0.15)', text: '#EA580C', accent: '#C2410C' },
    critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#DC2626', accent: '#B91C1C' },
  },
  status: {
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    info: '#2563EB',
    online: '#16A34A',
    offline: '#EA580C',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    strong: 'rgba(0, 0, 0, 0.15)',
  },
  gradient: {
    primary: ['#E2E8F0', '#F1F5F9', '#FFFFFF'], // Softer light mode background
    card: ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.8)'],
    accent: ['#38BDF8', '#0284C7'], // Brighter, glossier button gradient
    warm: ['#FDBA74', '#EA580C'],
    danger: ['#F87171', '#DC2626'],
    hero: ['#E0F2FE', '#F1F5F9', '#FFFFFF'],
    welcome: ['#BAE6FD', '#E0F2FE', '#F8FAFC'],
  },
  shadow: {
    glow: {
      shadowColor: '#38BDF8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
    },
    card: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    subtle: {
      shadowColor: '#94A3B8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  },
};

/** Legacy default export for backward compatibility during migration */
export const Colors = DarkColors;

export function getTheme(isDark: boolean): ThemeColors {
  return isDark ? DarkColors : LightColors;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
  display: 48,
};
