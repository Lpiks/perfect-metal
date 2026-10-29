import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { Supplier, PurchaseOrder, SupplierCategory } from '../../types/supplier'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { CustomDatePicker } from '../ui/CustomDatePicker'
import {
  Factory,
  Plus,
  Search,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

export const SuppliersView: React.FC = () => {
  const { suppliers, purchases, addSupplier, updateSupplier, addPurchaseOrder, recordSupplierPayment } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Modals
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false)
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false)
  const [payingPurchase, setPayingPurchase] = useState<PurchaseOrder | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)

  // Formulaire Fournisseur
  const [name, setName] = useState('')
  const [category, setCategory] = useState<SupplierCategory>('bobines_acier')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [wilaya, setWilaya] = useState('16 - Alger')

  // Formulaire Achat
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '')
  const [itemName, setItemName] = useState('Bobine Acier Galvanisé 8/10e (3T)')
  const [itemQty, setItemQty] = useState<number>(3000)
  const [itemPrice, setItemPrice] = useState<number>(280)
  const [purchasePaidAmount, setPurchasePaidAmount] = useState<number>(500000)
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0])

  const totalSupplierDebt = suppliers.reduce((sum, s) => sum + s.balanceDueDzd, 0)
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalTTC, 0)

  const handleCreateSupplier = () => {
    if (!name || !phone) return
    addSupplier({
      name,
      category,
      contactPerson,
      phone,
      email,
      address,
      city,
      wilaya,
    })
    setIsAddSupplierModalOpen(false)
  }

  const handleCreatePurchase = () => {
    const supplier = suppliers.find((s) => s.id === selectedSupplierId)
    if (!supplier) return

    const totalHT = itemQty * itemPrice
    const vat = Math.round(totalHT * 0.19)
    const totalTTC = totalHT + vat
    const balanceDue = Math.max(0, totalTTC - purchasePaidAmount)

    addPurchaseOrder({
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: deliveryDate,
      items: [{ name: itemName, quantity: itemQty, unit: 'kg', unitPriceDzd: itemPrice, totalDzd: totalHT }],
      totalHT,
      vatAmount: vat,
      totalTTC,
      paidAmount: purchasePaidAmount,
      balanceDue,
      paymentStatus: balanceDue === 0 ? 'regle' : purchasePaidAmount > 0 ? 'acompte' : 'non_paye',
      status: 'recu',
    })

    setIsNewPurchaseModalOpen(false)
  }

  const handleRecordPayment = () => {
    if (!payingPurchase || paymentAmount <= 0) return
    recordSupplierPayment(payingPurchase.id, paymentAmount)
    setPayingPurchase(null)
  }

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Factory className="text-sky-400" size={22} />
            Fournisseurs, Approvisionnement & Dettes Matière
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos importateurs de tôle galva, fabricants de moteurs ACM et distributeurs de poudre thermolaquage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus size={15} />
            Nouveau Fournisseur
          </button>

          <button
            type="button"
            onClick={() => setIsNewPurchaseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
          >
            <Plus size={16} />
            Enregistrer Achat Matière
          </button>
        </div>
      </div>

      {/* Cartes KPI Dettes Fournisseurs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 block">Total Dettes Fournisseurs (À Régler)</span>
          <div className="text-2xl font-black font-mono text-rose-400">{formatDZD(totalSupplierDebt)}</div>
          <span className="text-[10px] text-slate-500 block">Sur {suppliers.length} fournisseurs conventionnés</span>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 block">Volume Total d'Achats Matière</span>
          <div className="text-2xl font-black font-mono text-slate-100">{formatDZD(totalPurchasesAmount)}</div>
          <span className="text-[10px] text-slate-500 block">Bobines acier, moteurs et poudres RAL</span>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 block">Règlements Fournisseurs Effectués</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {formatDZD(totalPurchasesAmount - totalSupplierDebt)}
          </div>
          <span className="text-[10px] text-emerald-500/80 block font-medium">Taux d'apurement des factures fournisseurs</span>
        </div>
      </div>

      {/* Grille des Fournisseurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-[10px] text-sky-400 font-bold block">{supplier.code}</span>
                  <h3 className="text-sm font-bold text-slate-100">{supplier.name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium capitalize">
                    {supplier.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-500" />
                  <span className="font-mono text-slate-300">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-500 shrink-0" />
                  <span>{supplier.city}, {supplier.wilaya}</span>
                </div>
                {supplier.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-1">{supplier.notes}</p>
                )}
              </div>
            </div>

            {/* Bilan Dette Fournisseur */}
            <div className="bg-[#0E1322] p-3 rounded-xl border border-slate-800/60 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Commandé :</span>
                <span className="font-mono text-slate-200">{formatDZD(supplier.totalPurchasedDzd)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-800 pt-1">
                <span className={supplier.balanceDueDzd > 0 ? 'text-rose-400' : 'text-slate-400'}>
                  Dette Usine Restante :
                </span>
                <span className={`font-mono ${supplier.balanceDueDzd > 0 ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                  {formatDZD(supplier.balanceDueDzd)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des Derniers Bons d'Achat Réceptionnés */}
      <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-3 p-5">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <FileText size={16} className="text-sky-400" />
          Historique des Réceptions & Factures Fournisseurs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0E1424] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3 text-left">N° Pièce</th>
                <th className="p-3 text-left">Fournisseur & Article</th>
                <th className="p-3 text-center">Date Réception</th>
                <th className="p-3 text-right font-mono">Total TTC</th>
                <th className="p-3 text-right font-mono">Réglé</th>
                <th className="p-3 text-right font-mono">Reste Dû</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {purchases.map((po) => (
                <tr key={po.id} className="hover:bg-[#0E1322]/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-sky-400">{po.code}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-100">{po.supplierName}</div>
                    <div className="text-[10px] text-slate-400">{po.items[0]?.name}</div>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-300">{po.date}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-100">{formatDZD(po.totalTTC)}</td>
                  <td className="p-3 text-right font-mono text-emerald-400">{formatDZD(po.paidAmount)}</td>
                  <td className="p-3 text-right font-mono font-black text-rose-400">{formatDZD(po.balanceDue)}</td>
                  <td className="p-3 text-center">
                    {po.balanceDue > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPayingPurchase(po)
                          setPaymentAmount(po.balanceDue)
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] cursor-pointer"
                      >
                        Payer Acompte
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold">✓ Soldé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJOUT FOURNISSEUR */}
      {isAddSupplierModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsAddSupplierModalOpen(false)}
          title="Ajouter un Nouveau Fournisseur"
          subtitle="Enregistrez un partenaire métal, motorisation ou peinture"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsAddSupplierModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateSupplier}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Créer Fournisseur
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomInput
              label="Nom de l'Entreprise / Raison Sociale *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Sider El Hadjar / ACM Italy"
            />

            <CustomSelect
              label="Catégorie de Produits *"
              value={category}
              onChange={(v) => setCategory(v as SupplierCategory)}
              options={[
                { value: 'bobines_acier', label: 'Bobines Acier Galvanisé (8/10, 10/10)' },
                { value: 'moteurs_automatismes', label: 'Moteurs & Automatismes (ACM, Titan)' },
                { value: 'poudres_thermolaquage', label: 'Poudres Thermolaquage (RAL Qualicoat)' },
                { value: 'quincaillerie_coulisses', label: 'Coulisses & Quincaillerie' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Personne Contact"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
              <CustomInput
                label="Téléphone *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <CustomInput
                label="Wilaya"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
              />
            </div>
          </div>
        </CustomModal>
      )}

      {/* MODAL ENREGISTRER ACHAT */}
      {isNewPurchaseModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsNewPurchaseModalOpen(false)}
          title="Enregistrer un Bon d'Achat & Approvisionnement"
          subtitle="Entrée en stock de matière première et comptabilisation de dette"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsNewPurchaseModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreatePurchase}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Valider l'Achat
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomSelect
              label="Sélectionner le Fournisseur *"
              value={selectedSupplierId}
              onChange={setSelectedSupplierId}
              options={suppliers.map((s) => ({
                value: s.id,
                label: s.name,
                subtitle: `${s.city} • Dette actuelle : ${formatDZD(s.balanceDueDzd)}`,
              }))}
            />

            <CustomInput
              label="Désignation Matière / Composant *"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="ex: Bobine Acier Galva 8/10e (3 Tonnes)"
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Quantité Achetée *"
                type="number"
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value))}
              />
              <CustomInput
                label="Prix Unitaire d'Achat (DZD) *"
                type="number"
                suffix="DZD"
                value={itemPrice}
                onChange={(e) => setItemPrice(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Acompte Réglé à la Commande (DZD)"
                type="number"
                suffix="DZD"
                value={purchasePaidAmount}
                onChange={(e) => setPurchasePaidAmount(Number(e.target.value))}
              />
              <CustomDatePicker
                label="Date de Réception Prévue"
                value={deliveryDate}
                onChange={setDeliveryDate}
              />
            </div>
          </div>
        </CustomModal>
      )}

      {/* MODAL RÉGLER FOURNISSEUR */}
      {payingPurchase && (
        <CustomModal
          isOpen={true}
          onClose={() => setPayingPurchase(null)}
          title={`Règlement Dette Fournisseur — ${payingPurchase.code}`}
          subtitle={`${payingPurchase.supplierName} • Dette restante : ${formatDZD(payingPurchase.balanceDue)}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setPayingPurchase(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirmer le Paiement
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomInput
              label="Montant du Paiement (DZD) *"
              type="number"
              suffix="DZD"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />
          </div>
        </CustomModal>
      )}
    </div>
  )
}
