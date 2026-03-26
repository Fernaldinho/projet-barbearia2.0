import { supabase } from '@/lib/supabase'

// ============================================
// Types
// ============================================

export interface DashboardMetrics {
  appointmentsToday: number
  newClientsThisMonth: number
  monthlyRevenue: number      // Receita Efetuada (Completed)
  projectedRevenue: number    // Aguardando Conclusão (Scheduled/Confirmed)
  totalForecast: number       // Previsão do Mês (Sum)
  attendanceRate: number
  totalAppointmentsMonth: number
  completedAppointmentsMonth: number
}

export interface DailyRevenuePoint {
  date: string
  label: string
  revenue: number
  projected: number
}

export interface DailyAppointmentsPoint {
  date: string
  label: string
  total: number
  completed: number
  confirmed: number
  scheduled: number
  cancelled: number
}

export interface TopServiceItem {
  name: string
  count: number
  revenue: number
}

export interface TodayAppointment {
  id: string
  start_time: string
  end_time: string
  status: string
  client_name: string
  service_name: string
}

// ============================================
// Date helpers
// ============================================

function getDateRange(period: string): { start: string; end: string } {
  const now = new Date()
  const end = now.toISOString().split('T')[0]

  switch (period) {
    case '7d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 6)
      return { start: d.toISOString().split('T')[0], end }
    }
    case '30d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 29)
      return { start: d.toISOString().split('T')[0], end }
    }
    case 'month':
    default: {
      const year = now.getFullYear()
      const month = now.getMonth()
      const lastDay = new Date(year, month + 1, 0).getDate()
      return { 
        start: `${year}-${(month + 1).toString().padStart(2, '0')}-01`, 
        end: `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDay}` 
      }
    }
  }
}

function getDaysBetween(start: string, end: string): string[] {
  const days: string[] = []
  const current = new Date(start + 'T12:00:00')
  const endDate = new Date(end + 'T12:00:00')
  while (current <= endDate) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return days
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
}

// ============================================
// Metrics
// ============================================

export async function getDashboardMetrics(companyId: string): Promise<DashboardMetrics> {
  const today = new Date().toISOString().split('T')[0]
  const monthStart = `${today.slice(0, 7)}-01`

  const [todayAppts, newClients, monthAppts] = await Promise.all([
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('date', today)
      .in('status', ['scheduled', 'confirmed', 'completed']),

    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .gte('created_at', monthStart + 'T00:00:00'),

    supabase
      .from('appointments')
      .select('status, date, start_time, service:services(price)')
      .eq('company_id', companyId)
      .gte('date', monthStart),
  ])

  const allAppts = monthAppts.data || []
  const now = new Date()

  const isActuallyDone = (a: any) => {
    if (a.status === 'completed') return true
    if (a.status !== 'confirmed') return false
    // If confirmed and date/time is past, consider it done for metrics
    try {
      const appDate = new Date(`${a.date}T${a.start_time}`)
      return appDate < now
    } catch {
      return false
    }
  }

  const totalMonth = allAppts.filter(a => a.status !== 'cancelled').length
  const completedMonth = allAppts.filter(isActuallyDone).length
  const attendanceRate = totalMonth > 0 ? (completedMonth / totalMonth) * 100 : 0

  const monthlyRevenue = allAppts
    .filter(a => a.status === 'completed')
    .reduce((sum, a: any) => {
      const serviceData = Array.isArray(a.service) ? a.service[0] : a.service
      return sum + (Number(serviceData?.price) || 0)
    }, 0)

  const projectedRevenue = allAppts
    .filter(a => ['scheduled', 'confirmed'].includes(a.status))
    .reduce((sum, a: any) => {
      const serviceData = Array.isArray(a.service) ? a.service[0] : a.service
      return sum + (Number(serviceData?.price) || 0)
    }, 0)

  return {
    appointmentsToday: todayAppts.count || 0,
    newClientsThisMonth: newClients.count || 0,
    monthlyRevenue,
    projectedRevenue,
    totalForecast: monthlyRevenue + projectedRevenue,
    attendanceRate: Math.round(attendanceRate),
    totalAppointmentsMonth: totalMonth,
    completedAppointmentsMonth: completedMonth,
  }
}

// ============================================
// Charts data
// ============================================

