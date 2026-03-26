import { createBrowserRouter } from 'react-router-dom'

// Layouts
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Public Pages
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { BookingPage } from '@/modules/booking/BookingPage'

// Private Module Pages
import { DashboardPage } from '@/modules/dashboard/DashboardPage'
import { ServicesPage } from '@/modules/services/ServicesPage'
import { ClientsPage } from '@/modules/clients/ClientsPage'
import { BirthdaysPage } from '@/modules/clients/BirthdaysPage'
import { AppointmentsPage } from '@/modules/appointments/AppointmentsPage'
import { StaffPage } from '@/modules/staff/StaffPage'
import { BusinessHoursPage } from '@/modules/business-hours/BusinessHoursPage'
import { BlockedTimesPage } from '@/modules/blocked-times/BlockedTimesPage'
import { BillingPage } from '@/modules/billing/BillingPage'
import { SubscriptionPage } from '@/modules/billing/SubscriptionPage'
import { SettingsPage } from '@/modules/settings/SettingsPage'
import { PublicPage } from '@/modules/public/PublicPage'
import { ClientPortal } from '@/modules/client/ClientPortal'
import { NotificationsPage } from '@/modules/notifications/NotificationsPage'

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/portal',
    element: <ClientPortal />,
  },
  {
    path: '/portal/:slug',
    element: <ClientPortal />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/book/:slug',
    element: <BookingPage />,
  },



  // Private routes (wrapped in ProtectedRoute + DashboardLayout)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
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
    ],
  },
])
