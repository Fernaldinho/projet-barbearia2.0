import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface DateSelectorProps {
  selectedDate: string
  onSelect: (date: string) => void
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toDateStr(today)

  const [viewMonth, setViewMonth] = useState(
    selectedDate
      ? new Date(selectedDate + 'T12:00:00').getMonth()
      : today.getMonth()
  )
  const [viewYear, setViewYear] = useState(
    selectedDate
      ? new Date(selectedDate + 'T12:00:00').getFullYear()
      : today.getFullYear()
  )

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const days: { date: Date; dateStr: string; currentMonth: boolean }[] = []

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth, -i)
      days.push({ date: d, dateStr: toDateStr(d), currentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(viewYear, viewMonth, i)
      days.push({ date: d, dateStr: toDateStr(d), currentMonth: true })
    }

    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(viewYear, viewMonth + 1, i)
        days.push({ date: d, dateStr: toDateStr(d), currentMonth: false })
      }
    }

    return days
  }, [viewMonth, viewYear])

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          Qual o melhor <span className="text-[#fbbf24]">dia para você?</span>
        </h2>
        <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-xl">
          Selecione a data ideal na nossa agenda de alta performance.
        </p>
      </div>

      <div className="bg-[#1C1B1B] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/5 blur-3xl -mr-16 -mt-16"></div>

        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={goPrevMonth} 
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <p className="font-headline font-black text-xl text-white uppercase tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/[0.03]">
            {MONTH_LABELS[viewMonth]} {viewYear}
          </p>
          <button 
            onClick={goNextMonth} 
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(({ dateStr, currentMonth }, i) => {
            const isPast = dateStr < todayStr
            const isSelected = dateStr === selectedDate
            const isCurrentDay = dateStr === todayStr
            const disabled = isPast || !currentMonth

            return (
              <button
                key={i}
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[1.25rem] text-sm font-bold transition-all duration-300 relative",
                  disabled 
                    ? "opacity-10 cursor-not-allowed" 
                    : isSelected
                      ? "bg-[#fbbf24] text-[#402D00] shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-110 z-10"
                      : isCurrentDay
                        ? "bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 hover:bg-[#fbbf24]/20"
                        : "text-[#E5E2E1] hover:bg-white/10 hover:border-white/5 border border-transparent"
                )}
              >
                {new Date(dateStr + 'T12:00:00').getDate()}
                {isCurrentDay && !isSelected && (
                  <div className="absolute bottom-2 w-1 h-1 bg-[#fbbf24] rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
