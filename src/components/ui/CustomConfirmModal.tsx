import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, CheckCircle2, Info, X } from 'lucide-react'

export interface CustomConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  isAlertOnly?: boolean
}

export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning',
  isAlertOnly = false,
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter' && !isAlertOnly && onConfirm) {
        onConfirm()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm, isAlertOnly])

  if (!isOpen) return null

  const variantConfig = {
    danger: {
      icon: <Trash2 size={24} className="text-rose-400" />,
      iconBg: 'bg-rose-500/15 border-rose-500/30',
      confirmBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30',
    },
    warning: {
      icon: <AlertTriangle size={24} className="text-amber-400" />,
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30',
    },
    info: {
      icon: <Info size={24} className="text-sky-400" />,
      iconBg: 'bg-sky-500/15 border-sky-500/30',
      confirmBtn: 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30',
    },
    success: {
      icon: <CheckCircle2 size={24} className="text-emerald-400" />,
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      confirmBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
    },
  }[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-[#0E1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-5">
        {/* Header avec icône thématique */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${variantConfig.iconBg}`}
          >
            {variantConfig.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-100 tracking-tight leading-snug">
              {title}
            </h3>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
              {message}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Boutons d'Action */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80">
          {!isAlertOnly && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm()
              onClose()
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              variantConfig.confirmBtn
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
