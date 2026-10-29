import React from 'react'
import { SlatType, FinishType } from '../../types/shutter'

interface ShutterPreview2DProps {
  widthMm: number
  heightMm: number
  slatType: SlatType
  finishType: FinishType
  ralHex?: string
  ralCode?: string
  motorType: string
  hasLock?: boolean
  hasBox?: boolean
  className?: string
}

export const ShutterPreview2D: React.FC<ShutterPreview2DProps> = ({
  widthMm,
  heightMm,
  slatType,
  finishType,
  ralHex = '#383E42',
  ralCode = 'RAL 7016',
  motorType,
  hasLock = true,
  hasBox = true,
  className = '',
}) => {
  // Ratio de mise à l'échelle pour affichage SVG
  const maxW = 400
  const maxH = 340
  const aspectRatio = widthMm / (heightMm || 1)
  
  let svgW = maxW
  let svgH = maxW / aspectRatio
  if (svgH > maxH) {
    svgH = maxH
    svgW = maxH * aspectRatio
  }

  // Couleur du tablier
  const shutterColor = finishType === 'thermolaquage_ral' ? (ralHex || '#383E42') : '#94A3B8'
  const isGalva = finishType === 'brut_galva'

  // Nombre de lames représentées graphiquement
  const displayedSlatCount = Math.min(18, Math.max(10, Math.round(svgH / 16)))
  const slatHeight = (svgH - 40) / displayedSlatCount

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-[#0A0D15] rounded-2xl border border-slate-800/80 ${className}`}>
      {/* En-tête avec indicateur RAL */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: shutterColor }}
          />
          <span className="font-semibold text-slate-200">
            {finishType === 'thermolaquage_ral' ? `${ralCode} (Thermolaquage)` : 'Acier Galvanisé Brut'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {widthMm} mm × {heightMm} mm
        </span>
      </div>

      {/* Rendu SVG dynamique */}
      <div className="relative flex items-center justify-center w-full min-h-[300px] p-2 bg-[#06080D] rounded-xl border border-slate-900 overflow-hidden shadow-inner">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="drop-shadow-2xl transition-all duration-300"
        >
          <defs>
            {/* Dégradé métallique galva */}
            <linearGradient id="galvaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Dégradé thermolaquage laqué */}
            <linearGradient id="ralGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            {/* Motif micro-perforé */}
            <pattern id="microPerf" width="6" height="4" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="2" r="0.8" fill="#000000" opacity="0.45" />
            </pattern>
          </defs>

          {/* 1. Coffre d'enroulement supérieur */}
          <rect
            x="8"
            y="4"
            width={svgW - 16}
            height="32"
            rx="3"
            fill={isGalva ? 'url(#galvaGrad)' : shutterColor}
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Reflet coffre */}
          <rect x="10" y="6" width={svgW - 20} height="8" fill="#FFFFFF" opacity="0.15" rx="1" />
          <text
            x={svgW / 2}
            y="24"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="1"
            opacity="0.85"
          >
            PERFECT METAL {hasBox ? '— COFFRE' : '— AXE Ø'}
          </text>

          {/* 2. Coulisses latérales (Guides gauche et droite) */}
          {/* Coulisse Gauche */}
          <rect
            x="8"
            y="36"
            width="14"
            height={svgH - 44}
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1"
          />
          <line x1="15" y1="36" x2="15" y2={svgH - 8} stroke="#475569" strokeWidth="1" />

          {/* Coulisse Droite */}
          <rect
            x={svgW - 22}
            y="36"
            width="14"
            height={svgH - 44}
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1"
          />
          <line x1={svgW - 15} y1="36" x2={svgW - 15} y2={svgH - 8} stroke="#475569" strokeWidth="1" />

          {/* 3. Tablier articulé (Lames) */}
          <g>
            {Array.from({ length: displayedSlatCount }).map((_, i) => {
              const y = 36 + i * slatHeight
              return (
                <g key={i}>
                  {/* Corps de la lame */}
                  <rect
                    x="20"
                    y={y}
                    width={svgW - 40}
                    height={slatHeight - 1}
                    fill={isGalva ? 'url(#galvaGrad)' : shutterColor}
                    stroke="#0F172A"
                    strokeWidth="0.75"
                    rx="1"
                  />

                  {/* Reflet volumétrique de la lame */}
                  <rect
                    x="20"
                    y={y}
                    width={svgW - 40}
                    height={slatHeight - 1}
                    fill="url(#ralGrad)"
                  />

                  {/* Rendu spécifique selon le type de lame */}
                  {slatType === 'lame_microperforee' && (
                    <rect
                      x="24"
                      y={y + 1}
                      width={svgW - 48}
                      height={slatHeight - 3}
                      fill="url(#microPerf)"
                    />
                  )}

                  {slatType === 'lame_cobra' && (
                    <path
                      d={`M 24 ${y + slatHeight / 2} Q ${svgW / 4} ${y + 1}, ${svgW / 2} ${y + slatHeight / 2} T ${svgW - 24} ${y + slatHeight / 2}`}
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  {/* Ligne d'emboîtement / agrafe entre lames */}
                  <line
                    x1="20"
                    y1={y + slatHeight - 1}
                    x2={svgW - 20}
                    y2={y + slatHeight - 1}
                    stroke="#000000"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                </g>
              )
            })}
          </g>

          {/* 4. Lame finale renforcée (bas de rideau) */}
          <rect
            x="18"
            y={svgH - 14}
            width={svgW - 36}
            height="8"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="0.8"
            rx="1"
          />
          {hasLock && (
            <circle cx={svgW / 2} cy={svgH - 10} r="2.2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
          )}

          {/* 5. Motorisation icon / badge */}
          {motorType !== 'manuel' && (
            <g transform={`translate(${svgW / 2 - 18}, 10)`}>
              <rect width="36" height="12" rx="3" fill="#0284C7" opacity="0.9" />
              <text x="18" y="9" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                MOTEUR
              </text>
            </g>
          )}
        </svg>

        {/* Lignes de cotes techniques (Overlays) */}
        <div className="absolute bottom-1 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 border border-slate-800">
          Lame: {slatType.replace('lame_', '').replace('_', ' ')}
        </div>
      </div>
    </div>
  )
}
