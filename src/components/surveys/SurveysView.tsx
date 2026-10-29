import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { SiteSurvey } from '../../types/survey'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { CustomDatePicker } from '../ui/CustomDatePicker'
import {
  Ruler,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Building2,
  Printer,
  Compass,
} from 'lucide-react'

export const SurveysView: React.FC = () => {
  const { surveys, clients, addSiteSurvey, updateSiteSurvey, setCurrentView } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedSurveyForPrint, setSelectedSurveyForPrint] = useState<SiteSurvey | null>(null)

  // Form State
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '')
  const [siteAddress, setSiteAddress] = useState('')
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [surveyorName, setSurveyorName] = useState('Redouane (Métreur)')
  const [widthClearMm, setWidthClearMm] = useState<number>(3200)
  const [heightClearMm, setHeightClearMm] = useState<number>(2600)
  const [lintelDepthMm, setLintelDepthMm] = useState<number>(380)
  const [leftEcoinconMm, setLeftEcoinconMm] = useState<number>(100)
  const [rightEcoinconMm, setRightEcoinconMm] = useState<number>(100)
  const [wallMaterial, setWallMaterial] = useState<'beton' | 'brique_creuse' | 'ipn_acier' | 'pierre'>('beton')
  const [power220vAvailable, setPower220vAvailable] = useState<boolean>(true)
  const [windingDirection, setWindingDirection] = useState<'interieur' | 'exterieur'>('interieur')
  const [notes, setNotes] = useState('')

  const handleCreateSurvey = () => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    addSiteSurvey({
      clientId: client.id,
      clientName: client.fullName,
      clientPhone: client.phone,
      siteAddress: siteAddress || client.address,
      wilaya: client.wilaya,
      surveyDate,
      surveyorName,
      widthClearMm,
      heightClearMm,
      lintelDepthMm,
      leftEcoinconMm,
      rightEcoinconMm,
      wallMaterial,
      power220vAvailable,
      windingDirection,
      hasObstacles: false,
      notes,
      status: 'realise',
    })

    setIsCreateModalOpen(false)
  }

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.siteAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surveyorName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Ruler className="text-sky-400" size={22} />
            Prise de Cotes & Métré Chantier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Relevés géométriques sur site : largeur sous linteau, écoinçons, retombées de coffre et alimentation électrique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Plus size={16} />
          Nouveau Relevé de Cotes
        </button>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F1A] p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par n° de métré, client, adresse, métreur..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tous les Relevés' },
            { id: 'realise', label: 'Cotes Validées' },
            { id: 'a_faire', label: 'À Visiter' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                statusFilter === f.id
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-[#0E1322] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des Fiches de Métré */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-[10px] text-sky-400 font-bold block">{survey.code}</span>
                  <h3 className="text-sm font-bold text-slate-100">{survey.clientName}</h3>
                  <span className="text-[10px] text-slate-500">{survey.siteAddress} • {survey.wilaya}</span>
                </div>

                {survey.status === 'realise' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <CheckCircle2 size={11} />
                    Relevé Validé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                    <Clock size={11} />
                    À Visiter
                  </span>
                )}
              </div>

              {/* Bloc des Cotes Précises en mm */}
              <div className="p-3 rounded-xl bg-[#0E1322] border border-slate-800/80 my-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Largeur Claire :</span>
                    <span className="font-bold text-sky-300">{survey.widthClearMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hauteur Claire :</span>
                    <span className="font-bold text-sky-300">{survey.heightClearMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Retombée Linteau :</span>
                    <span className="font-bold text-slate-200">{survey.lintelDepthMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Écoinçons G / D :</span>
                    <span className="font-bold text-slate-200">{survey.leftEcoinconMm} / {survey.rightEcoinconMm} mm</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} className="text-slate-500" />
                    <span className="capitalize">{survey.wallMaterial.replace('_', ' ')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={12} className={survey.power220vAvailable ? 'text-amber-400' : 'text-slate-600'} />
                    <span>{survey.power220vAvailable ? '220V Présent' : 'Pas de 220V'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Compass size={12} className="text-slate-500" />
                    <span className="capitalize">{survey.windingDirection}</span>
                  </span>
                </div>
              </div>

              {survey.notes && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2">« {survey.notes} »</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-[10px] text-slate-500">Par {survey.surveyorName}</span>
              <button
                type="button"
                onClick={() => {
                  alert(`Cotes de ${survey.code} (${survey.widthClearMm}×${survey.heightClearMm}mm) copiées pour le chiffrage ! Vous pouvez ouvrir le configurateur.`)
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-bold border border-sky-500/30 cursor-pointer transition-all"
              >
                <span>Chiffrer Rideau</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NOUVELLE PRIS DE COTES */}
      {isCreateModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title="Fiche Technique de Métré & Visite Chantier"
          subtitle="Relevez les dimensions précises et contraintes structurelles"
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
                onClick={handleCreateSurvey}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Enregistrer le Métré
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomSelect
              label="Client Concerné *"
              value={clientId}
              onChange={setClientId}
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.fullName} (${c.city})`,
                subtitle: c.phone,
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Adresse du Chantier"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="ex: Villa Hydra, Rue 12"
              />
              <CustomInput
                label="Nom du Métreur / Visiteur"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E1322] border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Mesures au Millimètre Près (mm) :
              </span>

              <div className="grid grid-cols-2 gap-3">
                <CustomInput
                  label="Largeur Claire (Passage) *"
                  type="number"
                  suffix="mm"
                  value={widthClearMm}
                  onChange={(e) => setWidthClearMm(Number(e.target.value))}
                />
                <CustomInput
                  label="Hauteur Claire (Sol/Linteau) *"
                  type="number"
                  suffix="mm"
                  value={heightClearMm}
                  onChange={(e) => setHeightClearMm(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <CustomInput
                  label="Retombée Linteau"
                  type="number"
                  suffix="mm"
                  value={lintelDepthMm}
                  onChange={(e) => setLintelDepthMm(Number(e.target.value))}
                  helpText="Hauteur pour coffre"
                />
                <CustomInput
                  label="Écoinçon Gauche"
                  type="number"
                  suffix="mm"
                  value={leftEcoinconMm}
                  onChange={(e) => setLeftEcoinconMm(Number(e.target.value))}
                />
                <CustomInput
                  label="Écoinçon Droit"
                  type="number"
                  suffix="mm"
                  value={rightEcoinconMm}
                  onChange={(e) => setRightEcoinconMm(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <CustomSelect
                label="Nature du Support"
                value={wallMaterial}
                onChange={(v) => setWallMaterial(v as any)}
                options={[
                  { value: 'beton', label: 'Béton Armé' },
                  { value: 'brique_creuse', label: 'Brique Creuse' },
                  { value: 'ipn_acier', label: 'IPN / Structure Acier' },
                  { value: 'pierre', label: 'Pierre / Maçonnerie' },
                ]}
              />

              <CustomSelect
                label="Alimentation 220V"
                value={power220vAvailable ? 'yes' : 'no'}
                onChange={(v) => setPower220vAvailable(v === 'yes')}
                options={[
                  { value: 'yes', label: '220V Déjà Tiré' },
                  { value: 'no', label: 'À Prévoir par Client' },
                ]}
              />

              <CustomSelect
                label="Enroulement"
                value={windingDirection}
                onChange={(v) => setWindingDirection(v as any)}
                options={[
                  { value: 'interieur', label: 'Intérieur' },
                  { value: 'exterieur', label: 'Sous Linteau / Extérieur' },
                ]}
              />
            </div>

            <CustomInput
              label="Observations / Contraintes Particulières"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Faux-aplomb mur gauche de 15mm, prévoir calage"
            />
          </div>
        </CustomModal>
      )}
    </div>
  )
}
