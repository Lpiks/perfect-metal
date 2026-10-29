import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { InventoryItem, InventoryCategory } from '../../types/inventory'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import {
  Boxes,
  AlertTriangle,
  Plus,
  Search,
  ArrowUpDown,
  CheckCircle,
  PackageCheck,
} from 'lucide-react'

export const InventoryView: React.FC = () => {
  const { inventory, adjustInventoryStock, addInventoryItem } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Modals
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null)
  const [adjustDelta, setAdjustDelta] = useState<number>(10)
  const [adjustType, setAdjustType] = useState<'entree' | 'sortie'>('entree')
  const [adjustReason, setAdjustReason] = useState('Réception Fournisseur')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCode, setNewItemCode] = useState('')
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('acier_bobines')
  const [newItemUnit, setNewItemUnit] = useState<'kg' | 'm' | 'unite' | 'barre_6m' | 'rouleau'>('kg')
  const [newItemStock, setNewItemStock] = useState<number>(100)
  const [newItemMinStock, setNewItemMinStock] = useState<number>(20)
  const [newItemPrice, setNewItemPrice] = useState<number>(1500)
  const [newItemSupplier, setNewItemSupplier] = useState('')
  const [newItemLocation, setNewItemLocation] = useState('')

  const handleOpenAdjust = (item: InventoryItem, type: 'entree' | 'sortie') => {
    setAdjustingItem(item)
    setAdjustType(type)
    setAdjustDelta(type === 'entree' ? 50 : 10)
    setAdjustReason(type === 'entree' ? 'Réception Fournisseur' : 'Consommation Atelier')
  }

  const handleSaveAdjust = () => {
    if (!adjustingItem || adjustDelta <= 0) return
    const delta = adjustType === 'entree' ? adjustDelta : -adjustDelta
    adjustInventoryStock(adjustingItem.id, delta, adjustReason)
    setAdjustingItem(null)
  }

  const handleCreateItem = () => {
    if (!newItemName || !newItemCode) return

    addInventoryItem({
      code: newItemCode,
      name: newItemName,
      category: newItemCategory,
      unit: newItemUnit,
      currentStock: newItemStock,
      minimumStock: newItemMinStock,
      unitPurchasePrice: newItemPrice,
      supplier: newItemSupplier,
      locationInWorkshop: newItemLocation,
    })

    setIsCreateModalOpen(false)
  }

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCat
  })

  // Alertes stocks critiques
  const criticalItems = inventory.filter((i) => i.currentStock <= i.minimumStock)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Boxes className="text-sky-400" size={22} />
            Gestion des Stocks & Matières Premières Atelier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bobines acier, profilés, moteurs ACM, poudres thermolaquage RAL et accessoires de sécurité.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Plus size={16} />
          Ajouter un Article en Stock
        </button>
      </div>

      {/* Bannière Alerte Stock Critique (si présent) */}
      {criticalItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-300 block mb-0.5">
              Attention : {criticalItems.length} article(s) sous le seuil d'alerte critique !
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {criticalItems.map((ci) => (
                <span
                  key={ci.id}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 font-mono text-[11px] font-semibold border border-amber-500/40"
                >
                  {ci.name} : reste {ci.currentStock} {ci.unit} (Seuil mini : {ci.minimumStock})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F1A] p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par désignation, référence article, fournisseur..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'acier_bobines', label: 'Bobines Acier' },
            { id: 'poudres_ral', label: 'Poudres RAL' },
            { id: 'moteurs', label: 'Moteurs' },
            { id: 'coulisses_tubes', label: 'Coulisses & Tubes' },
            { id: 'quincaillerie_securite', label: 'Quincaillerie' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCategoryFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                categoryFilter === f.id
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des Articles en Stock */}
      <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0E1424] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-left">Code & Désignation</th>
                <th className="p-3.5 text-left">Catégorie</th>
                <th className="p-3.5 text-center font-mono">Stock Actuel</th>
                <th className="p-3.5 text-center font-mono">Seuil Mini</th>
                <th className="p-3.5 text-center">État Stock</th>
                <th className="p-3.5 text-right font-mono">Prix Achat Unitaire</th>
                <th className="p-3.5 text-left">Emplacement Atelier</th>
                <th className="p-3.5 text-center">Mouvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredItems.map((item) => {
                const isCritical = item.currentStock <= item.minimumStock

                return (
                  <tr key={item.id} className="hover:bg-[#0E1322]/80 transition-colors">
                    {/* Code & Nom */}
                    <td className="p-3.5">
                      <div className="font-mono text-[10px] text-sky-400 font-bold">{item.code}</div>
                      <div className="font-bold text-slate-100 text-sm mt-0.5">{item.name}</div>
                      {item.supplier && (
                        <div className="text-[10px] text-slate-500">Fournisseur : {item.supplier}</div>
                      )}
                    </td>

                    {/* Catégorie */}
                    <td className="p-3.5">
                      <span className="capitalize text-slate-300">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Stock Actuel */}
                    <td className="p-3.5 text-center font-mono text-sm font-black text-slate-100">
                      {item.currentStock}{' '}
                      <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </td>

                    {/* Seuil Mini */}
                    <td className="p-3.5 text-center font-mono text-xs text-slate-400">
                      {item.minimumStock} {item.unit}
                    </td>

                    {/* Badge État */}
                    <td className="p-3.5 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                          <AlertTriangle size={11} />
                          Critique
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle size={11} />
                          Optimal
                        </span>
                      )}
                    </td>

                    {/* Prix d'Achat */}
                    <td className="p-3.5 text-right font-mono text-slate-300 font-bold">
                      {formatDZD(item.unitPurchasePrice)}
                    </td>

                    {/* Emplacement */}
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {item.locationInWorkshop || 'Atelier Général'}
                    </td>

                    {/* Boutons Entrée / Sortie Stock */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(item, 'entree')}
                          title="Entrée de stock (Réception)"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 cursor-pointer transition-colors"
                        >
                          + Entrée
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(item, 'sortie')}
                          title="Sortie de stock (Fabrication)"
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px] border border-rose-500/40 cursor-pointer transition-colors"
                        >
                          - Sortie
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJUSTEMENT STOCK */}
      {adjustingItem && (
        <CustomModal
          isOpen={true}
          onClose={() => setAdjustingItem(null)}
          title={`${adjustType === 'entree' ? 'Entrée de Stock' : 'Sortie de Stock'} — ${adjustingItem.name}`}
          subtitle={`Stock actuel : ${adjustingItem.currentStock} ${adjustingItem.unit}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveAdjust}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg cursor-pointer ${
                  adjustType === 'entree'
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                    : 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'
                }`}
              >
                Valider le Mouvement
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomInput
              label={`Quantité à ${adjustType === 'entree' ? 'ajouter' : 'déduire'} (${adjustingItem.unit}) *`}
              type="number"
              suffix={adjustingItem.unit}
              value={adjustDelta}
              onChange={(e) => setAdjustDelta(Math.max(1, Number(e.target.value)))}
            />

            <CustomInput
              label="Motif du Mouvement / Réf Bon de Livraison"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="ex: Réception BL Fournisseur N° 882"
            />
          </div>
        </CustomModal>
      )}

      {/* MODAL NOUVEL ARTICLE EN STOCK */}
      {isCreateModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title="Ajouter un Nouvel Article en Stock"
          subtitle="Enregistrez une nouvelle matière première ou quincaillerie"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateItem}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Créer l'Article
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Code Référence *"
                value={newItemCode}
                onChange={(e) => setNewItemCode(e.target.value)}
                placeholder="ex: POUDRE-RAL-8014"
              />
              <CustomInput
                label="Nom de l'Article *"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="ex: Poudre Brun Sépia Sablé"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomSelect
                label="Catégorie *"
                value={newItemCategory}
                onChange={(v) => setNewItemCategory(v as InventoryCategory)}
                options={[
                  { value: 'acier_bobines', label: 'Bobine Acier Galvanisé' },
                  { value: 'poudres_ral', label: 'Poudres Thermolaquage RAL' },
                  { value: 'moteurs', label: 'Moteurs & Automatismes' },
                  { value: 'coulisses_tubes', label: 'Coulisses & Tubes Axe' },
                  { value: 'ressorts_axes', label: 'Boîtes à Ressorts' },
                  { value: 'quincaillerie_securite', label: 'Quincaillerie & Sécurité' },
                ]}
              />

              <CustomSelect
                label="Unité de Mesure *"
                value={newItemUnit}
                onChange={(v) => setNewItemUnit(v as any)}
                options={[
                  { value: 'kg', label: 'Kilogrammes (kg)' },
                  { value: 'unite', label: 'Unités (pièces)' },
                  { value: 'barre_6m', label: 'Barres de 6 mètres' },
                  { value: 'm', label: 'Mètres linéaires' },
                  { value: 'rouleau', label: 'Rouleaux' },
                ]}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <CustomInput
                label="Stock Initial *"
                type="number"
                value={newItemStock}
                onChange={(e) => setNewItemStock(Number(e.target.value))}
              />
              <CustomInput
                label="Seuil d'Alerte Mini *"
                type="number"
                value={newItemMinStock}
                onChange={(e) => setNewItemMinStock(Number(e.target.value))}
              />
              <CustomInput
                label="Prix d'Achat (DZD) *"
                type="number"
                suffix="DZD"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Fournisseur Habituel"
                value={newItemSupplier}
                onChange={(e) => setNewItemSupplier(e.target.value)}
                placeholder="ex: Pulverit / ACM Direct"
              />
              <CustomInput
                label="Emplacement Atelier"
                value={newItemLocation}
                onChange={(e) => setNewItemLocation(e.target.value)}
                placeholder="ex: Rack B, Étagère 3"
              />
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  )
}
