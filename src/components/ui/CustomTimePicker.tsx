import React, { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown, Check } from 'lucide-react'

export interface CustomTimePickerProps {
  label?: string
  value: string // Format "HH:mm"
  onChange: (timeStr: string) => void
  disabled?: boolean
  className?: string
  align?: 'left' | 'right'
}

const PRESET_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:30',
  '14:00',
  '15:00',
  '16:30',
]

const WORKSHOP_HOURS = Array.from({ length: 14 }, (_, i) => String(i + 7).padStart(2, '0')) // 07 to 20
const WORKSHOP_MINUTES = ['00', '15', '30', '45']

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  value = '09:00',
  onChange,
  disabled = false,
  className = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentHour, currentMinute] = (value && value.includes(':') ? value : '09:00').split(':')

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectHour = (h: string) => {
    onChange(`${h}:${currentMinute || '00'}`)
  }

  const handleSelectMinute = (m: string) => {
    onChange(`${currentHour || '09'}:${m}`)
  }

  const handlePresetSelect = (preset: string) => {
    onChange(preset)
    setIsOpen(false)
  }

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
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150 cursor-pointer ${
          disabled
            ? 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
            : isOpen
            ? 'bg-[#141A29] border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.15)] text-slate-100'
            : 'bg-[#0E131F] border-slate-800 text-slate-200 hover:bg-[#121827] hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2 font-mono">
          <Clock size={15} className="text-sky-400 shrink-0" />
          <span className="text-sm font-bold text-slate-100">{value || '09:00'}</span>
        </div>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-sky-400' : ''
          }`}
        />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-50 bg-[#0F1422] border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3 w-60 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Presets rapides d'intervention */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Créneaux Chantiers :
            </span>
            <div className="grid grid-cols-4 gap-1">
              {PRESET_HOURS.map((preset) => {
                const isSelected = value === preset
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Réglage Heure & Minute :
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Heures */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 block text-center">Heure</span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {WORKSHOP_HOURS.map((h) => {
                    const isSelected = currentHour === h
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleSelectHour(h)}
                        className={`w-full py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300'
                        }`}
                      >
                        <span>{h}h</span>
                        {isSelected && <Check size={10} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Minutes */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 block text-center">Minute</span>
                <div className="space-y-1">
                  {WORKSHOP_MINUTES.map((m) => {
                    const isSelected = currentMinute === m
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMinute(m)}
                        className={`w-full py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300'
                        }`}
                      >
                        <span>:{m}</span>
                        {isSelected && <Check size={10} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  )
}
