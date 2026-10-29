import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { Order, DocumentType, PaymentMethod } from '../../types/order'
import { DocumentTypeBadge, PaymentStatusBadge, ProductionStageBadge } from '../ui/CustomBadge'
import { formatDZD } from '../../utils/currency'
import { InvoiceDocument } from '../documents/InvoiceDocument'
import { WorkshopCuttingSheet } from '../production/WorkshopCuttingSheet'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import {
  FileText,
  Printer,
  Wrench,
  DollarSign,
  Search,
  Plus,
  ArrowRight,
  Trash2,
  Filter,
} from 'lucide-react'

export const OrdersView: React.FC = () => {
  const { orders, deleteOrder, recordPayment, convertDocumentType } = useERPStore()

  // Filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [docFilter, setDocFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

  // Modals de visualisation
  const [viewingOrderForDoc, setViewingOrderForDoc] = useState<Order | null>(null)
  const [viewingOrderForSheet, setViewingOrderForSheet] = useState<Order | null>(null)

  // Modal Enregistrement Règlement
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('especes')
  const [paymentRef, setPaymentRef] = useState('')
  const [paymentReceipt, setPaymentReceipt] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  // Filtrage des commandes
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.siteAddress.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDoc = docFilter === 'all' || o.documentType === docFilter
    const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter

    return matchesSearch && matchesDoc && matchesPayment
  })

  const handleOpenPayment = (order: Order) => {
    setPaymentModalOrder(order)
    setPaymentAmount(order.balanceDue)
    setPaymentReceipt(`REC-${Math.floor(1000 + Math.random() * 9000)}`)
    setPaymentRef('')
    setPaymentNotes('')
  }

  const handleSavePayment = () => {
    if (!paymentModalOrder || paymentAmount <= 0) return

    recordPayment(paymentModalOrder.id, {
      date: new Date().toISOString(),
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentRef,
      receiptNumber: paymentReceipt,
      notes: paymentNotes,
    })

    setPaymentModalOrder(null)
  }

  if (viewingOrderForDoc) {
    return (
      <InvoiceDocument
        order={viewingOrderForDoc}
        onBack={() => setViewingOrderForDoc(null)}
      />
    )
  }

  if (viewingOrderForSheet) {
    return (
      <WorkshopCuttingSheet
        order={viewingOrderForSheet}
        onBack={() => setViewingOrderForSheet(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <FileText className="text-sky-400" size={22} />
            Commandes, Devis & Facturation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez le cycle commercial complet : Devis ➔ Bon de Commande ➔ Fabrication ➔ Facturation.
          </p>
        </div>
      </div>

      {/* Barre de Recherche & Filtres Rapides */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F1A] p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par n° de pièce, client, chantier..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Filtre Type Document */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'devis', label: 'Devis' },
            { id: 'commande', label: 'Commandes' },
            { id: 'facture', label: 'Factures' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDocFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                docFilter === f.id
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtre Paiement */}
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tous Règlements' },
            { id: 'non_paye', label: 'Impayés' },
            { id: 'solde_regle', label: 'Soldés' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPaymentFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                paymentFilter === f.id
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0E1424] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-left">N° Document</th>
                <th className="p-3.5 text-left">Client & Destination</th>
                <th className="p-3.5 text-center">Spécifications Rideau</th>
                <th className="p-3.5 text-center">Atelier</th>
                <th className="p-3.5 text-right font-mono">Montant TTC</th>
                <th className="p-3.5 text-center">Paiement</th>
                <th className="p-3.5 text-right font-mono">Reste Dû</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Aucun document ne correspond à vos filtres.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const firstItem = order.items[0]

                  return (
                    <tr key={order.id} className="hover:bg-[#0E1322]/80 transition-colors">
                      {/* Code & Type */}
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-100 flex items-center gap-2">
                          <span className="text-sky-400">{order.code}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <DocumentTypeBadge type={order.documentType} />
                          <span className="text-[10px] text-slate-500">{order.createdAt.slice(0, 10)}</span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-100">{order.clientName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {order.siteAddress}
                        </div>
                        <div className="text-[10px] text-slate-500">{order.clientPhone}</div>
                      </td>

                      {/* Rideau Info */}
                      <td className="p-3.5 text-center">
                        {firstItem ? (
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-slate-200">
                              {firstItem.widthClearMm} × {firstItem.heightClearMm} mm
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {firstItem.surfaceM2} m² • {firstItem.curtainWeightKg} kg
                            </span>
                            {firstItem.finishType === 'thermolaquage_ral' && (
                              <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: firstItem.ralHex || '#383E42' }}
                                />
                                {firstItem.ralCode}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Étape Atelier */}
                      <td className="p-3.5 text-center">
                        <ProductionStageBadge stage={order.productionStage} size="sm" />
                      </td>

                      {/* Montant TTC */}
                      <td className="p-3.5 text-right font-mono font-bold text-slate-100">
                        {formatDZD(order.totalTTC)}
                      </td>

                      {/* Statut Paiement */}
                      <td className="p-3.5 text-center">
                        <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                      </td>

                      {/* Reste Dû */}
                      <td className="p-3.5 text-right font-mono font-bold">
                        <span className={order.balanceDue > 0 ? 'text-rose-400' : 'text-slate-500'}>
                          {formatDZD(order.balanceDue)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Voir Doc */}
                          <button
                            type="button"
                            onClick={() => setViewingOrderForDoc(order)}
                            title="Afficher & Imprimer le document commercial"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 cursor-pointer transition-colors"
                          >
                            <Printer size={14} />
                          </button>

                          {/* Fiche Débit */}
                          <button
                            type="button"
                            onClick={() => setViewingOrderForSheet(order)}
                            title="Afficher la fiche de débit atelier"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            <Wrench size={14} />
                          </button>

                          {/* Encaisser Acompte / Solde */}
                          {order.balanceDue > 0 && (
                            <button
                              type="button"
                              onClick={() => handleOpenPayment(order)}
                              title="Enregistrer un versement"
                              className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 cursor-pointer transition-colors"
                            >
                              <DollarSign size={14} />
                            </button>
                          )}

                          {/* Conversion Devis -> Commande */}
                          {order.documentType === 'devis' && (
                            <button
                              type="button"
                              onClick={() => convertDocumentType(order.id, 'commande')}
                              title="Valider en Bon de Commande Atelier"
                              className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold rounded-lg border border-sky-500/40 cursor-pointer transition-colors"
                            >
                              Valider Commande
                            </button>
                          )}

                          {/* Conversion Commande -> Facture */}
                          {order.documentType === 'commande' && (
                            <button
                              type="button"
                              onClick={() => convertDocumentType(order.id, 'facture')}
                              title="Émettre la Facture définitive"
                              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/40 cursor-pointer transition-colors"
                            >
                              Facturer
                            </button>
                          )}

                          {/* Supprimer */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Confirmez-vous la suppression de ${order.code} ?`)) {
                                deleteOrder(order.id)
                              }
                            }}
                            title="Supprimer"
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ENREGISTREMENT RÈGLEMENT */}
      {paymentModalOrder && (
        <CustomModal
          isOpen={true}
          onClose={() => setPaymentModalOrder(null)}
          title={`Encaisser un Paiement — ${paymentModalOrder.code}`}
          subtitle={`Client : ${paymentModalOrder.clientName} • Reste à payer : ${formatDZD(paymentModalOrder.balanceDue)}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setPaymentModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirmer l'Encaissement
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomInput
              label="Montant Encaissé (DZD) *"
              type="number"
              suffix="DZD"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />

            <CustomSelect
              label="Mode de Règlement *"
              value={paymentMethod}
              onChange={(v) => setPaymentMethod(v as PaymentMethod)}
              options={[
                { value: 'especes', label: 'Espèces (Caisse Atelier)' },
                { value: 'cheque', label: 'Chèque Bancaire' },
                { value: 'virement', label: 'Virement Bancaire (BNA/BEA)' },
                { value: 'versement_bancaire', label: 'Versement Espèces Bancaire' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="N° de Reçu Caisse"
                value={paymentReceipt}
                onChange={(e) => setPaymentReceipt(e.target.value)}
                placeholder="ex: REC-0042"
              />
              <CustomInput
                label="Réf / N° Chèque ou Virement"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="ex: CHQ 89201"
              />
            </div>

            <CustomInput
              label="Observations / Notes"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="ex: Acompte 50% avant passage au four"
            />
          </div>
        </CustomModal>
      )}
    </div>
  )
}
