import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, ArrowLeft, Sparkles, LayoutGrid, AlertCircle } from 'lucide-react'

import { getCompanyBySlug, getActiveServices, findOrCreateClient, createPublicBooking } from './booking.api'
import { getActiveStaff } from '@/modules/staff/staff.api'
import { getAvailableSlots } from '@/lib/availability'
import type { Company, Service, Staff } from '@/types'
import type { TimeSlot } from '@/lib/availability'

import { ServiceSelector } from './ServiceSelector'
import { StaffSelector } from './StaffSelector'
import { DateSelector } from './DateSelector'
import { TimeSelector } from './TimeSelector'
import { ClientForm } from './ClientForm'
import { ConfirmationScreen } from './ConfirmationScreen'
import { cn } from '@/utils/helpers'

type BookingStep = 'service' | 'staff' | 'date' | 'time' | 'client' | 'confirmation'

const STEP_ORDER: BookingStep[] = ['service', 'staff', 'date', 'time', 'client', 'confirmation']

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()

  // Data
  const [company, setCompany] = useState<Company | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isDayClosed, setIsDayClosed] = useState(false)

  // Selection state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [staffSelected, setStaffSelected] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')

  // UI state
  const [step, setStep] = useState<BookingStep>('service')
  const [pageLoading, setPageLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const hasStaff = staffList.length > 0
  const activeSteps = hasStaff ? STEP_ORDER : STEP_ORDER.filter((s) => s !== 'staff')

  useEffect(() => {
    if (!slug) return
    loadCompany()
  }, [slug])

  const loadCompany = async () => {
    try {
      const comp = await getCompanyBySlug(slug!)
      if (!comp) {
        setNotFound(true)
        setPageLoading(false)
        return
      }
      setCompany(comp)
      const [svcs, staff] = await Promise.all([
        getActiveServices(comp.id),
        getActiveStaff(comp.id),
      ])
      setServices(svcs)
      setStaffList(staff)
    } catch (err) {
      console.error('Error loading company:', err)
      setNotFound(true)
    } finally {
      setPageLoading(false)
    }
  }

  const loadSlots = useCallback(async () => {
    if (!company?.id || !selectedService || !selectedDate) return
    setSlotsLoading(true)
    try {
      const result = await getAvailableSlots(
        company.id, selectedDate, selectedService.id,
        selectedStaff?.id
      )
      setIsDayClosed(!result.is_open)
      setAvailableSlots(result.slots)
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }, [company?.id, selectedService?.id, selectedDate, selectedStaff?.id])

  useEffect(() => {
    if (step === 'time') loadSlots()
  }, [step, loadSlots])

  const currentStepIndex = activeSteps.indexOf(step)

  const goBack = () => {
    if (currentStepIndex > 0) setStep(activeSteps[currentStepIndex - 1])
  }
  const goNext = () => {
    if (currentStepIndex < activeSteps.length - 1) setStep(activeSteps[currentStepIndex + 1])
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setSelectedTime(null)
    goNext()
  }

  const handleStaffSelect = (staff: Staff | null) => {
    setSelectedStaff(staff)
    setStaffSelected(true)
    setSelectedTime(null)
    goNext()
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
    goNext()
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    goNext()
  }

  const handleClientSubmit = async (data: { name: string; phone: string; email: string }) => {
    if (!company || !selectedService || !selectedDate || !selectedTime) return
    setBookingLoading(true)
    setError(null)
    try {
      const clientId = await findOrCreateClient(company.id, data.name, data.phone, data.email)
      await createPublicBooking(
        company.id, clientId, selectedService.id, selectedDate,
        selectedTime, selectedService.duration, selectedStaff?.id
      )
      setClientName(data.name)
      setStep('confirmation')
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'Ocorreu um erro ao confirmar o agendamento.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
           <p className="text-[#fbbf24] text-xs font-black uppercase tracking-[0.3em]">Carregando Experiência...</p>
        </div>
      </div>
    )
  }

  if (notFound || !company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-[2.5rem] bg-[#1C1B1B] border border-white/5 flex items-center justify-center mx-auto shadow-2xl">
            <AlertCircle className="w-12 h-12 text-zinc-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline text-white uppercase tracking-tighter">Link Expirado</h1>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">Não conseguimos localizar este estabelecimento. Verifique o link e tente novamente.</p>
          </div>
        </div>
      </div>
    )
  }

  const stepsWithoutConfirmation = activeSteps.filter((s) => s !== 'confirmation')

  return (
    <div className="min-h-screen bg-black text-[#E5E2E1] font-body selection:bg-[#fbbf24] selection:text-[#402D00]">
      {/* Premium Header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step !== 'service' && step !== 'confirmation' && (
              <button 
                onClick={goBack} 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col">
              <p className="font-black font-headline text-lg uppercase tracking-tight text-white leading-none">{company.name}</p>
              <p className="text-[9px] uppercase font-black tracking-widest text-[#fbbf24] mt-1">Sessão Exclusiva</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Localização</p>
              <p className="text-xs font-bold text-white max-w-[150px] truncate">{company.address || 'Brasil'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#fbbf24] flex items-center justify-center text-[#402D00] shadow-[0_0_20px_rgba(251,191,36,0.2)]">
               <Sparkles className="w-6 h-6 fill-[#402D00]" />
            </div>
          </div>
        </div>
      </header>

      {/* Modern Progress Bar */}
      {step !== 'confirmation' && (
        <div className="max-w-2xl mx-auto px-6 py-8">
           <div className="flex items-center gap-2">
             {stepsWithoutConfirmation.map((_, i) => (
                <div key={i} className="flex-1 h-1.5 relative rounded-full overflow-hidden bg-white/5">
                   <div className={cn(
                     "absolute inset-y-0 left-0 transition-all duration-700 ease-out",
                     i <= currentStepIndex ? "w-full bg-[#fbbf24]" : "w-0"
                   )} />
                </div>
             ))}
           </div>
           <div className="flex justify-between items-center mt-3">
             <span className="text-[10px] uppercase font-black tracking-widest text-[#fbbf24]">
               Passo {currentStepIndex + 1} de {stepsWithoutConfirmation.length}
             </span>
             <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">
               {step.replace('_', ' ')}
             </span>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={cn(
        "max-w-2xl mx-auto px-6 py-10 transition-all duration-500",
        step === 'confirmation' ? "py-16" : ""
      )}>
        {step === 'service' && (
          <ServiceSelector services={services} selectedId={selectedService?.id || null} onSelect={handleServiceSelect} />
        )}

        {step === 'staff' && (
          <StaffSelector staff={staffList} selectedId={staffSelected ? (selectedStaff?.id || null) : undefined as any} onSelect={handleStaffSelect} />
        )}

        {step === 'date' && (
          <DateSelector selectedDate={selectedDate} onSelect={handleDateSelect} />
        )}

        {step === 'time' && (
          <TimeSelector slots={availableSlots} selectedTime={selectedTime} loading={slotsLoading} isDayClosed={isDayClosed} onSelect={handleTimeSelect} />
        )}

        {step === 'client' && (
          <div className="space-y-10">
            {/* Quick Summary Sticky Head */}
            <div className="bg-[#1C1B1B] border border-[#fbbf24]/20 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between gap-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#fbbf24]/5 blur-2xl -mr-12 -mt-12"></div>
               <div className="flex gap-4 items-center relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                     <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Resumo da Escolha</p>
                    <p className="text-sm font-bold text-white uppercase">{selectedService?.name} <span className="text-[#fbbf24]/60 mx-1">•</span> {selectedStaff ? selectedStaff.name : 'Qualquer Profissional'}</p>
                  </div>
               </div>
               <button onClick={() => setStep('service')} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Alterar</button>
            </div>
            
            <ClientForm onSubmit={handleClientSubmit} loading={bookingLoading} error={error} />
          </div>
        )}

        {step === 'confirmation' && (
          <ConfirmationScreen
            companyName={company.name}
            companyAddress={company.address}
            serviceName={selectedService?.name || ''}
            date={selectedDate}
            startTime={selectedTime || ''}
            clientName={clientName}
            staffName={selectedStaff?.name}
          />
        )}
      </main>

      {/* Powered By Footer */}
      <footer className="max-w-2xl mx-auto px-6 py-10 text-center border-t border-white/[0.03]">
        <div className="flex items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all opacity-30 hover:opacity-100">
           <p className="text-[10px] uppercase font-black tracking-widest text-[#D3C5AC] mb-0">Powered by</p>
           <span className="font-headline font-black text-xs text-white tracking-tighter">AgendaAI</span>
        </div>
      </footer>
    </div>
  )
}
