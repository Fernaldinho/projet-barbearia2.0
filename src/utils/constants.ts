export const APP_NAME = 'agendai'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Private
  DASHBOARD: '/dashboard',
  SERVICES: '/services',
  CLIENTS: '/clients',
  APPOINTMENTS: '/appointments',
  STAFF: '/staff',
  BUSINESS_HOURS: '/business-hours',
  BLOCKED_TIMES: '/blocked-times',
  SETTINGS: '/settings',
  BILLING: '/billing',
  SUBSCRIPTION: '/subscription',
  PUBLIC_PAGE: '/public-page',
  ONBOARDING: '/onboarding',
} as const

export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const

export const PLAN_FEATURES = {
  [PLANS.FREE]: {
    name: 'Gratuito',
    maxClients: 2,
    maxServices: 1,
    maxAppointmentsPerMonth: 2,
    hasReports: false,
    hasBilling: false,
    upgradeLinks: {
      monthly: 'https://pay.kirvano.com/435f6ec9-afb0-4405-8e12-8d49bbf652d6',
      semiannual: 'https://pay.kirvano.com/f6753696-480f-4b00-9a16-73463b09f9b7'
    }
  },
  [PLANS.STARTER]: {
    name: 'Starter',
    maxClients: 200,
    maxServices: 50,
    maxAppointmentsPerMonth: 500,
    hasReports: true,
    hasBilling: false,
  },
  [PLANS.PRO]: {
    name: 'Profissional',
    maxClients: -1, // unlimited
    maxServices: -1,
    maxAppointmentsPerMonth: -1,
    hasReports: true,
    hasBilling: true,
  },
  [PLANS.ENTERPRISE]: {
    name: 'Enterprise',
    maxClients: -1,
    maxServices: -1,
    maxAppointmentsPerMonth: -1,
    hasReports: true,
    hasBilling: true,
  },
} as const
