import { useEffect, useState, useCallback } from 'react'
import { useCompany } from '@/contexts/CompanyContext'
import { useAuth } from '@/contexts/AuthContext'

import { StatsCards } from './StatsCards'
import { RevenueChart } from './RevenueChart'
import { AppointmentsChart } from './AppointmentsChart'
import { TopServices } from './TopServices'
import { TodaySchedule } from './TodaySchedule'

import {
  getDashboardMetrics,
  getDailyRevenue,
  getDailyAppointments,
  getTopServices,
  getTodaySchedule,
  type DashboardMetrics,
  type DailyRevenuePoint,
  type DailyAppointmentsPoint,
  type TopServiceItem,
  type TodayAppointment,
} from './dashboard.api'

type Period = '7d' | '30d' | 'month'

const periodLabels: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  'month': 'Mês atual',
}

export function DashboardPage() {
  const { user } = useAuth()
  const { company } = useCompany()

  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(false)

  // Data
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    appointmentsToday: 0,
    newClientsThisMonth: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    totalAppointmentsMonth: 0,
    completedAppointmentsMonth: 0,
  })
  const [revenueData, setRevenueData] = useState<DailyRevenuePoint[]>([])
  const [appointmentsData, setAppointmentsData] = useState<DailyAppointmentsPoint[]>([])
  const [topServicesData, setTopServicesData] = useState<TopServiceItem[]>([])
  const [todayScheduleData, setTodayScheduleData] = useState<TodayAppointment[]>([])

  // Initial load (metrics + today)
  const loadInitial = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const [m, schedule] = await Promise.all([
        getDashboardMetrics(company.id),
        getTodaySchedule(company.id),
      ])
      setMetrics(m)
      setTodayScheduleData(schedule)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  // Charts (period-dependent)
  const loadCharts = useCallback(async () => {
    if (!company?.id) return
    setChartsLoading(true)
    try {
      const [revenue, appointments, topSvcs] = await Promise.all([
        getDailyRevenue(company.id, period),
        getDailyAppointments(company.id, period),
        getTopServices(company.id, period),
      ])
      setRevenueData(revenue)
      setAppointmentsData(appointments)
      setTopServicesData(topSvcs)
    } catch (err) {
      console.error('Charts load error:', err)
    } finally {
      setChartsLoading(false)
    }
  }, [company?.id, period])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  useEffect(() => {
    loadCharts()
  }, [loadCharts])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const userName = user?.user_metadata?.full_name || 'Usuário'

  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="mb-3">
            {greeting()}, <span className="text-primary">{userName.split(' ')[0]}</span>.
          </h1>
          <p className="text-p text-lg md:text-xl opacity-80">
            Sua barbearia está com <span className="text-white font-bold">{metrics.attendanceRate}%</span> de ocupação hoje. Aqui está o resumo da sua operação.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center bg-bg-surface border border-border-subtle rounded-xl p-1 self-start lg:self-end backdrop-blur-md">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold tracking-wider uppercase transition-all ${
                period === p
                  ? 'bg-primary text-primary-text shadow-lg shadow-primary/20'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Section */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-bg-surface border border-border-subtle animate-pulse" />
            ))}
          </div>
        ) : (
          <StatsCards metrics={metrics} />
        )}
      </section>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-start">
        
        {/* Left Column: Appointments (Large) */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {loading ? (
            <div className="h-96 rounded-xl bg-bg-surface border border-border-subtle animate-pulse" />
          ) : (
            <TodaySchedule appointments={todayScheduleData} />
          )}

          {/* Revenue Chart Section */}
          <section className="card-premium">
             <h3 className="mb-6 font-headline text-xl text-white uppercase tracking-widest">Fluxo de Caixa</h3>
             {chartsLoading ? (
               <div className="h-64 w-full bg-bg-base/40 rounded-lg animate-pulse" />
             ) : (
               <RevenueChart data={revenueData} />
             )}
          </section>
        </div>

        {/* Right Column: Insights & Performance (Small) */}
        <div className="space-y-8 md:space-y-12">
          {/* Appointments Distribution Chart */}
          <section className="card-premium">
            <h3 className="mb-6 font-headline text-lg text-white uppercase tracking-widest">Demanda</h3>
            {chartsLoading ? (
               <div className="h-48 w-full bg-bg-base/40 rounded-lg animate-pulse" />
             ) : (
               <AppointmentsChart data={appointmentsData} />
             )}
          </section>

          {/* Top Services */}
          <section>
            {chartsLoading ? (
              <div className="h-72 rounded-xl bg-bg-surface border border-border-subtle animate-pulse" />
            ) : (
              <TopServices data={topServicesData} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
