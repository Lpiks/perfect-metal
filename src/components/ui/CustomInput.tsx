import React from 'react'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  suffix?: string // ex: "mm", "kg", "DZD", "m²"
  prefixIcon?: React.ReactNode
  error?: string
  helpText?: string
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  suffix,
  prefixIcon,
  error,
  helpText,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-300 tracking-wide flex items-center justify-between">
          <span>{label}</span>
          {helpText && <span className="text-[10px] text-slate-500 font-normal">{helpText}</span>}
        </label>
      )}

      <div
        className={`relative flex items-center rounded-xl border transition-all duration-150 ${
          disabled
            ? 'bg-slate-900/40 border-slate-800/60 text-slate-600'
            : error
            ? 'bg-[#101420] border-rose-500/70 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20'
            : 'bg-[#0E131F] border-slate-800 hover:border-slate-700 focus-within:bg-[#141A29] focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20'
        }`}
      >
        {prefixIcon && <span className="pl-3.5 text-slate-400 shrink-0">{prefixIcon}</span>}

        <input
          disabled={disabled}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:cursor-not-allowed ${
            prefixIcon ? 'pl-2' : ''
          } ${suffix ? 'pr-2' : ''}`}
          {...props}
        />

        {suffix && (
          <span className="pr-3.5 text-xs font-semibold text-slate-400 select-none shrink-0 uppercase tracking-wider">
            {suffix}
          </span>
        )}
      </div>

      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </div>
  )
}
