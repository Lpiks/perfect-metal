import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { InstallationJob, InstallationStatus } from '../../types/installation'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { CustomDatePicker } from '../ui/CustomDatePicker'
import { PvReceptionDocument } from './PvReceptionDocument'
import {
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  FileCheck2,
  UserCheck,
  AlertCircle,
  Plus,
  Search,
  Star,
} from 'lucide-react'

export const InstallationsView: React.FC = () => {
  const { installations, teams, orders, signPvInstallation, updateInstallationJob, addInstallationJob } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [viewingPvJob, setViewingPvJob] = useState<InstallationJob | null>(null)
  const [signingJob, setSigningJob] = useState<InstallationJob | null>(null)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  // Formulaire Signature PV
  const [rating, setRating] = useState<number>(5)
  const [collectedAmount, setCollectedAmount] = useState<number>(0)
  const [pvNotes, setPvNotes] = useState('Chantier exécuté avec succès. Client très satisfait.')

  // Formulaire Nouvelle Planification
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '')
  const [planDate, setPlanDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [planTime, setPlanTime] = useState<string>('09:00')

  const handleOpenSign = (job: InstallationJob) => {
    setSigningJob(job)
    setCollectedAmount(job.balanceToCollectDzd)
    setRating(5)
    setPvNotes('Pose conforme, fin de course et télécommandes validées.')
  }

  const handleConfirmSign = () => {
    if (!signingJob) return
    signPvInstallation(signingJob.id, rating, pvNotes, collectedAmount)
    setSigningJob(null)
  }

  const handleCreateJob = () => {
    const order = orders.find((o) => o.id === selectedOrderId)
    const team = teams.find((t) => t.id === selectedTeamId)
    if (!order) return

    const firstItem = order.items[0]

    addInstallationJob({
      orderId: order.id,
      orderCode: order.code,
      clientId: order.clientId,
      clientName: order.clientName,
      clientPhone: order.clientPhone,
      siteAddress: order.siteAddress,
      wilaya: order.clientWilaya,
      scheduledDate: planDate,
      scheduledTime: planTime,
      teamId: team?.id,
      teamName: team?.name,
      shutterSummary: firstItem ? `${firstItem.label} (${firstItem.widthClearMm}×${firstItem.heightClearMm}mm)` : 'Rideau',
      balanceToCollectDzd: order.balanceDue,
      status: 'planifie',
      pvSigned: false,
    })

    setIsPlanModalOpen(false)
  }

  const filteredJobs = installations.filter((j) => {
    const matchesSearch =
      j.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.siteAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.orderCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (viewingPvJob) {
    return (
      <PvReceptionDocument
        job={viewingPvJob}
        onBack={() => setViewingPvJob(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Truck className="text-sky-400" size={22} />
            Planning des Poses & PV de Réception Chantier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ordonnancez les équipes de monteurs sur les villas et magasins, générez les PV de pose et encaissez les soldes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlanModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Plus size={16} />
          Planifier une Pose
        </button>
      </div>

      {/* Cartes des Équipes de Poseurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 rounded-2xl bg-[#0B0F1A] border border-slate-800 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-xs font-bold text-slate-100">{team.name}</h3>
              </div>
              <p className="text-[11px] text-slate-400">Responsable : <strong className="text-slate-200">{team.leaderName}</strong></p>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span>Tél : {team.phone}</span>
                <span>• Véhicule : {team.vehiclePlate}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xl font-black text-sky-400 block">{team.activeJobsCount}</span>
              <span className="text-[10px] text-slate-500">poses planifiées</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F1A] p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par code pose, client, adresse, commande..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Toutes les Poses' },
            { id: 'a_planifier', label: 'À Planifier' },
            { id: 'planifie', label: 'Planifiées' },
            { id: 'pose_terminee', label: 'Terminées (PV Signé)' },
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

      {/* Tableau des Chantiers de Pose */}
      <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0E1424] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-left">N° Pose & Commande</th>
                <th className="p-3.5 text-left">Client & Destination</th>
                <th className="p-3.5 text-center">Date & Heure</th>
                <th className="p-3.5 text-left">Équipe Affectée</th>
                <th className="p-3.5 text-right font-mono">Solde à Encaisser</th>
                <th className="p-3.5 text-center">État & PV</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune pose ne correspond aux filtres.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#0E1322]/80 transition-colors">
                    {/* Code & Commande */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-sky-400 text-xs">{job.code}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Réf : {job.orderCode}</div>
                    </td>

                    {/* Client & Adresse */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-100">{job.clientName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{job.siteAddress}</div>
                      <div className="text-[10px] text-slate-500">{job.clientPhone} • {job.wilaya}</div>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-center">
                      <div className="font-mono font-bold text-slate-200">{job.scheduledDate}</div>
                      {job.scheduledTime && (
                        <span className="text-[10px] text-slate-400">{job.scheduledTime}</span>
                      )}
                    </td>

                    {/* Équipe */}
                    <td className="p-3.5">
                      <span className="text-slate-300 font-medium">{job.teamName || 'Non assignée'}</span>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{job.shutterSummary}</div>
                    </td>

                    {/* Solde */}
                    <td className="p-3.5 text-right font-mono font-bold">
                      <span className={job.balanceToCollectDzd > 0 ? 'text-amber-400' : 'text-slate-500'}>
                        {formatDZD(job.balanceToCollectDzd)}
                      </span>
                    </td>

                    {/* Statut & PV */}
                    <td className="p-3.5 text-center">
                      {job.pvSigned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 size={11} />
                          PV Signé ({job.clientRating || 5}/5 ★)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                          <Clock size={11} />
                          En Attente Pose
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Imprimer PV */}
                        <button
                          type="button"
                          onClick={() => setViewingPvJob(job)}
                          title="Imprimer PV de Réception A4"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 cursor-pointer transition-colors"
                        >
                          <Printer size={14} />
                        </button>

                        {/* Valider PV & Encaisser */}
                        {!job.pvSigned && (
                          <button
                            type="button"
                            onClick={() => handleOpenSign(job)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[10px] cursor-pointer transition-all shadow-sm"
                          >
                            <FileCheck2 size={12} />
                            <span>Signer PV</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PLANIFIER UNE POSE */}
      {isPlanModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsPlanModalOpen(false)}
          title="Planifier une Nouvelle Pose sur Chantier"
          subtitle="Assignez l'équipe de monteurs et fixez la date d'intervention"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateJob}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Enregistrer la Pose
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomSelect
              label="Sélectionner la Commande / Chantier *"
              value={selectedOrderId}
              onChange={setSelectedOrderId}
              options={orders.map((o) => ({
                value: o.id,
                label: `${o.code} — ${o.clientName}`,
                subtitle: `${o.siteAddress} • Reste dû : ${formatDZD(o.balanceDue)}`,
              }))}
            />

            <CustomSelect
              label="Équipe de Poseurs Affectée *"
              value={selectedTeamId}
              onChange={setSelectedTeamId}
              options={teams.map((t) => ({
                value: t.id,
                label: t.name,
                subtitle: `Chef : ${t.leaderName} • ${t.vehiclePlate}`,
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomDatePicker
                label="Date d'Intervention *"
                value={planDate}
                onChange={setPlanDate}
              />
              <CustomInput
                label="Heure Prévue"
                type="time"
                value={planTime}
                onChange={(e) => setPlanTime(e.target.value)}
              />
            </div>
          </div>
        </CustomModal>
      )}

      {/* MODAL SIGNER LE PV DE RÉCEPTION */}
      {signingJob && (
        <CustomModal
          isOpen={true}
          onClose={() => setSigningJob(null)}
          title={`Validation Pose & PV de Réception — ${signingJob.code}`}
          subtitle={`Client : ${signingJob.clientName} • Chantier : ${signingJob.siteAddress}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setSigningJob(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSign}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Valider & Déclencher la Garantie
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#0A0D16] border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Solde Prévu sur Chantier :</span>
                <span className="font-mono font-bold text-slate-200">{formatDZD(signingJob.balanceToCollectDzd)}</span>
              </div>
            </div>

            <CustomInput
              label="Montant Encaissé par les Poseurs sur Site (DZD)"
              type="number"
              suffix="DZD"
              value={collectedAmount}
              onChange={(e) => setCollectedAmount(Number(e.target.value))}
            />

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Note de Satisfaction du Client (1 à 5 Étoiles) :
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${
                      rating >= s
                        ? 'bg-amber-400/20 border border-amber-400 text-amber-300 shadow-md shadow-amber-400/10'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <CustomInput
              label="Remarques PV de Pose / Conformité"
              value={pvNotes}
              onChange={(e) => setPvNotes(e.target.value)}
            />
          </div>
        </CustomModal>
      )}
    </div>
  )
}
