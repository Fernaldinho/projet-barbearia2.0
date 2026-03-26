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
  checkBirthdays,
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
    projectedRevenue: 0,
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
        checkBirthdays(company.id)
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
    <div className="space-y-[32px] animate-fade-in pb-10">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline tracking-tighter text-[#E5E2E1]">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.monthlyRevenue)}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant font-medium max-w-xl leading-relaxed">
            Sua barbearia está com <span className="text-white font-bold">{metrics.attendanceRate}%</span> de ocupação hoje. Você tem <span className="text-[#fbbf24] font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.projectedRevenue)}</span> em faturamento previsto.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center bg-surface-container-low rounded-2xl p-1 backdrop-blur-md overflow-x-auto max-w-full">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs md:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                period === p
                  ? 'bg-primary-container text-on-primary-fixed shadow-lg shadow-primary-container/20'
                  : 'text-on-surface-variant hover:text-white'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[140px] rounded-2xl bg-surface-container-low animate-pulse" />
            ))}
          </div>
        ) : (
          <StatsCards metrics={metrics} />
        )}
      </section>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Appointments (Large) */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="h-[400px] rounded-2xl bg-surface-container-low animate-pulse" />
          ) : (
            <TodaySchedule appointments={todayScheduleData} />
          )}

          {/* Revenue Chart Section */}
          <section className="p-[24px] rounded-2xl bg-surface-container-low">
             <h3 className="!mb-6 font-headline text-xl text-white">Fluxo de Caixa</h3>
             {chartsLoading ? (
               <div className="h-[250px] w-full bg-surface-container/30 rounded-xl animate-pulse" />
             ) : (
               <RevenueChart data={revenueData} />
             )}
          </section>
        </div>

        {/* Right Column: Insights & Performance (Small) */}
        <div className="space-y-8">
          {/* Appointments Distribution Chart */}
          <div className="bg-[#1C1B1B] p-4 sm:p-6 lg:p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-lg font-black font-headline text-[#E5E2E1] uppercase tracking-tighter mb-6 sm:mb-8">Demanda por Período</h3>
            {chartsLoading ? (
               <div className="h-[250px] sm:h-[300px]">
                 <div className="h-[200px] w-full bg-surface-container/30 rounded-xl animate-pulse" />
               </div>
             ) : (
               <AppointmentsChart data={appointmentsData} />
             )}
          </div>

          {/* Top Services */}
          <section>
            {chartsLoading ? (
              <div className="h-[300px] rounded-2xl bg-surface-container-low animate-pulse" />
            ) : (
              <TopServices data={topServicesData} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
