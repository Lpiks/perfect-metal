import React, { useState, useEffect } from 'react'

declare global {
  interface Window {
    electronAPI?: {
      getInfo: () => Promise<{ appName: string; version: string; userDataPath: string }>
      printDocument: () => Promise<void>
      saveBackup: (data: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
      minimizeWindow: () => Promise<void>
      maximizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      isWindowMaximized: () => Promise<boolean>
      onMaximizedChange: (callback: (isMax: boolean) => void) => () => void
    }
  }
}

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false)
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI?.minimizeWindow

  useEffect(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.isWindowMaximized().then((max) => setIsMaximized(max))
      const cleanup = window.electronAPI.onMaximizedChange((max) => {
        setIsMaximized(max)
      })
      return () => {
        if (cleanup) cleanup()
      }
    }
  }, [isElectron])

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow?.()
  }

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow?.()
  }

  const handleClose = () => {
    window.electronAPI?.closeWindow?.()
  }

  return (
    <div
      style={{ WebkitAppRegion: 'drag' } as any}
      className="h-8 min-h-[32px] w-full bg-[#06080E] border-b border-slate-800/80 flex items-center justify-between select-none z-50 no-print"
      onDoubleClick={handleMaximize}
    >
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-2.5 px-3 min-w-0">
        <img
          src="./logo.jpg"
          alt="PERFECT METAL"
          className="w-4 h-4 rounded object-contain border border-sky-500/30 shrink-0"
        />
        <span className="text-[11px] font-semibold tracking-wide text-slate-300 truncate">
          PERFECT METAL — ERP Rideaux & Thermolaquage
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.2 Studio</span>
        </span>
      </div>

      {/* Center: Draggable Spacer */}
      <div className="flex-1 h-full" />

      {/* Right: Custom Native-like Window Controls */}
      {isElectron ? (
        <div
          style={{ WebkitAppRegion: 'no-drag' } as any}
          className="flex items-center h-full shrink-0"
        >
          {/* Minimize */}
          <button
            type="button"
            onClick={handleMinimize}
            title="Réduire"
            className="w-11 h-8 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
              <rect width="10" height="1" />
            </svg>
          </button>

          {/* Maximize / Restore */}
          <button
            type="button"
            onClick={handleMaximize}
            title={isMaximized ? 'Restaurer' : 'Agrandir'}
            className="w-11 h-8 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            {isMaximized ? (
              // Restore icon (two overlapping boxes)
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2.5" y="0.5" width="7" height="7" rx="0.5" />
                <path d="M0.5 2.5V9.5H7.5V7" />
              </svg>
            ) : (
              // Maximize icon (single box)
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="0.5" y="0.5" width="8" height="8" rx="0.5" />
              </svg>
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            title="Fermer"
            className="w-11 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 1L9 9M9 1L1 9" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-3">
          <span className="text-[10px] text-slate-500 font-mono">Web Preview</span>
        </div>
      )}
    </div>
  )
}
