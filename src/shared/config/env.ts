const DEFAULT_API_BASE_URL = 'https://k8s.mectest.ru/test-app';
const DEFAULT_API_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '');

export const env = {
  API_BASE_URL: normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL),
  API_TOKEN: process.env.EXPO_PUBLIC_API_TOKEN || DEFAULT_API_TOKEN,
} as const;

