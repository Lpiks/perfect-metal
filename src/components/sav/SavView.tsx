import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { SavTicket, SavIssueType, SavPriority, SavStatus } from '../../types/sav'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { CustomDatePicker } from '../ui/CustomDatePicker'
import {
  LifeBuoy,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Wrench,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react'

export const SavView: React.FC = () => {
  const { savTickets, clients, orders, addSavTicket, resolveSavTicket } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false)
  const [resolvingTicket, setResolvingTicket] = useState<SavTicket | null>(null)

  // Formulaire Nouveau Ticket
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '')
  const [issueType, setIssueType] = useState<SavIssueType>('moteur_bloque')
  const [priority, setPriority] = useState<SavPriority>('normale')
  const [description, setDescription] = useState('')
  const [underWarranty, setUnderWarranty] = useState<boolean>(true)
  const [technician, setTechnician] = useState('Mourad Bouzid')
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0])

  // Formulaire Résolution
  const [resolutionNotes, setResolutionNotes] = useState('Réglage fin de course et lubrification des coulisses.')
  const [partsReplaced, setPartsReplaced] = useState('')
  const [invoicedCost, setInvoicedCost] = useState<number>(0)

  const handleCreateTicket = () => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    addSavTicket({
      clientId: client.id,
      clientName: client.fullName,
      clientPhone: client.phone,
      siteAddress: client.address,
      wilaya: client.wilaya,
      reportedDate: new Date().toISOString().split('T')[0],
      issueType,
      description,
      priority,
      status: 'ouvert',
      underWarranty,
      technicianAssigned: technician,
      scheduledInterventionDate: scheduledDate,
      invoicedCostDzd: 0,
    })

    setIsNewTicketModalOpen(false)
  }

  const handleConfirmResolve = () => {
    if (!resolvingTicket) return
    resolveSavTicket(resolvingTicket.id, resolutionNotes, partsReplaced, invoicedCost)
    setResolvingTicket(null)
  }

  const filteredTickets = savTickets.filter((t) => {
    const matchesSearch =
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.siteAddress.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <LifeBuoy className="text-sky-400" size={22} />
            Service Après-Vente (SAV), Dépannage & Garanties
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Traitez les pannes de moteur, déboîtements de lames, récepteurs radio et retouches de peinture sous garantie.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewTicketModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Plus size={16} />
          Nouveau Ticket SAV
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
            placeholder="Rechercher par ticket, client, description..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Tous les Tickets' },
            { id: 'ouvert', label: 'Ouverts' },
            { id: 'intervention_programmee', label: 'Interventions Prévues' },
            { id: 'resolu', label: 'Résolus' },
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

      {/* Grille des Tickets SAV */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 rounded-2xl bg-[#0B0F1A] border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-[10px] text-sky-400 font-bold block">{ticket.code}</span>
                  <h3 className="text-sm font-bold text-slate-100">{ticket.clientName}</h3>
                  <div className="text-[10px] text-slate-500">{ticket.clientPhone} • {ticket.siteAddress}</div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {ticket.priority === 'urgente' ? (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                      Urgent
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium">
                      Normal
                    </span>
                  )}

                  {ticket.underWarranty ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <ShieldCheck size={11} />
                      Sous Garantie
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold">Hors Garantie</span>
                  )}
                </div>
              </div>

              {/* Problème Déclaré */}
              <div className="p-3 rounded-xl bg-[#0E1322] border border-slate-800/80 my-3 space-y-1.5 text-xs">
                <div className="text-sky-300 font-bold capitalize">
                  {ticket.issueType.replace('_', ' ')}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{ticket.description}</p>
                {ticket.partsReplaced && (
                  <div className="text-[10px] text-emerald-400 font-mono pt-1 border-t border-slate-800">
                    Pièce remplacée : {ticket.partsReplaced}
                  </div>
                )}
              </div>
            </div>

            {/* Pied de Carte */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Clock size={12} />
                <span>Interv. : {ticket.scheduledInterventionDate || ticket.reportedDate}</span>
              </div>

              {ticket.status !== 'resolu' ? (
                <button
                  type="button"
                  onClick={() => {
                    setResolvingTicket(ticket)
                    setResolutionNotes('')
                    setPartsReplaced('')
                    setInvoicedCost(0)
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 cursor-pointer"
                >
                  <Wrench size={12} />
                  <span>Clôturer Panne</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 size={13} />
                  Dépanné
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NOUVEAU TICKET SAV */}
      {isNewTicketModalOpen && (
        <CustomModal
          isOpen={true}
          onClose={() => setIsNewTicketModalOpen(false)}
          title="Créer un Ticket de SAV & Réclamation"
          subtitle="Enregistrez une demande d'intervention technique"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateTicket}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Créer Ticket SAV
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
                label: c.fullName,
                subtitle: `${c.phone} • ${c.address}`,
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomSelect
                label="Type de Problème / Panne *"
                value={issueType}
                onChange={(v) => setIssueType(v as SavIssueType)}
                options={[
                  { value: 'moteur_bloque', label: 'Moteur Bloqué / Fin de course' },
                  { value: 'lame_deboitee', label: 'Lame Déboîtée / Bloquée' },
                  { value: 'telecommande_perdue', label: 'Télécommande / Récepteur' },
                  { value: 'peinture_rayee', label: 'Peinture / Rayure Transport' },
                  { value: 'serrure_grippee', label: 'Serrure ou Sabot de sol' },
                  { value: 'autre', label: 'Autre Intervention' },
                ]}
              />

              <CustomSelect
                label="Priorité d'Intervention"
                value={priority}
                onChange={(v) => setPriority(v as SavPriority)}
                options={[
                  { value: 'normale', label: 'Normale (Sous 48h)' },
                  { value: 'urgente', label: 'Urgente (Sous 24h)' },
                  { value: 'critique', label: 'Critique (Urgence magasin)' },
                ]}
              />
            </div>

            <CustomInput
              label="Description Précise de la Panne *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Le rideau s'arrête à mi-hauteur, bruit sec dans le coffre"
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomSelect
                label="Statut Garantie"
                value={underWarranty ? 'yes' : 'no'}
                onChange={(v) => setUnderWarranty(v === 'yes')}
                options={[
                  { value: 'yes', label: 'Sous Garantie Contractuelle (Gratuit)' },
                  { value: 'no', label: 'Hors Garantie (Facturable)' },
                ]}
              />

              <CustomDatePicker
                label="Date d'Intervention Prévue"
                value={scheduledDate}
                onChange={setScheduledDate}
              />
            </div>
          </div>
        </CustomModal>
      )}

      {/* MODAL CLÔTURER PANNE */}
      {resolvingTicket && (
        <CustomModal
          isOpen={true}
          onClose={() => setResolvingTicket(null)}
          title={`Clôturer le Ticket SAV — ${resolvingTicket.code}`}
          subtitle={`Client : ${resolvingTicket.clientName} • Panne : ${resolvingTicket.issueType.replace('_', ' ')}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setResolvingTicket(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirmer la Réparation
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <CustomInput
              label="Rapport Technique d'Intervention *"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="ex: Réglage de la bague de fin de course, graissage des coulisses"
            />

            <CustomInput
              label="Pièces Remplacées (le cas échéant)"
              value={partsReplaced}
              onChange={(e) => setPartsReplaced(e.target.value)}
              placeholder="ex: Condensateur moteur 12.5µF, 2 lames neuves"
            />

            {!resolvingTicket.underWarranty && (
              <CustomInput
                label="Montant Facturé au Client (DZD)"
                type="number"
                suffix="DZD"
                value={invoicedCost}
                onChange={(e) => setInvoicedCost(Number(e.target.value))}
              />
            )}
          </div>
        </CustomModal>
      )}
    </div>
  )
}
