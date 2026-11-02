import React, { useState, useEffect } from 'react'

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const isNumberType = type === 'number'

  // Local string buffer to allow user to delete all characters to blank "" without getting stuck on "0"
  const [localStr, setLocalStr] = useState<string>(() => {
    if (value === undefined || value === null) return ''
    return String(value)
  })
  const [isFocused, setIsFocused] = useState(false)

  // Sync with prop value when updated externally
  useEffect(() => {
    if (!isNumberType) return

    if (!isFocused) {
      setLocalStr(value === undefined || value === null ? '' : String(value))
    } else {
      // If focused and user has emptied the field, and parent coerced "" to 0, preserve empty string!
      if (localStr === '' && (value === 0 || value === '0' || value === '')) {
        return
      }
      // If external value changed noticeably, sync it
      if (
        value !== undefined &&
        value !== null &&
        String(value) !== localStr &&
        Number(localStr) !== Number(value)
      ) {
        setLocalStr(String(value))
      }
    }
  }, [value, isFocused, isNumberType, localStr])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumberType) {
      const val = e.target.value
      setLocalStr(val)
      if (onChange) {
        onChange(e)
      }
    } else {
      if (onChange) onChange(e)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (isNumberType) {
      // Auto-select content if it's 0 so typing immediately replaces it
      if (e.target.value === '0') {
        e.target.select()
      }
    }
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (isNumberType) {
      if (localStr === '' || isNaN(Number(localStr))) {
        // Fallback to min or 0 if user blurs an empty field
        const fallback = props.min !== undefined ? String(props.min) : '0'
        setLocalStr(fallback)
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: fallback },
            currentTarget: { ...e.currentTarget, value: fallback },
          } as unknown as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      } else {
        // Strip leading zeros if user typed "0500" -> "500"
        const num = Number(localStr)
        if (!isNaN(num) && !localStr.includes('.') && localStr.startsWith('0') && localStr.length > 1) {
          const cleaned = String(num)
          setLocalStr(cleaned)
          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: { ...e.target, value: cleaned },
              currentTarget: { ...e.currentTarget, value: cleaned },
            } as unknown as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
          }
        }
      }
    }
    if (onBlur) onBlur(e)
  }

  const displayValue = isNumberType
    ? isFocused
      ? localStr
      : value === undefined || value === null
      ? ''
      : String(value)
    : value

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
          type={type}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
