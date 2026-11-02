import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { ProductionStage, Order } from '../../types/order'
import { PaymentStatusBadge } from '../ui/CustomBadge'
import { formatDZD } from '../../utils/currency'
import { WorkshopCuttingSheet } from './WorkshopCuttingSheet'
import { FileText, ArrowRight, CheckCircle2, Clock, Wrench } from 'lucide-react'

const KANBAN_STAGES: { id: ProductionStage; title: string; subtitle: string; icon: string }[] = [
  { id: 'decoupe_profilage', title: '1. Découpe & Débit', subtitle: 'Lames, coulisses & axe', icon: '✂️' },
  { id: 'peinture_four', title: '2. Cabine & Four', subtitle: 'Poudrage RAL & 200°C', icon: '🔥' },
  { id: 'assemblage_mecanique', title: '3. Montage & Axe', subtitle: 'Agrafage & ressorts', icon: '⚙️' },
  { id: 'controle_qualite', title: '4. Test Moteur / CQ', subtitle: 'Fin de course & radio', icon: '🎯' },
  { id: 'pret_expedition', title: '5. Prêt Atelier', subtitle: 'Prêt pour enlèvement', icon: '📦' },
  { id: 'livre_pose', title: '6. Livré & Posé', subtitle: 'Chantier terminé', icon: '✅' },
]

export const ProductionKanban: React.FC = () => {
  const { orders, advanceProductionStage } = useERPStore()
  const [selectedOrderForSheet, setSelectedOrderForSheet] = useState<Order | null>(null)

  // Filtrer les commandes qui sont passées en production (exclure les devis purs non validés)
  const productionOrders = orders.filter((o) => o.documentType !== 'devis' && o.status === 'actif')

  const getNextStage = (current: ProductionStage): ProductionStage | null => {
    const sequence: ProductionStage[] = [
      'attente_validation',
      'decoupe_profilage',
      'peinture_four',
      'assemblage_mecanique',
      'controle_qualite',
      'pret_expedition',
      'livre_pose',
    ]
    const idx = sequence.indexOf(current)
    if (idx !== -1 && idx < sequence.length - 1) {
      return sequence[idx + 1]
    }
    return null
  }

  if (selectedOrderForSheet) {
    return (
      <WorkshopCuttingSheet
        order={selectedOrderForSheet}
        onBack={() => setSelectedOrderForSheet(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* En-tête Kanban */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="text-sky-400 shrink-0" size={20} />
            Suivi de Fabrication & Ordres de Travail Atelier
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Visualisez et pilotez en temps réel le débit, le thermolaquage au four et les tests moteurs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0E1322] px-3 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0 self-start sm:self-auto">
          <Clock size={13} className="text-sky-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">
            En atelier : <strong className="text-sky-400 font-bold">{productionOrders.length}</strong> rideaux
          </span>
        </div>
      </div>

      {/* Piste Kanban Déroulante avec Colonnes à Largeur Protégée */}
      <div className="flex gap-3.5 items-start overflow-x-auto pb-4 pt-1">
        {KANBAN_STAGES.map((col) => {
          const columnOrders = productionOrders.filter((o) => o.productionStage === col.id)

          return (
            <div
              key={col.id}
              className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2.5 w-[285px] min-w-[285px] shrink-0 shadow-lg"
            >
              {/* Entête de Colonne */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate">
                    <span className="shrink-0">{col.icon}</span>
                    <span className="truncate">{col.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate">{col.subtitle}</span>
                </div>

                <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300 flex items-center justify-center shrink-0">
                  {columnOrders.length}
                </span>
              </div>

              {/* Liste des Cartes Commandes */}
              <div className="space-y-2.5 min-h-[440px]">
                {columnOrders.length === 0 ? (
                  <div className="h-36 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-center text-slate-600 text-xs px-3">
                    Aucune commande à cette étape
                  </div>
                ) : (
                  columnOrders.map((order) => {
                    const firstItem = order.items[0]
                    const nextStage = getNextStage(order.productionStage)

                    return (
                      <div
                        key={order.id}
                        className="bg-[#121828] border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-md flex flex-col gap-2.5 transition-all group"
                      >
                        {/* Haut de la carte : Code + Date sans wrapping */}
                        <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                          <span className="font-mono font-bold text-xs text-sky-400 shrink-0">
                            {order.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            Livraison : {order.estimatedDeliveryDate.slice(5)}
                          </span>
                        </div>

                        {/* Client & Chantier */}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-100 truncate">
                            {order.clientName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {order.siteAddress}
                          </div>
                        </div>

                        {/* Spécifications du Rideau */}
                        {firstItem && (
                          <div className="p-2 rounded-lg bg-[#0A0D16] border border-slate-800/70 text-[11px] space-y-1">
                            <div className="flex items-center justify-between font-mono text-slate-300 whitespace-nowrap gap-2 text-[11px]">
                              <span className="truncate">
                                {firstItem.widthClearMm}×{firstItem.heightClearMm} mm
                              </span>
                              <span className="text-sky-300 font-semibold shrink-0">
                                {firstItem.surfaceM2} m²
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] whitespace-nowrap gap-2">
                              <span className="text-slate-400 truncate capitalize">
                                {firstItem.slatType.replace('lame_', '').replace(/_/g, ' ')}
                              </span>
                              {firstItem.finishType === 'thermolaquage_ral' ? (
                                <span className="flex items-center gap-1 font-bold text-amber-400 shrink-0">
                                  <span
                                    className="w-2 h-2 rounded-full border border-white/20 shrink-0"
                                    style={{ backgroundColor: firstItem.ralHex || '#383E42' }}
                                  />
                                  <span>{firstItem.ralCode}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 font-mono shrink-0">Galva</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Montant & État Paiement sur 1 ligne garantie */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60 whitespace-nowrap gap-2">
                          <span className="font-mono font-bold text-slate-200 shrink-0">
                            {formatDZD(order.totalTTC)}
                          </span>
                          <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                        </div>

                        {/* Boutons d'Action Rapide */}
                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForSheet(order)}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                          >
                            <FileText size={12} className="text-sky-400 shrink-0" />
                            <span>Fiche Débit</span>
                          </button>

                          {nextStage ? (
                            <button
                              type="button"
                              onClick={() => advanceProductionStage(order.id, nextStage)}
                              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg text-[11px] font-semibold cursor-pointer transition-all whitespace-nowrap"
                            >
                              <span>Avancer</span>
                              <ArrowRight size={12} className="shrink-0" />
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-1 py-1.5 px-2 text-emerald-400 text-[11px] font-semibold whitespace-nowrap">
                              <CheckCircle2 size={12} className="shrink-0" />
                              <span>Terminé</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
