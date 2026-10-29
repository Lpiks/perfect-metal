import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  format,
  addDays,
  endOfMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'

interface CustomDatePickerProps {
  label?: string
  value: string // YYYY-MM-DD
  onChange: (dateStr: string) => void
  minDate?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: string
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Sélectionner une date...',
  disabled = false,
  className = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Date actuelle affichée dans le calendrier
  const parsedValue = value ? new Date(value) : new Date()
  const [currentMonth, setCurrentMonth] = useState<Date>(parsedValue)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calcul des jours du mois
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Lundi
  const endDate = addDays(monthEnd, 6 - monthEnd.getDay() + (monthEnd.getDay() === 0 ? -6 : 1))
  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate })

  const handleSelectDate = (d: Date) => {
    const formatted = format(d, 'yyyy-MM-dd')
    onChange(formatted)
    setIsOpen(false)
  }

  const formattedDisplay = value
    ? format(new Date(value), 'dd MMMM yyyy', { locale: fr })
    : placeholder

  return (
    <div className={`relative flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-medium text-slate-300 tracking-wide flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150 cursor-pointer ${
          disabled
            ? 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
            : isOpen
            ? 'bg-[#141A29] border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.15)] text-slate-100'
            : error
            ? 'bg-[#101420] border-rose-500/70 text-slate-200 hover:border-rose-400'
            : 'bg-[#0E131F] border-slate-800 text-slate-200 hover:bg-[#121827] hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon size={16} className="text-sky-400 shrink-0" />
          <span className={`truncate font-medium ${!value ? 'text-slate-500' : 'text-slate-100'}`}>
            {formattedDisplay}
          </span>
        </div>

        {value && !disabled && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {/* Popover Calendar Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 bg-[#0F1422] border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 w-76 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-3">
          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-800 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleSelectDate(new Date())}
              className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => handleSelectDate(addDays(new Date(), 3))}
              className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            >
              +3 Jours
            </button>
            <button
              type="button"
              onClick={() => handleSelectDate(addDays(new Date(), 7))}
              className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            >
              +1 Semaine
            </button>
            <button
              type="button"
              onClick={() => handleSelectDate(endOfMonth(new Date()))}
              className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            >
              Fin du Mois
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-semibold text-slate-100 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>

            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 gap-1">
            {daysInGrid.map((d, index) => {
              const isSelected = value ? isSameDay(d, new Date(value)) : false
              const isCurrentDay = isToday(d)
              const isDifferentMonth = d.getMonth() !== currentMonth.getMonth()

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectDate(d)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-100 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white font-bold shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                      : isCurrentDay
                      ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/40'
                      : isDifferentMonth
                      ? 'text-slate-600 hover:bg-slate-800/40 hover:text-slate-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {format(d, 'd')}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </div>
  )
}
