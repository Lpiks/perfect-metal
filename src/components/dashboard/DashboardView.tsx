import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { formatDZD } from '../../utils/currency'
import { ProductionStageBadge, PaymentStatusBadge } from '../ui/CustomBadge'
import { ShutterConfiguratorModal } from '../configurator/ShutterConfiguratorModal'
import {
  Wrench,
  FileText,
  Boxes,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export const DashboardView: React.FC = () => {
  const { orders, clients, inventory, setCurrentView } = useERPStore()
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
    <div className="space-y-6">
      {/* Bannière de Bienvenue "PERFECT METAL" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1222] via-[#0E172B] to-[#121E38] border border-sky-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src="./logo.jpg"
              alt="PERFECT METAL"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sky-500/40 shadow-xl shadow-sky-500/10 shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                ERP Atelier & Thermolaquage
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                PERFECT METAL — Atelier de Production
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Calepinage technique, chiffrage déterministe, découpe matière, cabine de peinture époxy et facturation 100% offline.
              </p>
            </div>
          </div>

          {/* Bouton Action Principale */}
          <button
            type="button"
            onClick={() => setIsConfiguratorOpen(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-sky-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus size={18} />
            <span>Nouveau Rideau (Chiffrage CPQ)</span>
          </button>
        </div>

        {/* Halo décoratif en arrière-plan */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* En Production */}
        <div
          onClick={() => setCurrentView('kanban')}
          className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Fabrication en Cours</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-slate-100">{inProductionOrders.length}</div>
            <span className="text-[11px] text-sky-400 font-medium flex items-center gap-1 mt-1">
              <span>Voir le Kanban atelier</span>
              <ArrowRight size={11} />
            </span>
          </div>
        </div>

        {/* Devis en Attente */}
        <div
          onClick={() => setCurrentView('orders')}
          className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Devis & Chiffrages</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-slate-100">{pendingQuotations.length}</div>
            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1">
              <span>Gérer les propositions</span>
              <ArrowRight size={11} />
            </span>
          </div>
        </div>

        {/* Trésorerie Encaissée */}
        <div
          onClick={() => setCurrentView('finance')}
          className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Encaissé</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">{formatDZD(totalCollected)}</div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Créances à récupérer : <strong className="text-rose-400">{formatDZD(totalDue)}</strong>
            </span>
          </div>
        </div>

        {/* Alertes Stocks */}
        <div
          onClick={() => setCurrentView('inventory')}
          className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800/80 hover:border-rose-500/40 cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Stocks & Matières</span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                criticalStockItems.length > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Boxes size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-slate-100">
              {inventory.length}{' '}
              <span className="text-xs font-normal text-slate-400">articles</span>
            </div>
            <span
              className={`text-[11px] font-medium block mt-1 ${
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

      {/* Section Chantiers Récents & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dernières Commandes Atelier (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock size={16} className="text-sky-400" />
                Derniers Chantiers & Rideaux en Cours
              </h3>
              <p className="text-[11px] text-slate-400">Commandes actives et avancement dans les étapes d'atelier</p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('orders')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const firstItem = order.items[0]

              return (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl bg-[#0E1322] border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-400">{order.code}</span>
                      <ProductionStageBadge stage={order.productionStage} size="sm" />
                      <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                    </div>
                    <div className="font-bold text-xs text-slate-100">{order.clientName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{order.siteAddress}</span>
                      {firstItem && (
                        <span className="font-mono text-slate-500">
                          • {firstItem.widthClearMm}×{firstItem.heightClearMm}mm ({firstItem.surfaceM2} m²)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-mono font-bold text-sm text-slate-100">
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
        <div className="lg:col-span-4 bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                Spécialité Thermolaquage RAL
              </h3>
              <p className="text-[11px] text-slate-400">Nuances les plus demandées à l'usine</p>
            </div>

            <div className="space-y-2.5">
              {[
                { code: 'RAL 7016', name: 'Gris Anthracite Sablé', hex: '#383E42', share: '45%' },
                { code: 'RAL 9005', name: 'Noir Profond Mat', hex: '#111214', share: '25%' },
                { code: 'RAL 9010', name: 'Blanc Pur Brillant', hex: '#F7F9FA', share: '15%' },
                { code: 'RAL 8014', name: 'Brun Sépia Façade', hex: '#49392C', share: '10%' },
              ].map((ral) => (
                <div
                  key={ral.code}
                  className="p-2.5 rounded-xl bg-[#0E1322] border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-md border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: ral.hex }}
                    />
                    <div>
                      <div className="font-bold text-slate-200">{ral.code}</div>
                      <div className="text-[10px] text-slate-500">{ral.name}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-400">{ral.share}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 text-xs text-sky-200">
            <span className="font-bold block mb-1">Qualité Cuisson 200°C :</span>
            <p className="text-[11px] text-slate-400">
              Toutes les pièces en sortie de cabine sont polymérisées pendant 15 minutes pour une résistance anticorrosion maximale.
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