export async function getDailyRevenue(companyId: string, period: string): Promise<DailyRevenuePoint[]> {
  const { start, end } = getDateRange(period)
  const days = getDaysBetween(start, end)

  const { data, error } = await supabase
    .from('appointments')
    .select('date, status, service:services(price)')
    .eq('company_id', companyId)
    .in('status', ['completed', 'confirmed', 'scheduled'])
    .gte('date', start)
    .lte('date', end)

  if (error) throw error

  const revenueByDay = new Map<string, number>()
  const projectedByDay = new Map<string, number>()
  
  for (const appt of data || []) {
    const service = appt.service as unknown as { price: number } | null
    const price = Number(service?.price) || 0
    
    if (appt.status === 'completed') {
      const prev = revenueByDay.get(appt.date) || 0
      revenueByDay.set(appt.date, prev + price)
    } else {
      const prev = projectedByDay.get(appt.date) || 0
      projectedByDay.set(appt.date, prev + price)
    }
  }

  return days.map((day) => ({
    date: day,
    label: formatDayLabel(day),
    revenue: revenueByDay.get(day) || 0,
    projected: projectedByDay.get(day) || 0,
  }))
}

export async function getDailyAppointments(companyId: string, period: string): Promise<DailyAppointmentsPoint[]> {
  const { start, end } = getDateRange(period)
  const days = getDaysBetween(start, end)

  const { data, error } = await supabase
    .from('appointments')
    .select('date, status')
    .eq('company_id', companyId)
    .gte('date', start)
    .lte('date', end)

  if (error) throw error

  const byDay = new Map<string, { total: number; completed: number; confirmed: number; scheduled: number; cancelled: number }>()
  for (const a of data || []) {
    const prev = byDay.get(a.date) || { total: 0, completed: 0, confirmed: 0, scheduled: 0, cancelled: 0 }
    prev.total++
    if (a.status === 'completed') prev.completed++
    if (a.status === 'confirmed') prev.confirmed++
    if (a.status === 'scheduled') prev.scheduled++
    if (a.status === 'cancelled' || a.status === 'no_show') prev.cancelled++
    byDay.set(a.date, prev)
  }

  return days.map((day) => {
    const stats = byDay.get(day) || { total: 0, completed: 0, confirmed: 0, scheduled: 0, cancelled: 0 }
    return {
      date: day,
      label: formatDayLabel(day),
      ...stats,
    }
  })
}

export async function getTopServices(companyId: string, period: string): Promise<TopServiceItem[]> {
  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from('appointments')
    .select('service:services(name, price)')
    .eq('company_id', companyId)
    .eq('status', 'completed')
    .gte('date', start)
    .lte('date', end)

  if (error) throw error

  const serviceMap = new Map<string, { count: number; revenue: number }>()
  for (const a of data || []) {
    const service = a.service as unknown as { name: string; price: number } | null
    if (!service) continue
    const prev = serviceMap.get(service.name) || { count: 0, revenue: 0 }
    prev.count++
    prev.revenue += service.price
    serviceMap.set(service.name, prev)
  }

  return Array.from(serviceMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// ============================================
// Today schedule
// ============================================

export async function getTodaySchedule(companyId: string): Promise<TodayAppointment[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('appointments')
    .select('id, start_time, end_time, status, client:clients(name), service:services(name)')
    .eq('company_id', companyId)
    .eq('date', today)
    .order('start_time', { ascending: true })

  if (error) throw error

  return (data || []).map((a) => ({
    id: a.id,
    start_time: a.start_time,
    end_time: a.end_time,
    status: a.status,
    client_name: (a.client as any)?.name || 'Cliente',
    service_name: (a.service as any)?.name || 'Serviço',
  }))
}

// ============================================
// Birthday Sync Logic
// ============================================

export async function checkBirthdays(companyId: string): Promise<void> {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const todayMonth = today.getMonth()
  const todayDay = today.getDate()

  // 1. Check if we already created a birthday notification today to avoid spam
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('company_id', companyId)
    .eq('type', 'birthday')
    .gte('created_at', todayStr + 'T00:00:00')
    .limit(1)

  if (existing && existing.length > 0) return

  // 2. Fetch all clients (we'll filter in JS since PG month/day extraction is complex via RPC-less Supabase)
  const { data: clients } = await supabase
    .from('clients')
    .select('name, birth_date')
    .eq('company_id', companyId)
    .not('birth_date', 'is', null)

  const birthdayBoys = (clients || []).filter(c => {
    const d = new Date(c.birth_date)
    return d.getMonth() === todayMonth && d.getDate() === todayDay
  })

  if (birthdayBoys.length === 0) return

  // 3. Create the notification
  const names = birthdayBoys.map(c => c.name).join(', ')
  const title = birthdayBoys.length === 1 ? 'Aniversariante do Dia!' : 'Aniversariantes do Dia!'
  const message = birthdayBoys.length === 1 
    ? `Hoje é aniversário de ${names}. Que tal enviar um parabéns? 🎂`
    : `Hoje temos ${birthdayBoys.length} clientes soprando velinhas: ${names}. 🎉`

  await supabase.from('notifications').insert({
    company_id: companyId,
    title,
    message,
    type: 'birthday'
  })
}
