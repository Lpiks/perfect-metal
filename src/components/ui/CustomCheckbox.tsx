import React from 'react'
import { Check } from 'lucide-react'

export interface CustomCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      onClick={(e) => {
        e.preventDefault()
        if (!disabled) onChange(!checked)
      }}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-xs transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-slate-200'
      } ${className}`}
    >
      <div
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0 ${
          checked
            ? 'bg-sky-500 border-sky-400 text-white shadow-sm shadow-sky-500/30'
            : 'bg-[#0E1322] border-slate-700 hover:border-slate-600 text-transparent'
        }`}
      >
        <Check size={12} strokeWidth={3} className={checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} />
      </div>

      {label && <span className="text-slate-300 font-medium">{label}</span>}
    </label>
  )
}
