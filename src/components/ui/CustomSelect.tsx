import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  subtitle?: string
  colorBadge?: string // Hex color swatch if RAL
  icon?: React.ReactNode
}

interface CustomSelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  className?: string
  error?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  searchable = false,
  disabled = false,
  className = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options

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
          {selectedOption?.colorBadge && (
            <span
              className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0 shadow-sm"
              style={{ backgroundColor: selectedOption.colorBadge }}
            />
          )}
          {selectedOption?.icon && <span className="text-slate-400 shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate font-medium ${!selectedOption ? 'text-slate-500' : 'text-slate-100'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-400' : ''}`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#0F1422] border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-72 flex flex-col">
          {searchable && (
            <div className="p-2 border-b border-slate-800 bg-[#0B0F19]">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto p-1 divide-y divide-slate-800/40">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500">Aucun résultat trouvé</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-sky-500/15 text-sky-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {opt.colorBadge && (
                        <span
                          className="w-4 h-4 rounded-md border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: opt.colorBadge }}
                        />
                      )}
                      {opt.icon && <span className="text-slate-400 group-hover:text-slate-200 shrink-0">{opt.icon}</span>}
                      <div className="flex flex-col truncate">
                        <span className="truncate">{opt.label}</span>
                        {opt.subtitle && <span className="text-[10px] text-slate-500 truncate">{opt.subtitle}</span>}
                      </div>
                    </div>

                    {isSelected && <Check size={14} className="text-sky-400 shrink-0 ml-2" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </div>
  )
}
