import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { formatDZD } from '../../utils/currency'
import { ProductionStageBadge, PaymentStatusBadge } from '../ui/CustomBadge'
import { ShutterConfiguratorModal } from '../configurator/ShutterConfiguratorModal'
import {
  Wrench,
  FileText,
  Boxes,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  Clock,
} from 'lucide-react'

export const DashboardView: React.FC = () => {
  const { orders, inventory, setCurrentView } = useERPStore()
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false)

  // Statistiques
  const inProductionOrders = orders.filter(
    (o) => o.status === 'actif' && o.productionStage !== 'livre_pose' && o.documentType !== 'devis'
  )
  const pendingQuotations = orders.filter((o) => o.documentType === 'devis' && o.status === 'actif')
  const criticalStockItems = inventory.filter((i) => i.currentStock <= i.minimumStock)
  const totalCollected = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.totalPaid : 0), 0)
  const totalDue = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.balanceDue : 0), 0)

  return (
    <div className="space-y-4">
      {/* Sleek High-Density Industrial Ribbon */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1222] via-[#0E172B] to-[#121E38] border border-sky-500/25 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src="./logo.jpg"
            alt="PERFECT METAL"
            className="w-11 h-11 rounded-xl object-cover border border-sky-500/40 shadow-md shadow-sky-500/10 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-[9px] font-bold text-sky-400 uppercase tracking-widest shrink-0">
                ERP Atelier & Thermolaquage
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
              PERFECT METAL — Atelier de Production
            </h1>
            <p className="text-[11px] text-slate-300 truncate hidden md:block">
              Calepinage technique, chiffrage déterministe, découpe matière, cabine de peinture époxy et facturation 100% offline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfiguratorOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/25 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 whitespace-nowrap"
        >
          <Plus size={15} />
          <span>Nouveau Rideau (Chiffrage CPQ)</span>
        </button>

        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Cartes KPI Principales (Compactes & Aérées) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* En Production */}
        <div
          onClick={() => setCurrentView('kanban')}
          className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">Fabrication en Cours</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench size={14} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-100">{inProductionOrders.length}</div>
            <span className="text-[10px] text-sky-400 font-medium flex items-center gap-1 mt-0.5">
              <span>Voir le Kanban atelier</span>
              <ArrowRight size={10} />
            </span>
          </div>
        </div>

        {/* Devis en Attente */}
        <div
          onClick={() => setCurrentView('orders')}
          className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">Devis & Chiffrages</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={14} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-100">{pendingQuotations.length}</div>
            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1 mt-0.5">
              <span>Gérer les propositions</span>
              <ArrowRight size={10} />
            </span>
          </div>
        </div>

        {/* Trésorerie Encaissée */}
        <div
          onClick={() => setCurrentView('finance')}
          className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">Total Encaissé</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={14} />
            </div>
          </div>
          <div>
            <div className="text-xl font-black font-mono text-emerald-400">{formatDZD(totalCollected)}</div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Créances : <strong className="text-rose-400">{formatDZD(totalDue)}</strong>
            </span>
          </div>
        </div>

        {/* Alertes Stocks */}
        <div
          onClick={() => setCurrentView('inventory')}
          className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 hover:border-rose-500/40 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">Stocks & Matières</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                criticalStockItems.length > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Boxes size={14} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-100">
              {inventory.length}{' '}
              <span className="text-xs font-normal text-slate-400">articles</span>
            </div>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                criticalStockItems.length > 0 ? 'text-rose-400' : 'text-slate-500'
              }`}
            >
              {criticalStockItems.length > 0
                ? `${criticalStockItems.length} seuil(s) critique(s)`
                : 'Stocks optimaux'}
            </span>
          </div>
        </div>
      </div>

      {/* Section Chantiers Récents & Distribution (Visible sans scroll !) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Dernières Commandes Atelier (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B0F1A] border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock size={15} className="text-sky-400" />
                Derniers Chantiers & Rideaux en Cours
              </h3>
              <p className="text-[10px] text-slate-400">Commandes actives et avancement dans les étapes d'atelier</p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('orders')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {orders.slice(0, 4).map((order) => {
              const firstItem = order.items[0]

              return (
                <div
                  key={order.id}
                  className="p-2.5 sm:p-3 rounded-lg bg-[#0E1322] border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-sky-400">{order.code}</span>
                      <ProductionStageBadge stage={order.productionStage} size="sm" />
                      <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                    </div>
                    <div className="font-bold text-xs text-slate-100 truncate">{order.clientName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 truncate">
                      <span className="truncate">{order.siteAddress}</span>
                      {firstItem && (
                        <span className="font-mono text-slate-400 shrink-0">
                          • {firstItem.widthClearMm}×{firstItem.heightClearMm}mm ({firstItem.surfaceM2} m²)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-mono font-bold text-xs sm:text-sm text-slate-100">
                      {formatDZD(order.totalTTC)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Échéance : <span className="font-mono text-slate-400">{order.estimatedDeliveryDate}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Aperçu Cabine Thermolaquage & Poudrage (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0F1A] border border-slate-800/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <Flame size={15} className="text-amber-400" />
                Spécialité Thermolaquage RAL
              </h3>
              <p className="text-[10px] text-slate-400">Nuances les plus demandées à l'usine</p>
            </div>

            <div className="space-y-1.5">
              {[
                { code: 'RAL 7016', name: 'Gris Anthracite Sablé', hex: '#383E42', share: '45%' },
                { code: 'RAL 9005', name: 'Noir Profond Mat', hex: '#111214', share: '25%' },
                { code: 'RAL 9010', name: 'Blanc Pur Brillant', hex: '#F7F9FA', share: '15%' },
                { code: 'RAL 8014', name: 'Brun Sépia Façade', hex: '#49392C', share: '10%' },
              ].map((ral) => (
                <div
                  key={ral.code}
                  className="p-2 rounded-lg bg-[#0E1322] border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: ral.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 text-[11px] truncate">{ral.code}</div>
                      <div className="text-[9px] text-slate-500 truncate">{ral.name}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-400 shrink-0">{ral.share}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 text-xs text-sky-200">
            <span className="font-bold block text-[11px] mb-0.5">Qualité Cuisson 200°C :</span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Toutes les pièces sont polymérisées pendant 15 minutes pour une résistance anticorrosion certifiée.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Configurateur Rideau */}
      <ShutterConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        onSuccess={() => {
          setCurrentView('orders')
        }}
      />
    </div>
  )
}
