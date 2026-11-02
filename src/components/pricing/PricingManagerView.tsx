import React, { useState, useMemo } from 'react'
import {
  Palette,
  Layers,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react'
import { useERPStore } from '../../store/erpStore'
import { BpcColor, BpcTexture, SlatType, MotorType } from '../../types/shutter'
import { SLAT_CATALOG } from '../../utils/shutterMath'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'

const TEXTURE_LABELS: Record<BpcTexture, { label: string; badgeClass: string }> = {
  sable: { label: 'Sablé / Texturé (TX)', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  mat: { label: 'Mat Profond (M)', badgeClass: 'bg-slate-700/40 text-slate-300 border-slate-600/40' },
  brillant: { label: 'Brillant 85% (G)', badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  satine: { label: 'Satiné 60% (S)', badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  martele: { label: 'Martelé / Effet Rouille', badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  metallise: { label: 'Bonded Métallisé (BM)', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
}

const PRESET_HEX_COLORS = [
  '#2E353B', '#383E42', '#141416', '#101113', '#F8FAFC', '#F1F5F9',
  '#4A3A2C', '#E3D4B6', '#CBD5E1', '#1D4ED8', '#DC2626', '#166534',
  '#94A3B8', '#78350F', '#1E293B', '#64748B', '#000000', '#FFFFFF'
]

export const PricingManagerView: React.FC = () => {
  const {
    bpcColors,
    slatPrices,
    motorPrices,
    addBpcColor,
    updateBpcColor,
    deleteBpcColor,
    updateSlatPrice,
    updateMotorPrice,
    resetPricingToDefaults,
  } = useERPStore()

  // Tabs: 'colors' | 'slats' | 'motors'
  const [activeTab, setActiveTab] = useState<'colors' | 'slats' | 'motors'>('colors')

  // Search & Filters for Colors
  const [searchQuery, setSearchQuery] = useState('')
  const [textureFilter, setTextureFilter] = useState<string>('all')

  // Notification de sauvegarde temporaire
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const showSaveNotice = (message: string) => {
    setSaveNotice(message)
    setTimeout(() => setSaveNotice(null), 2500)
  }

  // Modal State for adding/editing BPC color
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<BpcColor | null>(null)

  // Color Form State
  const [formCode, setFormCode] = useState('')
  const [formRal, setFormRal] = useState('')
  const [formName, setFormName] = useState('')
  const [formHex, setFormHex] = useState('#2E353B')
  const [formTexture, setFormTexture] = useState<BpcTexture>('sable')
  const [formSeries, setFormSeries] = useState('BPCOAT-PE (Qualicoat)')
  const [formPriceM2, setFormPriceM2] = useState<number>(300)
  const [formInStock, setFormInStock] = useState(true)

  const openAddColorModal = () => {
    setEditingColor(null)
    setFormCode('BPC ')
    setFormRal('7016')
    setFormName('')
    setFormHex('#2E353B')
    setFormTexture('sable')
    setFormSeries('BPCOAT-PE (Qualicoat)')
    setFormPriceM2(300)
    setFormInStock(true)
    setIsColorModalOpen(true)
  }

  const openEditColorModal = (color: BpcColor) => {
    setEditingColor(color)
    setFormCode(color.code)
    setFormRal(color.ralReference)
    setFormName(color.name)
    setFormHex(color.hex)
    setFormTexture(color.texture)
    setFormSeries(color.series || 'BPCOAT-PE')
    setFormPriceM2(color.pricePerM2Dzd)
    setFormInStock(color.inStock)
    setIsColorModalOpen(true)
  }

  const handleSaveColor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCode.trim()) return

    if (editingColor) {
      updateBpcColor(editingColor.id, {
        code: formCode.trim(),
        ralReference: formRal.trim(),
        name: formName.trim() || formCode.trim(),
        hex: formHex,
        texture: formTexture,
        series: formSeries,
        pricePerM2Dzd: Number(formPriceM2) || 0,
        inStock: formInStock,
      })
      showSaveNotice(`Teinte "${formCode}" mise à jour avec succès`)
    } else {
      addBpcColor({
        code: formCode.trim(),
        ralReference: formRal.trim(),
        name: formName.trim() || formCode.trim(),
        hex: formHex,
        texture: formTexture,
        series: formSeries,
        pricePerM2Dzd: Number(formPriceM2) || 0,
        inStock: formInStock,
      })
      showSaveNotice(`Nouvelle teinte BPC "${formCode}" ajoutée au catalogue`)
    }

    setIsColorModalOpen(false)
  }

  // Filtered colors
  const filteredColors = useMemo(() => {
    return bpcColors.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ralReference.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTexture = textureFilter === 'all' || c.texture === textureFilter
      return matchesSearch && matchesTexture
    })
  }, [bpcColors, searchQuery, textureFilter])

  return (
    <div className="space-y-6">
      {/* Toast de confirmation de sauvegarde */}
      {saveNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500/90 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur border border-emerald-400 animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} />
          <span className="font-medium">{saveNotice}</span>
        </div>
      )}

      {/* En-tête Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Palette className="text-sky-400" size={22} />
            Gestion des Tarifs & Catalogue BPC Algérie
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chiffrez au réel : Tarifs m² des lames, nuancier officiel Boyasan Powder Coating (Ouled Heddadj) et forfaits moteurs • Régime Net (TVA 0%).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser tous les prix et couleurs aux valeurs catalogue usine ?')) {
                resetPricingToDefaults()
                showSaveNotice('Tarifs et catalogue BPC réinitialisés aux valeurs usine.')
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors cursor-pointer"
            title="Réinitialiser tous les prix par défaut"
          >
            <RotateCcw size={14} />
            <span>Réinitialiser Usine</span>
          </button>

          {activeTab === 'colors' && (
            <button
              type="button"
              onClick={openAddColorModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>+ Ajouter Teinte BPC</span>
            </button>
          )}
        </div>
      </div>

      {/* Bannière de Régime Fiscal Net (Sans TVA) */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-950/30 border border-sky-500/20 text-xs">
        <div className="flex items-center gap-2.5 text-sky-200">
          <Info size={16} className="text-sky-400 shrink-0" />
          <span>
            <strong>Régime Forfaitaire Actif :</strong> Tous les tarifs ci-dessous et dans les devis/factures sont exprimés en <strong>Net DZD (TVA 0% non applicable)</strong>.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/30 shrink-0">
          TVA : 0%
        </span>
      </div>

      {/* Onglets de Navigation Principaux */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'colors'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Palette size={15} />
          <span>Nuancier & Teintes BPC ({bpcColors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'slats'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers size={15} />
          <span>Prix Lames au m² (6 profils)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('motors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'motors'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Zap size={15} />
          <span>Forfaits Moteurs & Quincaillerie</span>
        </button>
      </div>

      {/* ─────────────────── TAB 1: CATALOGUE COULEURS BPC ─────────────────── */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          {/* Barre de Recherche et Filtres Teintes */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F1A] p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par code BPC, RAL ou nom (ex: 7016, Sablé, Noir)..."
                className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {[
                { id: 'all', label: 'Toutes les finitions' },
                { id: 'sable', label: 'Sablé / Texturé' },
                { id: 'mat', label: 'Mat' },
                { id: 'brillant', label: 'Brillant' },
                { id: 'satine', label: 'Satiné' },
                { id: 'metallise', label: 'Métallisé' },
                { id: 'martele', label: 'Martelé' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTextureFilter(f.id)}
                  className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer border whitespace-nowrap ${
                    textureFilter === f.id
                      ? 'bg-sky-500 text-white border-sky-400'
                      : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Couleurs BPC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredColors.map((color) => {
              const textureInfo = TEXTURE_LABELS[color.texture] || TEXTURE_LABELS.sable

              return (
                <div
                  key={color.id}
                  className="bg-[#0B0F1A] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-md transition-all group"
                >
                  {/* Top: Pastille & Infos */}
                  <div className="flex items-start gap-3">
                    {/* Pastille de Couleur Réelle */}
                    <div
                      className="w-12 h-12 rounded-xl shadow-inner border border-white/20 shrink-0 relative flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: color.hex }}
                    >
                      {/* Motif de texture fine pour les sablés */}
                      {color.texture === 'sable' && (
                        <div
                          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
                          style={{
                            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                            backgroundSize: '3px 3px',
                          }}
                        />
                      )}
                      {color.texture === 'brillant' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                      )}
                      {color.texture === 'metallise' && (
                        <Sparkles size={14} className="text-white/60" />
                      )}
                    </div>

                    {/* Titres & Codes */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-100 text-xs truncate">
                          {color.code}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/60 shrink-0">
                          RAL {color.ralReference}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5" title={color.name}>
                        {color.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${textureInfo.badgeClass}`}
                        >
                          {textureInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bas : Tarification & Actions */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Plus-value poudrage :</span>
                      <span className="font-mono font-bold text-slate-200">
                        {color.pricePerM2Dzd > 0 ? `+${formatDZD(color.pricePerM2Dzd)}/m²` : 'Inclus (0 DZD)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Stock Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          updateBpcColor(color.id, { inStock: !color.inStock })
                          showSaveNotice(`Disponibilité de ${color.code} mise à jour`)
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          color.inStock
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        {color.inStock ? 'En Stock' : 'Épuisé'}
                      </button>

                      {/* Modifier */}
                      <button
                        type="button"
                        onClick={() => openEditColorModal(color)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                        title="Modifier cette teinte"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Supprimer la teinte ${color.code} du catalogue ?`)) {
                            deleteBpcColor(color.id)
                            showSaveNotice(`Teinte ${color.code} supprimée`)
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Supprimer du catalogue"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 2: TARIFS LAMES AU M² ─────────────────── */}
      {activeTab === 'slats' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0B0F1A] border border-slate-800 text-xs text-slate-300">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Barème des Tabliers & Profilés de Lames au Mètre Carré ($m^2$)
            </h3>
            <p className="text-slate-400 text-xs">
              Ces tarifs de base matière sont appliqués automatiquement dans le configurateur CPQ et sur les devis clients.
              Les modifications sont enregistrées en temps réel dans votre base locale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SLAT_CATALOG).map(([key, spec]) => {
              const slatTypeKey = key as SlatType
              const currentPrice = slatPrices[slatTypeKey] ?? spec.basePricePerM2Dzd

              return (
                <div
                  key={key}
                  className="bg-[#0B0F1A] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {spec.thicknessMm} mm • {spec.weightPerM2Kg} kg/m²
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Pas utile: {spec.usefulHeightMm}mm
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm">{spec.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {key.includes('micro')
                        ? 'Idéale pour boutiques et commerces de centre-ville nécessitant une visibilité nocturne.'
                        : key.includes('cobra')
                        ? 'Grille en tubes ondulés pour galeries marchandes et aération de parkings.'
                        : key.includes('isolee')
                        ? 'Lames double paroi aluminium injectées de mousse polyuréthane (isolation thermique et phonique).'
                        : key.includes('extrude')
                        ? 'Profil plein en aluminium extrudé trempé, résistance extrême aux effractions.'
                        : 'Lame galva pleine standard nervurée haute rigidité, profilée en continu en atelier.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-medium">Prix Net au m² :</span>
                      <span className="text-xs font-bold text-slate-200">En dinars (DZD)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1000"
                        step="100"
                        value={currentPrice}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0)
                          updateSlatPrice(slatTypeKey, val)
                          showSaveNotice(`Tarif ${spec.name} mis à jour : ${formatDZD(val)}/m²`)
                        }}
                        className="w-28 bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-sky-300 text-right text-sm focus:outline-none focus:border-sky-500"
                      />
                      <span className="text-xs font-mono text-slate-400 font-bold">DZD</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 3: FORFAITS MOTEURS ─────────────────── */}
      {activeTab === 'motors' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0B0F1A] border border-slate-800 text-xs text-slate-300">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Forfaits Motorisation, Automatismes & Quincaillerie
            </h3>
            <p className="text-slate-400 text-xs">
              Ces montants forfaits intègrent le moteur, l'électrofrein, les fixations et le câblage standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: 'central_mono' as MotorType,
                title: 'Moteur Central Monomoteur (170 - 180 Nm)',
                brand: 'ACM Unititan (Italie) / Titan',
                desc: 'Idéal pour rideaux commerciaux jusqu’à 150 kg avec électrofrein et débrayage manuel.',
              },
              {
                type: 'central_bi' as MotorType,
                title: 'Moteur Central Bimoteur (360 - 420 Nm)',
                brand: 'ACM Titan Bimoteur / SuperTitan',
                desc: 'Pour grands rideaux lourds de 160 kg à 320 kg. Double moteur compensé.',
              },
              {
                type: 'tubulaire' as MotorType,
                title: 'Moteur Tubulaire Intégré (80 - 120 Nm)',
                brand: 'Somfy / Simu / ACM',
                desc: 'Pour rideaux aluminium résidentiels et coffres compacts dans linteau.',
              },
              {
                type: 'lateral_industriel' as MotorType,
                title: 'Moteur Latéral Triphasé Industriel (600 - 1000 Nm)',
                brand: 'GfA Elektromaten / Marantec',
                desc: 'Motorisation industrielle à prise directe avec chaîne de secours et parachute EN 13241.',
              },
              {
                type: 'manuel' as MotorType,
                title: 'Mécanisme Manuel (Axe à ressorts)',
                brand: 'Boîtes à ressorts Trempés',
                desc: 'Rideaux manuels légers avec tirage direct et serrures centrales.',
              },
            ].map((m) => {
              const currentPrice = motorPrices[m.type] ?? 0

              return (
                <div
                  key={m.type}
                  className="bg-[#0B0F1A] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-md transition-all"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {m.brand}
                    </span>
                    <h3 className="font-bold text-slate-100 text-sm mt-1">{m.title}</h3>
                    <p className="text-[11px] text-slate-400">{m.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Prix Forfait :</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={currentPrice}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0)
                          updateMotorPrice(m.type, val)
                          showSaveNotice(`Forfait moteur ${m.title} mis à jour : ${formatDZD(val)}`)
                        }}
                        className="w-28 bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-emerald-400 text-right text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-xs font-mono text-slate-400 font-bold">DZD</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─────────────────── MODAL AJOUT / ÉDITION TEINTE BPC ─────────────────── */}
      <CustomModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        title={editingColor ? `Modifier ${editingColor.code}` : 'Ajouter une Teinte du Catalogue BPC'}
        subtitle="Enregistrez une référence Boyasan Powder Coating Algérie avec texture et tarif au m²"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveColor} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              label="Code Teinte BPC *"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="ex: BPC 7016 Sablé"
              required
            />

            <CustomInput
              label="Référence RAL de base *"
              value={formRal}
              onChange={(e) => setFormRal(e.target.value)}
              placeholder="ex: 7016 ou 9005"
              required
            />
          </div>

          <CustomInput
            label="Désignation Commerciale"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="ex: Gris Anthracite Sablé Texturé Qualicoat"
          />

          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              label="Texture / Finition BPC *"
              value={formTexture}
              onChange={(val) => setFormTexture(val as BpcTexture)}
              options={[
                { value: 'sable', label: 'Sablé / Texturé Fin (TX)' },
                { value: 'mat', label: 'Mat 25-30% (M)' },
                { value: 'brillant', label: 'Brillant 85% (G)' },
                { value: 'satine', label: 'Satiné 60% (S)' },
                { value: 'metallise', label: 'Bonded Métallisé (BM)' },
                { value: 'martele', label: 'Martelé / Effet Forgé' },
              ]}
            />

            <CustomSelect
              label="Gamme Produit BPC *"
              value={formSeries}
              onChange={(val) => setFormSeries(val)}
              options={[
                { value: 'BPCOAT-PE (Qualicoat)', label: 'BPCOAT-PE (Polyester Extérieur)' },
                { value: 'BPCOAT-TF (Sans TGIC)', label: 'BPCOAT-TF (Polyester Sans TGIC)' },
                { value: 'BPCOAT-BM (Métallisé)', label: 'BPCOAT-BM (Bonded Metallic)' },
                { value: 'BPCOAT-EP (Hybride)', label: 'BPCOAT-EP (Époxy-Polyester)' },
              ]}
            />
          </div>

          {/* Sélecteur de Couleur & Code Hex */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Nuance Couleur & Code HEX :
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formHex}
                onChange={(e) => setFormHex(e.target.value)}
                className="w-12 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={formHex}
                onChange={(e) => setFormHex(e.target.value)}
                placeholder="#2E353B"
                className="w-32 bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-100"
              />
              <div
                className="flex-1 h-10 rounded-xl border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-white shadow-inner"
                style={{ backgroundColor: formHex }}
              >
                Aperçu : {formHex}
              </div>
            </div>

            {/* Presets rapides */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_HEX_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormHex(hex)}
                  className={`w-6 h-6 rounded-lg border transition-transform cursor-pointer ${
                    formHex.toLowerCase() === hex.toLowerCase() ? 'scale-110 ring-2 ring-sky-400 border-white' : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <CustomInput
              label="Plus-value au m² (DZD)"
              type="number"
              min="0"
              step="50"
              value={formPriceM2}
              onChange={(e) => setFormPriceM2(parseInt(e.target.value) || 0)}
              helpText="Ex: 300 DZD pour Sablé, 0 pour blanc standard"
            />

            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 cursor-pointer w-4 h-4"
                />
                <span className="font-semibold">Disponible en Stock Atelier</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsColorModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              {editingColor ? 'Mettre à jour' : 'Enregistrer dans le Catalogue'}
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  )
}
