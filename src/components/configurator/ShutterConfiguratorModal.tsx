import React, { useState, useMemo } from 'react'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { ShutterPreview2D } from './ShutterPreview2D'
import { SlatType, FinishType, ShutterAccessories, ShutterItem } from '../../types/shutter'
import { calculateShutter, SLAT_CATALOG } from '../../utils/shutterMath'
import { formatDZD } from '../../utils/currency'
import { useERPStore } from '../../store/erpStore'
import { Shield, Settings, Sliders, Check, Plus, Palette } from 'lucide-react'

interface ShutterConfiguratorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ShutterConfiguratorModal: React.FC<ShutterConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { clients, createOrder, bpcColors, slatPrices, motorPrices } = useERPStore()

  // 1. Client & Projet
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '')
  const [label, setLabel] = useState('Rideau Façade Principale')
  const [locationTag, setLocationTag] = useState('')
  const [documentType, setDocumentType] = useState<'devis' | 'commande'>('devis')

  // 2. Cotes (mm)
  const [widthClearMm, setWidthClearMm] = useState<number>(3200)
  const [heightClearMm, setHeightClearMm] = useState<number>(2600)

  // 3. Type de Lame & Finition BPC
  const [slatType, setSlatType] = useState<SlatType>('lame_pleine_8_10')
  const [finishType, setFinishType] = useState<FinishType>('thermolaquage_ral')
  const [selectedBpcColorId, setSelectedBpcColorId] = useState<string>(bpcColors[0]?.id || 'bpc-7016-sable')

  // 4. Accessoires
  const [accessories, setAccessories] = useState<ShutterAccessories>({
    coulissesType: 'G60',
    lameFinaleRenforcee: true,
    serrureCentrale: true,
    sabotsSol: true,
    deblocageSecours: true,
    boiteCle: true,
    telecommandesCount: 2,
    parachuteSecurite: false,
    caissonCoffre: true,
  })

  // Quantité
  const [quantity, setQuantity] = useState<number>(1)

  // Objet BPC sélectionné
  const activeBpc = useMemo(
    () => bpcColors.find((c) => c.id === selectedBpcColorId) || bpcColors[0],
    [bpcColors, selectedBpcColorId]
  )

  // Calculs techniques en temps réel avec tarifs dynamiques et BPC surcharge
  const calculations = useMemo(() => {
    return calculateShutter({
      widthClearMm,
      heightClearMm,
      slatType,
      finishType,
      accessories,
      customSlatPricePerM2: slatPrices[slatType],
      customBpcSurchargePerM2: finishType === 'thermolaquage_ral' ? (activeBpc?.pricePerM2Dzd || 0) : 0,
      customMotorPrices: motorPrices,
    })
  }, [widthClearMm, heightClearMm, slatType, finishType, accessories, slatPrices, activeBpc, motorPrices])

  // Options pour le sélecteur client
  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        value: c.id,
        label: c.companyName ? `${c.fullName} (${c.companyName})` : c.fullName,
        subtitle: `${c.city}, ${c.wilaya} • ${c.phone}`,
      })),
    [clients]
  )

  // Options pour type de lame avec prix au m² réel
  const slatOptions = useMemo(
    () =>
      Object.entries(SLAT_CATALOG).map(([key, item]) => {
        const customPrice = slatPrices[key as SlatType] || item.basePricePerM2Dzd
        return {
          value: key,
          label: `${item.name} (${formatDZD(customPrice)}/m²)`,
          subtitle: `${item.thicknessMm} mm • ${item.weightPerM2Kg} kg/m²`,
        }
      }),
    [slatPrices]
  )

  const handleSubmit = () => {
    if (!selectedClientId) return

    const configuredShutter: ShutterItem = {
      id: `shut-${Date.now()}`,
      reference: `PM-RID-${Math.floor(100 + Math.random() * 900)}`,
      label,
      locationTag,
      widthClearMm,
      heightClearMm,
      widthTotalMm: calculations.widthTotalMm,
      heightTotalMm: calculations.heightTotalMm,
      slatType,
      slatThicknessMm: SLAT_CATALOG[slatType].thicknessMm,
      axisDiameterMm: calculations.axisDiameterMm,
      springBoxesCount: calculations.springBoxesCount,
      motorType: calculations.recommendedMotor,
      motorBrand:
        calculations.recommendedMotor === 'central_bi'
          ? 'ACM Titan Bimoteur 380Nm'
          : calculations.recommendedMotor === 'central_mono'
          ? 'ACM Unititan Monomoteur 180Nm'
          : calculations.recommendedMotor === 'lateral_industriel'
          ? 'Moteur Latéral Triphasé 600Nm + Parachute'
          : 'Manuel (Ressorts)',
      motorTorqueNm: calculations.motorTorqueNm,
      finishType,
      bpcColorId: finishType === 'thermolaquage_ral' ? activeBpc?.id : undefined,
      bpcCode: finishType === 'thermolaquage_ral' ? activeBpc?.code : undefined,
      bpcName: finishType === 'thermolaquage_ral' ? activeBpc?.name : undefined,
      bpcHex: finishType === 'thermolaquage_ral' ? activeBpc?.hex : undefined,
      bpcTexture: finishType === 'thermolaquage_ral' ? activeBpc?.texture : undefined,
      ralCode: finishType === 'thermolaquage_ral' ? activeBpc?.code : undefined,
      ralName: finishType === 'thermolaquage_ral' ? activeBpc?.name : undefined,
      ralHex: finishType === 'thermolaquage_ral' ? activeBpc?.hex : undefined,
      ralTexture: finishType === 'thermolaquage_ral' ? (activeBpc?.texture === 'sable' ? 'sable' : activeBpc?.texture === 'mat' ? 'mat' : 'satine') : undefined,
      accessories,
      surfaceM2: calculations.surfaceM2,
      curtainWeightKg: calculations.curtainWeightKg,
      totalWeightKg: calculations.totalWeightKg,
      slatCutLengthMm: calculations.slatCutLengthMm,
      slatCount: calculations.slatCount,
      guideCutLengthMm: calculations.guideCutLengthMm,
      axisCutLengthMm: calculations.axisCutLengthMm,
      rawMaterialCost: calculations.rawMaterialCost,
      powderCoatingCost: calculations.powderCoatingCost,
      motorAccessoriesCost: calculations.motorAccessoriesCost,
      laborFabricationCost: calculations.laborFabricationCost,
      installationCost: 15000,
      unitPriceHT: calculations.unitPriceHT,
      vatRate: 0,
      unitPriceTTC: calculations.unitPriceHT,
      quantity,
      totalTTC: calculations.unitPriceHT * quantity,
    }

    createOrder({
      clientId: selectedClientId,
      documentType,
      items: [configuredShutter],
      siteAddress: locationTag || 'Atelier / Chantier Client',
    })

    onClose()
    if (onSuccess) onSuccess()
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurateur Industriel de Rideaux Métalliques"
      subtitle="Chiffrage technique déterministe, dimensionnement moteur & thermolaquage BPC Algérie"
      maxWidth="5xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Total Net Unitaire (Sans TVA)</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {formatDZD(calculations.unitPriceHT * quantity)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] cursor-pointer transition-all flex items-center gap-2"
            >
              <Check size={16} />
              Générer {documentType === 'devis' ? 'le Devis Chiffré' : 'la Commande Atelier'}
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Saisie des Spécifications (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1 : Client & Désignation */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Shield size={14} className="text-sky-400" />
                1. Client & Chantier
              </span>

              {/* Sélecteur Devis vs Bon de commande */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDocumentType('devis')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    documentType === 'devis'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Devis
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentType('commande')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    documentType === 'commande'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Commande Atelier
                </button>
              </div>
            </div>

            <CustomSelect
              label="Sélectionner le Client *"
              options={clientOptions}
              value={selectedClientId}
              onChange={setSelectedClientId}
              searchable
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Désignation du Rideau"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ex: Rideau Façade, Vitrine..."
              />
              <CustomInput
                label="Localisation / Chantier"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="ex: Villa Hydra, Magasin 2..."
              />
            </div>
          </div>

          {/* Section 2 : Cotes & Profil de Lame */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 space-y-3.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders size={14} className="text-sky-400" />
              2. Dimensions & Tablier
            </span>

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Largeur Claire (Passage) *"
                type="number"
                suffix="mm"
                value={widthClearMm}
                onChange={(e) => setWidthClearMm(Math.max(800, Number(e.target.value)))}
                helpText="Entre coulisses"
              />
              <CustomInput
                label="Hauteur Claire (Sous Linteau) *"
                type="number"
                suffix="mm"
                value={heightClearMm}
                onChange={(e) => setHeightClearMm(Math.max(1000, Number(e.target.value)))}
                helpText="Du sol au linteau"
              />
            </div>

            <CustomSelect
              label="Type de Lame de Tablier *"
              options={slatOptions}
              value={slatType}
              onChange={(val) => setSlatType(val as SlatType)}
            />
          </div>

          {/* Section 3 : Finition & Nuancier RAL Thermolaquage */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                3. Finition Peinture & Thermolaquage au Four
              </span>

              {/* Toggle Brut Galva vs Thermolaquage */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFinishType('brut_galva')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                    finishType === 'brut_galva'
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Galva Brut
                </button>
                <button
                  type="button"
                  onClick={() => setFinishType('thermolaquage_ral')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                    finishType === 'thermolaquage_ral'
                      ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 font-semibold'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Thermolaqué BPC (Boyasan)
                </button>
              </div>
            </div>

            {finishType === 'thermolaquage_ral' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Palette size={13} className="text-sky-400" />
                    Catalogue Teintes BPC Algérie ({bpcColors.length} teintes disponibles) :
                  </label>
                  {activeBpc && (
                    <span className="text-[11px] font-mono text-sky-300">
                      {activeBpc.pricePerM2Dzd > 0 ? `+${formatDZD(activeBpc.pricePerM2Dzd)}/m²` : 'Sans plus-value'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {bpcColors.map((color) => {
                    const isSelected = selectedBpcColorId === color.id
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedBpcColorId(color.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-sky-400 bg-sky-500/15 shadow-[0_0_12px_rgba(14,165,233,0.3)] ring-1 ring-sky-400'
                            : 'border-slate-800 bg-[#0E131F] hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-lg border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-slate-200 truncate">
                            {color.code}
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center justify-between gap-1">
                            <span className="capitalize truncate">{color.texture}</span>
                            {color.pricePerM2Dzd > 0 && (
                              <span className="text-amber-400 font-mono shrink-0">
                                +{color.pricePerM2Dzd}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {activeBpc && (
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: activeBpc.hex }}
                      />
                      <span className="text-slate-300 font-medium">
                        Sélection : <strong className="text-white">{activeBpc.name}</strong> ({activeBpc.series})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {activeBpc.texture}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4 : Accessoires & Options */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Settings size={14} className="text-sky-400" />
              4. Quincaillerie & Équipements de Sécurité
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <label
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer ${
                  accessories.serrureCentrale
                    ? 'border-sky-500/40 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 bg-[#0E131F] text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessories.serrureCentrale}
                  onChange={(e) =>
                    setAccessories({ ...accessories, serrureCentrale: e.target.checked })
                  }
                  className="rounded border-slate-700 text-sky-500 cursor-pointer"
                />
                <span>Serrure Centrale</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer ${
                  accessories.sabotsSol
                    ? 'border-sky-500/40 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 bg-[#0E131F] text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessories.sabotsSol}
                  onChange={(e) => setAccessories({ ...accessories, sabotsSol: e.target.checked })}
                  className="rounded border-slate-700 text-sky-500 cursor-pointer"
                />
                <span>Sabots de Sol</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer ${
                  accessories.deblocageSecours
                    ? 'border-sky-500/40 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 bg-[#0E131F] text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessories.deblocageSecours}
                  onChange={(e) =>
                    setAccessories({ ...accessories, deblocageSecours: e.target.checked })
                  }
                  className="rounded border-slate-700 text-sky-500 cursor-pointer"
                />
                <span>Débrayage Secours</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer ${
                  accessories.boiteCle
                    ? 'border-sky-500/40 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 bg-[#0E131F] text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessories.boiteCle}
                  onChange={(e) => setAccessories({ ...accessories, boiteCle: e.target.checked })}
                  className="rounded border-slate-700 text-sky-500 cursor-pointer"
                />
                <span>Boîte à Clé Extérieure</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer ${
                  accessories.caissonCoffre
                    ? 'border-sky-500/40 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 bg-[#0E131F] text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessories.caissonCoffre}
                  onChange={(e) =>
                    setAccessories({ ...accessories, caissonCoffre: e.target.checked })
                  }
                  className="rounded border-slate-700 text-sky-500 cursor-pointer"
                />
                <span>Coffre d'Habillage</span>
              </label>

              <div className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-[#0E131F]">
                <span className="text-slate-400 text-xs">Télécommandes :</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setAccessories({
                        ...accessories,
                        telecommandesCount: Math.max(0, accessories.telecommandesCount - 1),
                      })
                    }
                    className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sky-400 px-1 text-xs">
                    {accessories.telecommandesCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAccessories({
                        ...accessories,
                        telecommandesCount: accessories.telecommandesCount + 1,
                      })
                    }
                    className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Visualisation 2D & Résumé Technique (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Visualiseur 2D dynamique */}
          <ShutterPreview2D
            widthMm={widthClearMm}
            heightMm={heightClearMm}
            slatType={slatType}
            finishType={finishType}
            ralHex={activeBpc?.hex || '#2E353B'}
            ralCode={activeBpc?.code || 'BPC 7016'}
            motorType={calculations.recommendedMotor}
            hasLock={accessories.serrureCentrale}
            hasBox={accessories.caissonCoffre}
          />

          {/* Fiche Technique Atelier Dérivée */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Données Techniques Atelier</span>
              <span className="font-mono text-sky-400 font-bold">
                {calculations.surfaceM2} m² • {calculations.curtainWeightKg} kg
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Nombre de Lames :</span>
                <span className="font-mono font-bold text-slate-200">{calculations.slatCount} lames</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Coupe Lame Atelier :</span>
                <span className="font-mono font-bold text-sky-300">{calculations.slatCutLengthMm} mm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Axe & Ressorts :</span>
                <span className="font-mono font-bold text-slate-200">
                  Ø{calculations.axisDiameterMm}mm ({calculations.springBoxesCount} boîtes)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Motorisation :</span>
                <span className="font-mono font-bold text-emerald-400">
                  {calculations.recommendedMotor.replace('_', ' ').toUpperCase()} ({calculations.motorTorqueNm} Nm)
                </span>
              </div>
            </div>
          </div>

          {/* Décomposition des Coûts (ERP Transparency - TVA 0%) */}
          <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800 text-xs space-y-2 flex-1">
            <span className="font-semibold text-slate-300 block mb-2">Décomposition du Chiffrage (Net)</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Matière Première (Tablier) :</span>
                <span className="font-mono">{formatDZD(calculations.rawMaterialCost)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Thermolaquage Four BPC :</span>
                <span className="font-mono">{formatDZD(calculations.powderCoatingCost)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Motorisation & Quincaillerie :</span>
                <span className="font-mono">{formatDZD(calculations.motorAccessoriesCost)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fabrication & Assemblage :</span>
                <span className="font-mono">{formatDZD(calculations.laborFabricationCost)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-sky-400">
                <span>Prix Net Total (Sans TVA) :</span>
                <span className="font-mono">{formatDZD(calculations.unitPriceHT)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}
