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
  BookOpen,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { useERPStore } from '../../store/erpStore'
import { BpcColor, BpcTexture, SlatType, MotorType } from '../../types/shutter'
import { SLAT_CATALOG } from '../../utils/shutterMath'
import { formatDZD } from '../../utils/currency'
import {
  BPC_MASTER_CATALOG,
  BpcMasterColor,
  BPC_COLOR_FAMILIES,
} from '../../utils/bpcMasterCatalog'
import { CustomModal } from '../ui/CustomModal'
import { CustomConfirmModal } from '../ui/CustomConfirmModal'
import { CustomSwitch } from '../ui/CustomSwitch'

const TEXTURE_CONFIG: Record<
  BpcTexture,
  { label: string; short: string; badgeClass: string; defaultSurchargeDzd: number }
> = {
  sable: {
    label: 'Sablé / Texturé Fin (TX)',
    short: 'Sablé',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    defaultSurchargeDzd: 300,
  },
  mat: {
    label: 'Mat Profond 25-30% (M)',
    short: 'Mat',
    badgeClass: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    defaultSurchargeDzd: 0,
  },
  brillant: {
    label: 'Brillant 85% (G)',
    short: 'Brillant',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    defaultSurchargeDzd: 0,
  },
  satine: {
    label: 'Satiné 60% (S)',
    short: 'Satiné',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    defaultSurchargeDzd: 0,
  },
  metallise: {
    label: 'Bonded Métallisé (BM)',
    short: 'Métallisé',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    defaultSurchargeDzd: 600,
  },
  martele: {
    label: 'Martelé / Effet Rouille',
    short: 'Martelé',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    defaultSurchargeDzd: 800,
  },
}

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

  // Onglets : 'colors' | 'slats' | 'motors'
  const [activeTab, setActiveTab] = useState<'colors' | 'slats' | 'motors'>('colors')

  // Filtres du nuancier actif
  const [searchQuery, setSearchQuery] = useState('')
  const [textureFilter, setTextureFilter] = useState<string>('all')

  // Toast de notification temporaire
  const [saveNotice, setSaveNotice] = useState<string | null>(null)
  const showSaveNotice = (message: string) => {
    setSaveNotice(message)
    setTimeout(() => setSaveNotice(null), 2500)
  }

  // État du Modal "Cahier de Couleur BPC"
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<BpcColor | null>(null)
  const [colorToDelete, setColorToDelete] = useState<BpcColor | null>(null)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Filtres & sélection dans le Cahier Maître BPC
  const [bookletFamily, setBookletFamily] = useState<string>('Toutes les familles')
  const [bookletSearch, setBookletSearch] = useState('')
  const [selectedMasterColor, setSelectedMasterColor] = useState<BpcMasterColor>(
    BPC_MASTER_CATALOG[0]
  )

  // Options pour la teinte à ajouter ou éditer
  const [formTexture, setFormTexture] = useState<BpcTexture>('sable')
  const [formPriceM2, setFormPriceM2] = useState<number>(300)
  const [formInStock, setFormInStock] = useState(true)
  const [formCustomName, setFormCustomName] = useState('')

  // Ouvrir le Cahier de Couleur BPC pour ajouter une teinte certifiée
  const openBookletModal = () => {
    setEditingColor(null)
    setBookletFamily('Toutes les familles')
    setBookletSearch('')
    const defaultColor = BPC_MASTER_CATALOG[0]
    setSelectedMasterColor(defaultColor)
    setFormCustomName(defaultColor.standardName)
    setFormTexture('sable')
    setFormPriceM2(TEXTURE_CONFIG.sable.defaultSurchargeDzd)
    setFormInStock(true)
    setIsColorModalOpen(true)
  }

  // Ouvrir en mode édition d'une teinte déjà au catalogue
  const openEditColorModal = (color: BpcColor) => {
    setEditingColor(color)
    const matchingMaster =
      BPC_MASTER_CATALOG.find((m) => m.ralCode === color.ralReference) || BPC_MASTER_CATALOG[0]
    setSelectedMasterColor(matchingMaster)
    setFormCustomName(color.name)
    setFormTexture(color.texture)
    setFormPriceM2(color.pricePerM2Dzd)
    setFormInStock(color.inStock)
    setIsColorModalOpen(true)
  }

  // Changement de texture ➔ mise à jour de la plus-value suggérée
  const handleTextureSelect = (tex: BpcTexture) => {
    setFormTexture(tex)
    setFormPriceM2(TEXTURE_CONFIG[tex].defaultSurchargeDzd)
  }

  // Clic sur une couleur du cahier maître
  const handleSelectMaster = (master: BpcMasterColor) => {
    setSelectedMasterColor(master)
    setFormCustomName(master.standardName)
  }

  // Validation : enregistrement dans le catalogue actif
  const handleSaveColor = (e: React.FormEvent) => {
    e.preventDefault()

    const textureInfo = TEXTURE_CONFIG[formTexture]
    const code = editingColor
      ? editingColor.code
      : `BPC ${selectedMasterColor.ralCode} ${textureInfo.short}`
    const series =
      selectedMasterColor.recommendedSeries ||
      (formTexture === 'metallise' || formTexture === 'martele'
        ? 'BPCOAT-BM (Spécial)'
        : 'BPCOAT-PE (Qualicoat)')

    if (editingColor) {
      updateBpcColor(editingColor.id, {
        name: formCustomName.trim() || editingColor.name,
        texture: formTexture,
        pricePerM2Dzd: Number(formPriceM2) || 0,
        inStock: formInStock,
      })
      showSaveNotice(`Teinte "${editingColor.code}" mise à jour avec succès`)
    } else {
      addBpcColor({
        code,
        ralReference: selectedMasterColor.ralCode,
        name: formCustomName.trim() || `${selectedMasterColor.standardName} (${textureInfo.short})`,
        hex: selectedMasterColor.hex,
        texture: formTexture,
        series,
        pricePerM2Dzd: Number(formPriceM2) || 0,
        inStock: formInStock,
        isPopular: selectedMasterColor.popularInAlgeria,
      })
      showSaveNotice(`Teinte "${code}" activée depuis le Cahier BPC`)
    }

    setIsColorModalOpen(false)
  }

  // Teintes actives filtrées
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

  // Teintes du Cahier Maître filtrées
  const filteredMasterColors = useMemo(() => {
    return BPC_MASTER_CATALOG.filter((m) => {
      const matchesSearch =
        m.ralCode.toLowerCase().includes(bookletSearch.toLowerCase()) ||
        m.standardName.toLowerCase().includes(bookletSearch.toLowerCase())
      const matchesFamily =
        bookletFamily === 'Toutes les familles' || m.family === bookletFamily
      return matchesSearch && matchesFamily
    })
  }, [bookletSearch, bookletFamily])

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
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors cursor-pointer"
            title="Réinitialiser tous les prix par défaut"
          >
            <RotateCcw size={14} />
            <span>Réinitialiser Usine</span>
          </button>

          {activeTab === 'colors' && (
            <button
              type="button"
              onClick={openBookletModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <BookOpen size={16} />
              <span>Ouvrir Cahier de Couleur BPC</span>
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
          <span>Nuancier & Teintes BPC Actives ({bpcColors.length})</span>
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

          {/* Grille des Couleurs BPC Actives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredColors.map((color) => {
              const textureInfo = TEXTURE_CONFIG[color.texture] || TEXTURE_CONFIG.sable

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
                        {color.pricePerM2Dzd > 0
                          ? `+${formatDZD(color.pricePerM2Dzd)}/m²`
                          : 'Inclus (0 DZD)'}
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
                        onClick={() => setColorToDelete(color)}
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
                        className="w-28 bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-sky-300 text-right text-sm focus:outline-none focus:border-sky-500 cursor-text"
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
                        className="w-28 bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-emerald-400 text-right text-sm focus:outline-none focus:border-emerald-500 cursor-text"
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

      {/* ─────────────────── MODAL "CAHIER DE COULEUR BPC ALGÉRIE" (0 ERREUR) ─────────────────── */}
      <CustomModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        title={
          editingColor
            ? `Modifier Teinte : ${editingColor.code}`
            : 'Cahier de Couleur BPC Algérie (Boyasan Powder Coating)'
        }
        subtitle={
          editingColor
            ? 'Ajustez la finition, la plus-value au m² ou la disponibilité en stock'
            : 'Feuilletez le nuancier officiel certifié et activez la teinte dans votre atelier sans erreur de code ou de couleur'
        }
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveColor} className="space-y-5">
          {!editingColor ? (
            /* Mode 1: Feuilleter le Cahier de Couleur BPC Maître */
            <div className="space-y-3">
              {/* Barre de Recherche dans le Cahier Maître */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={bookletSearch}
                    onChange={(e) => setBookletSearch(e.target.value)}
                    placeholder="Tapez un numéro RAL ou nom (ex: 7039, sépia, 9005, anthracite)..."
                    className="w-full bg-[#0E1322] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Filtre par Famille Chromatique */}
                <div className="flex items-center gap-1 overflow-x-auto text-[10px] pb-1">
                  {BPC_COLOR_FAMILIES.map((fam) => (
                    <button
                      key={fam}
                      type="button"
                      onClick={() => setBookletFamily(fam)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border whitespace-nowrap ${
                        bookletFamily === fam
                          ? 'bg-sky-500 text-white border-sky-400'
                          : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {fam}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grille du Nuancier Maître BPC */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1 p-1 bg-[#090D17] rounded-xl border border-slate-800/80">
                {filteredMasterColors.map((master) => {
                  const isSelected = selectedMasterColor.ralCode === master.ralCode
                  const alreadyInStock = bpcColors.some(
                    (c) => c.ralReference === master.ralCode
                  )

                  return (
                    <button
                      key={master.ralCode}
                      type="button"
                      onClick={() => handleSelectMaster(master)}
                      className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/15 shadow-[0_0_12px_rgba(14,165,233,0.3)] ring-2 ring-sky-400'
                          : 'border-slate-800/90 bg-[#0E1322] hover:border-slate-700'
                      }`}
                    >
                      {/* Pastille de Couleur Certifiée */}
                      <span
                        className="w-8 h-8 rounded-lg border border-white/25 shadow-inner shrink-0 relative"
                        style={{ backgroundColor: master.hex }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                            <CheckCircle2 size={15} className="text-white drop-shadow" />
                          </span>
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-200 text-xs">
                            RAL {master.ralCode}
                          </span>
                          {master.popularInAlgeria && (
                            <span
                              className="text-amber-400 shrink-0"
                              title="Très populaire en Algérie"
                            >
                              <Star size={10} fill="currentColor" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate" title={master.standardName}>
                          {master.standardName}
                        </div>
                        {alreadyInStock && (
                          <span className="text-[9px] text-emerald-400 font-semibold">
                            Déjà au catalogue
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {/* Panneau de Configuration de la Finition & Plus-Value */}
          <div className="p-4 rounded-2xl bg-[#090D17] border border-slate-800 space-y-4">
            {/* Visualisation de la Teinte Choisie */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-800">
              <div
                className="w-14 h-14 rounded-xl border-2 border-white/30 shadow-lg shrink-0 relative flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: selectedMasterColor.hex }}
              >
                {formTexture === 'sable' && (
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #fff 1.2px, transparent 1.2px)',
                      backgroundSize: '3px 3px',
                    }}
                  />
                )}
                {formTexture === 'brillant' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
                )}
                {formTexture === 'metallise' && <Sparkles size={16} className="text-white/70" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    RAL {selectedMasterColor.ralCode}
                  </span>
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {selectedMasterColor.standardName}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Code Final :{' '}
                    <strong className="text-sky-300">
                      {editingColor
                        ? editingColor.code
                        : `BPC ${selectedMasterColor.ralCode} ${TEXTURE_CONFIG[formTexture].short}`}
                    </strong>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({selectedMasterColor.hex})
                  </span>
                </div>
              </div>
            </div>

            {/* Choix de la Texture / Finition du Four BPC */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                1. Choisissez la Finition BPC (Aspect & Brillance du Four) :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'sable',
                    'mat',
                    'brillant',
                    'satine',
                    'metallise',
                    'martele',
                  ] as BpcTexture[]
                ).map((tex) => {
                  const cfg = TEXTURE_CONFIG[tex]
                  const isSelected = formTexture === tex

                  return (
                    <button
                      key={tex}
                      type="button"
                      onClick={() => handleTextureSelect(tex)}
                      className={`p-2 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 shadow-md ring-1 ring-sky-400 text-white'
                          : 'border-slate-800 bg-[#0E1322] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{cfg.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cfg.defaultSurchargeDzd > 0
                          ? `+${cfg.defaultSurchargeDzd} DZD/m²`
                          : 'Sans plus-value'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Chiffrage Plus-Value au m² & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  2. Plus-value Thermolaquage au m² (DZD) :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formPriceM2}
                    onChange={(e) => setFormPriceM2(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0E1322] border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-sky-300 text-sm focus:outline-none focus:border-sky-500 cursor-text"
                  />
                  <span className="text-xs font-mono font-bold text-slate-400">DZD/m²</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Exemple : 300 DZD pour Sablé/Texturé, 0 pour mat ou brillant standard.
                </span>
              </div>

              <div className="flex flex-col justify-center pt-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  3. Disponibilité en Poudre Atelier :
                </label>
                <CustomSwitch
                  checked={formInStock}
                  onChange={setFormInStock}
                  label={formInStock ? 'Poudre en Stock Atelier' : 'Poudre Épuisée'}
                  description={
                    formInStock
                      ? 'Disponible immédiatement pour fabrication'
                      : 'À commander auprès de BPC Algérie'
                  }
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Nuance certifiée officielle Boyasan Powder Coating • Zéro erreur de teinte
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsColorModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <Check size={15} />
                <span>
                  {editingColor
                    ? 'Mettre à jour la Teinte'
                    : 'Activer cette Teinte BPC au Catalogue'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </CustomModal>

      {/* DIALOGUE CONFIRMATION SUPPRESSION COULEUR BPC */}
      <CustomConfirmModal
        isOpen={colorToDelete !== null}
        onClose={() => setColorToDelete(null)}
        onConfirm={() => {
          if (colorToDelete) {
            deleteBpcColor(colorToDelete.id)
            showSaveNotice(`Teinte ${colorToDelete.code} supprimée du catalogue`)
            setColorToDelete(null)
          }
        }}
        title="Supprimer la teinte du catalogue atelier"
        message={
          colorToDelete ? (
            <span>
              Voulez-vous vraiment retirer la teinte{' '}
              <strong className="text-slate-100">{colorToDelete.code}</strong> ({colorToDelete.name}) du catalogue de votre atelier ?
            </span>
          ) : ''
        }
        confirmText="Supprimer de l'atelier"
        cancelText="Annuler"
        variant="danger"
      />

      {/* DIALOGUE CONFIRMATION RÉINITIALISATION USINE */}
      <CustomConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetPricingToDefaults()
          showSaveNotice('Tarifs et catalogue BPC réinitialisés aux valeurs usine.')
          setIsResetConfirmOpen(false)
        }}
        title="Réinitialiser tous les tarifs & catalogue usine"
        message={
          <span>
            Cette action va rétablir l'ensemble des prix des lames, moteurs et le nuancier officiel BPC Algérie aux valeurs de référence initiales.
          </span>
        }
        confirmText="Confirmer la réinitialisation"
        cancelText="Annuler"
        variant="warning"
      />
    </div>
  )
}
