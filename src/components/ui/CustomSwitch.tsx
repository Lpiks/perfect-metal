import React from 'react'

export interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm'

  return (
    <label
      onClick={(e) => {
        e.preventDefault()
        if (!disabled) onChange(!checked)
      }}
      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-slate-800 bg-[#0A0D16]'
          : checked
          ? 'border-sky-500/50 bg-sky-500/10 text-slate-100 shadow-sm shadow-sky-500/10'
          : 'border-slate-800 bg-[#0E131F] text-slate-400 hover:border-slate-700 hover:text-slate-300'
      } ${className}`}
    >
      <div className="flex flex-col min-w-0">
        {label && (
          <span className={`font-semibold truncate ${isSm ? 'text-xs' : 'text-xs'}`}>
            {label}
          </span>
        )}
        {description && (
          <span className="text-[10px] text-slate-500 truncate mt-0.5">
            {description}
          </span>
        )}
      </div>

      {/* Pill Toggle Switch */}
      <div
        className={`relative rounded-full transition-colors shrink-0 ${
          isSm ? 'w-8 h-4.5' : 'w-10 h-5.5'
        } ${checked ? 'bg-sky-500' : 'bg-slate-800 border border-slate-700'}`}
      >
        <span
          className={`absolute top-0.5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
            isSm ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
          } ${checked ? (isSm ? 'left-4' : 'left-5') : 'left-0.5'}`}
        />
      </div>
    </label>
  )
}
