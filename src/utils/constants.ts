// API Base URL - Update this when connecting to your backend
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000/api';

// Local Storage Keys
export const AUTH_TOKEN_KEY = 'fakecheck_auth_token';
export const USER_DATA_KEY = 'fakecheck_user_data';

// Verification Result Types
export const RESULT_TYPES = {
  TRUE: 'true',
  UNCERTAIN: 'uncertain',
  FALSE: 'false',
} as const;

// Result Colors
export const RESULT_COLORS = {
  [RESULT_TYPES.TRUE]: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700',
    badge: 'bg-green-500',
    icon: '🟢',
    label: 'Likely True'
  },
  [RESULT_TYPES.UNCERTAIN]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    badge: 'bg-yellow-500',
    icon: '🟡',
    label: 'Uncertain'
  },
  [RESULT_TYPES.FALSE]: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
    badge: 'bg-red-500',
    icon: '🔴',
    label: 'Likely False'
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  HISTORY: '/history',
  COMMUNITY: '/community',
} as const;
