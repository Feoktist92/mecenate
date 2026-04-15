export const colors = {
  screenBackground: '#F5F8FD',
  cardBackground: '#FFFFFF',
  textPrimary: '#111416',
  textSecondary: '#57626F',
  textMuted: '#A8AFB9',
  actionSurface: '#EFF2F7',
  inputSurface: '#ECEFF3',
  accent: '#6115CD',
  paidOverlay: 'rgba(0, 0, 0, 0.5)',
  paidText: '#FFFFFF',
  likeActiveBackground: '#FF2B75',
  likeActiveText: '#FFFFFF',
  borderSubtle: '#E6E9EF',
  skeleton: 'rgba(238, 239, 241, 0.8)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  pill: 9999,
} as const;

export const typography = {
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  bodyBold: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700' as const,
  },
  badge: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700' as const,
  },
} as const;
