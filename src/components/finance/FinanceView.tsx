import React from 'react'
import { useERPStore } from '../../store/erpStore'
import { formatDZD } from '../../utils/currency'
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Building,
  Layers,
  ArrowUpRight,
} from 'lucide-react'

export const FinanceView: React.FC = () => {
  const { orders, clients } = useERPStore()

  // Calculs Financiers Globaux
  const totalBilled = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.totalTTC : 0), 0)
  const totalCollected = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.totalPaid : 0), 0)
  const totalOutstanding = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.balanceDue : 0), 0)

  // Surface totale transformée (m²)
  const totalSurfaceM2 = orders.reduce((sum, o) => {
    const orderSurface = o.items.reduce((s, it) => s + it.surfaceM2 * (it.quantity || 1), 0)
    return sum + orderSurface
  }, 0)

  // Marge Brute Globale Estimée (~28% à 32%)
  const estimatedGrossMargin = Math.round(totalBilled * 0.30)

  // Clients avec créances en cours (triés par montant décroissant)
  const debtorClients = clients
    .filter((c) => c.balanceDue > 0)
    .sort((a, b) => b.balanceDue - a.balanceDue)

  // Tous les paiements récents
  const allPayments = orders
    .flatMap((o) =>
      o.payments.map((p) => ({
        ...p,
        orderCode: o.code,
        clientName: o.clientName,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <TrendingUp className="text-sky-400" size={22} />
          Trésorerie, Créances & Rentabilité Financière
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Suivi des encaissements, solde des créances clients et marges brutes sur fabrication et thermolaquage.
        </p>
      </div>

      {/* Cartes KPI Financiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturé */}
        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Chiffre d'Affaires</span>
            <DollarSign size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-100">{formatDZD(totalBilled)}</div>
          <span className="text-[10px] text-slate-500 block">Sur {orders.length} commandes enregistrées</span>
        </div>

        {/* Trésorerie Encaissée */}
        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Trésorerie Encaissée</span>
            <CreditCard size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">{formatDZD(totalCollected)}</div>
          <span className="text-[10px] text-emerald-500/80 block font-medium">
            Taux de recouvrement : {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}%
          </span>
        </div>

        {/* Créances Dehors (Reste à payer) */}
        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Créances en Attente</span>
            <AlertCircle size={16} className="text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">{formatDZD(totalOutstanding)}</div>
          <span className="text-[10px] text-rose-400/80 block font-medium">
            À recouvrer sur {debtorClients.length} client(s)
          </span>
        </div>

        {/* Métal & Thermolaquage Produit */}
        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Volume Surface Traitée</span>
            <Layers size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {Math.round(totalSurfaceM2)} <span className="text-sm font-normal text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Marge brute estimée : ~{formatDZD(estimatedGrossMargin)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tableau des Créances Clients (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Building size={16} className="text-rose-400" />
                Détail des Créances & Impayés par Client
              </h3>
              <p className="text-[11px] text-slate-400">Soldes restant dus à récupérer après pose ou livraison</p>
            </div>
            <span className="font-mono text-xs font-bold text-rose-400">
              {formatDZD(totalOutstanding)}
            </span>
          </div>

          <div className="space-y-2.5">
            {debtorClients.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Félicitations ! Aucune créance en retard. Toutes les commandes sont soldées.
              </div>
            ) : (
              debtorClients.map((client) => {
                const percentPaid = client.totalBilled > 0 ? (client.totalPaid / client.totalBilled) * 100 : 0

                return (
                  <div
                    key={client.id}
                    className="p-3.5 rounded-xl bg-[#0E1322] border border-slate-800/80 hover:border-slate-700 space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-100 text-xs">{client.fullName}</div>
                        {client.companyName && (
                          <div className="text-[10px] text-slate-400">{client.companyName}</div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Tél : <span className="font-mono text-slate-400">{client.phone}</span> • {client.city}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-black text-sm text-rose-400 block">
                          {formatDZD(client.balanceDue)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Sur total de {formatDZD(client.totalBilled)}
                        </span>
                      </div>
                    </div>

                    {/* Jauge de Paiement */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentPaid}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Derniers Paiements Encaissés (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-400" />
              Journal des Derniers Règlements
            </h3>
            <p className="text-[11px] text-slate-400">Acomptes et règlements enregistrés en caisse ou banque</p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[460px] flex-1">
            {allPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">Aucun encaissement pour le moment.</div>
            ) : (
              allPayments.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0E1322] border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">{p.clientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.orderCode} • Mode : <strong className="capitalize text-slate-300">{p.method}</strong>
                    </span>
                    {p.receiptNumber && (
                      <span className="text-[10px] text-slate-500">Reçu : {p.receiptNumber}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-sm block">
                      + {formatDZD(p.amount)}
                    </span>
                    <span className="text-[10px] text-slate-500">{p.date.slice(0, 10)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
