/**
 * WeatherGuard Premium Design Tokens
 * Dark-theme glassmorphism design system
 */

export const Colors = {
  // Core backgrounds
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

  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    muted: '#475569',
    inverse: '#0F172A',
  },

  // Accent
  accent: {
    cyan: '#00D4FF',
    cyanDark: '#0891B2',
    cyanGlow: 'rgba(0, 212, 255, 0.25)',
    amber: '#FFB800',
    amberDark: '#D97706',
    amberGlow: 'rgba(255, 184, 0, 0.25)',
  },

  // Severity
  severity: {
    low: { bg: 'rgba(22, 163, 74, 0.15)', text: '#4ADE80', accent: '#16A34A' },
    moderate: { bg: 'rgba(202, 138, 4, 0.15)', text: '#FACC15', accent: '#CA8A04' },
    high: { bg: 'rgba(234, 88, 12, 0.15)', text: '#FB923C', accent: '#EA580C' },
    critical: { bg: 'rgba(220, 38, 38, 0.15)', text: '#F87171', accent: '#DC2626' },
  },

  // Status
  status: {
    success: '#4ADE80',
    warning: '#FACC15',
    error: '#F87171',
    info: '#60A5FA',
    online: '#4ADE80',
    offline: '#F59E0B',
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },

  // Gradients (for LinearGradient)
  gradient: {
    primary: ['#0A0E1A', '#111827', '#1A1F35'],
    card: ['rgba(26, 31, 53, 0.9)', 'rgba(17, 24, 39, 0.9)'],
    accent: ['#00D4FF', '#0891B2'],
    warm: ['#FFB800', '#F59E0B'],
    danger: ['#DC2626', '#991B1B'],
    hero: ['#0A0E1A', '#0F172A', '#1E293B'],
    welcome: ['#0A0E1A', '#0C1222', '#162033'],
  },

  // Shadows
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
