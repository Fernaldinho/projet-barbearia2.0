import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
const DashboardLayout = lazy(() => import('@/components/DashboardLayout').then(m => ({ default: m.DashboardLayout })))
const ProtectedRoute = lazy(() => import('@/components/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })))

// Public Pages
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })))
const BookingPage = lazy(() => import('@/modules/booking/BookingPage').then(m => ({ default: m.BookingPage })))

// Private Module Pages
const DashboardPage = lazy(() => import('@/modules/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ServicesPage = lazy(() => import('@/modules/services/ServicesPage').then(m => ({ default: m.ServicesPage })))
const ClientsPage = lazy(() => import('@/modules/clients/ClientsPage').then(m => ({ default: m.ClientsPage })))
const BirthdaysPage = lazy(() => import('@/modules/clients/BirthdaysPage').then(m => ({ default: m.BirthdaysPage })))
const AppointmentsPage = lazy(() => import('@/modules/appointments/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })))
const StaffPage = lazy(() => import('@/modules/staff/StaffPage').then(m => ({ default: m.StaffPage })))
const BusinessHoursPage = lazy(() => import('@/modules/business-hours/BusinessHoursPage').then(m => ({ default: m.BusinessHoursPage })))
const BlockedTimesPage = lazy(() => import('@/modules/blocked-times/BlockedTimesPage').then(m => ({ default: m.BlockedTimesPage })))
const BillingPage = lazy(() => import('@/modules/billing/BillingPage').then(m => ({ default: m.BillingPage })))
const SubscriptionPage = lazy(() => import('@/modules/billing/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })))
const SettingsPage = lazy(() => import('@/modules/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const PublicPage = lazy(() => import('@/modules/public/PublicPage').then(m => ({ default: m.PublicPage })))
const ClientPortal = lazy(() => import('@/modules/client/ClientPortal').then(m => ({ default: m.ClientPortal })))
const NotificationsPage = lazy(() => import('@/modules/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })))

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin" />
  </div>
)

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/portal',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ClientPortal />
      </Suspense>
    ),
  },
  {
    path: '/portal/:slug',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ClientPortal />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/book/:slug',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <BookingPage />
      </Suspense>
    ),
  },

  // Private routes (wrapped in ProtectedRoute + DashboardLayout)
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/services',
        element: <ServicesPage />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/birthdays',
        element: <BirthdaysPage />,
      },
      {
        path: '/appointments',
        element: <AppointmentsPage />,
      },
      {
        path: '/staff',
        element: <StaffPage />,
      },
      {
        path: '/business-hours',
        element: <BusinessHoursPage />,
      },
      {
        path: '/blocked-times',
        element: <BlockedTimesPage />,
      },
      {
        path: '/billing',
        element: <BillingPage />,
      },
      {
        path: '/subscription',
        element: <SubscriptionPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/public-page',
        element: <PublicPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
    ],
  },
  // Catch all - redirect home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
