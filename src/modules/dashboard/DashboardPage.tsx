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
    <div className="space-y-[60px] animate-fade-in pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <span className="font-label text-primary-container tracking-[0.4em] uppercase text-xs block mb-4">Visão Estratégica</span>
          <h1 className="text-5xl lg:text-8xl font-black text-white font-headline leading-[0.9] tracking-tighter uppercase">
            PAINEL<br />EXECUTIVO<span className="text-primary-container">.</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-medium mt-8 leading-relaxed max-w-2xl">
            {greeting()}, <span className="text-white">{userName.split(' ')[0]}</span>. Sua operação está processando <span className="text-white italic">{metrics.attendanceRate}%</span> de capacidade hoje.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center bg-surface-container-low rounded-full p-2 h-auto self-start lg:self-end border border-outline-variant/5">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-full text-[10px] font-black tracking-[0.1em] uppercase transition-all ${
                period === p
                  ? 'bg-primary-container text-on-primary-fixed shadow-xl shadow-primary-container/20'
                  : 'text-on-surface-variant/40 hover:text-white'
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
          <section className="p-[24px] rounded-2xl bg-surface-container-low">
            <h3 className="!mb-6 font-headline text-lg text-white">Demanda por Período</h3>
            {chartsLoading ? (
               <div className="h-[200px] w-full bg-surface-container/30 rounded-xl animate-pulse" />
             ) : (
               <AppointmentsChart data={appointmentsData} />
             )}
          </section>

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
