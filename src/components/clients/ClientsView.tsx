import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { Client, ClientCategory } from '../../types/client'
import { ClientCategoryBadge } from '../ui/CustomBadge'
import { formatDZD } from '../../utils/currency'
import { CustomModal } from '../ui/CustomModal'
import { CustomInput } from '../ui/CustomInput'
import { CustomSelect } from '../ui/CustomSelect'
import { Users, Plus, Phone, MapPin, Search, Edit2, Trash2, ArrowUpRight } from 'lucide-react'

export const ClientsView: React.FC = () => {
  const { clients, orders, addClient, updateClient, deleteClient, setCurrentView } = useERPStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null)

  // Form State
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [wilaya, setWilaya] = useState('16 - Alger')
  const [category, setCategory] = useState<ClientCategory>('particulier')
  const [notes, setNotes] = useState('')

  const handleOpenCreate = () => {
    setFullName('')
    setCompanyName('')
    setPhone('')
    setEmail('')
    setAddress('')
    setCity('')
    setWilaya('16 - Alger')
    setCategory('particulier')
    setNotes('')
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c)
    setFullName(c.fullName)
    setCompanyName(c.companyName || '')
    setPhone(c.phone)
    setEmail(c.email || '')
    setAddress(c.address)
    setCity(c.city)
    setWilaya(c.wilaya)
    setCategory(c.category)
    setNotes(c.notes || '')
  }

  const handleSaveClient = () => {
    if (!fullName || !phone) return

    if (editingClient) {
      updateClient(editingClient.id, {
        fullName,
        companyName,
        phone,
        email,
        address,
        city,
        wilaya,
        category,
        notes,
      })
      setEditingClient(null)
    } else {
      addClient({
        fullName,
        companyName,
        phone,
        email,
        address,
        city,
        wilaya,
        category,
        notes,
      })
      setIsCreateModalOpen(false)
    }
  }

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.wilaya.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Users className="text-sky-400" size={22} />
            Carnet Clients & Suivi des Créances
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos particuliers (villas), commerçants, revendeurs pro et promoteurs BTP avec solde en temps réel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Plus size={16} />
          Nouveau Client
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
            placeholder="Rechercher par nom, entreprise, téléphone, wilaya..."
            className="w-full bg-[#0E1322] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Toutes Catégories' },
            { id: 'particulier', label: 'Particuliers (Villas)' },
            { id: 'commerce', label: 'Commerces' },
            { id: 'revendeur_pro', label: 'Revendeurs Pro' },
            { id: 'promoteur_btp', label: 'Promoteurs BTP' },
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

      {/* Grille des Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          return (
            <div
              key={client.id}
              className="bg-[#0B0F1A] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4.5 flex flex-col justify-between gap-4 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-sky-400 font-bold">{client.code}</span>
                    <h3 className="text-sm font-bold text-slate-100 truncate">{client.fullName}</h3>
                    {client.companyName && (
                      <span className="text-xs text-slate-400 font-medium">{client.companyName}</span>
                    )}
                  </div>
                  <ClientCategoryBadge category={client.category} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-500" />
                    <span className="font-mono text-slate-300">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-500 shrink-0" />
                    <span className="truncate">
                      {client.city}, {client.wilaya}
                    </span>
                  </div>
                  {client.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1">{client.notes}</p>
                  )}
                </div>
              </div>

              {/* Bilan Financier du Client */}
              <div className="bg-[#0E1322] p-3 rounded-xl border border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Commandé :</span>
                  <span className="font-mono text-slate-200 font-bold">
                    {formatDZD(client.totalBilled)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Encaissé :</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {formatDZD(client.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1">
                  <span className={client.balanceDue > 0 ? 'text-rose-400' : 'text-slate-400'}>
                    Créance / Reste Dû :
                  </span>
                  <span
                    className={`font-mono ${
                      client.balanceDue > 0 ? 'text-rose-400 font-black' : 'text-slate-500'
                    }`}
                  >
                    {formatDZD(client.balanceDue)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedClientForDetails(client)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Historique ({client.totalOrders} chantiers)</span>
                  <ArrowUpRight size={13} />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Confirmez-vous la suppression de ${client.fullName} ?`)) {
                        deleteClient(client.id)
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL CRÉATION / MODIFICATION CLIENT */}
      {(isCreateModalOpen || editingClient) && (
        <CustomModal
          isOpen={true}
          onClose={() => {
            setIsCreateModalOpen(false)
            setEditingClient(null)
          }}
          title={editingClient ? `Modifier ${editingClient.fullName}` : 'Ajouter un Nouveau Client'}
          subtitle="Renseignez les coordonnées et informations de facturation"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setEditingClient(null)
                }}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveClient}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                {editingClient ? 'Enregistrer les Modifications' : 'Créer la Fiche Client'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Nom & Prénom / Contact *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: M. Karim Amrani"
              />
              <CustomInput
                label="Raison Sociale / Société"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="ex: SARL Prom-Immo"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Téléphone Principal *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550 12 34 56"
              />
              <CustomInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@client.dz"
              />
            </div>

            <CustomSelect
              label="Catégorie de Client *"
              value={category}
              onChange={(v) => setCategory(v as ClientCategory)}
              options={[
                { value: 'particulier', label: 'Particulier (Villa / Garage résidentiel)' },
                { value: 'commerce', label: 'Commerce (Vitrines / Boutiques / Rideaux micro-perforés)' },
                { value: 'revendeur_pro', label: 'Revendeur Pro & Artisan Poseur (Tarifs préférentiels)' },
                { value: 'promoteur_btp', label: 'Promoteur BTP & Entreprise' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Ville / Commune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ex: Zéralda, Hydra, Blida..."
              />
              <CustomInput
                label="Wilaya"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                placeholder="16 - Alger"
              />
            </div>

            <CustomInput
              label="Adresse Complète du Chantier"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ex: Lotissement Les Pins, Lot N° 14"
            />

            <CustomInput
              label="Notes & Préférences Métier"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Exige toujours thermolaquage RAL 7016 sablé, paiement 50% commande..."
            />
          </div>
        </CustomModal>
      )}

      {/* MODAL HISTORIQUE DU CLIENT */}
      {selectedClientForDetails && (
        <CustomModal
          isOpen={true}
          onClose={() => setSelectedClientForDetails(null)}
          title={`Historique Client : ${selectedClientForDetails.fullName}`}
          subtitle={`${selectedClientForDetails.city}, ${selectedClientForDetails.wilaya} • ${selectedClientForDetails.phone}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-xs">
                Créance actuelle :{' '}
                <strong
                  className={
                    selectedClientForDetails.balanceDue > 0 ? 'text-rose-400 font-mono font-black' : 'text-emerald-400'
                  }
                >
                  {formatDZD(selectedClientForDetails.balanceDue)}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientForDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Chantiers & Commandes Réalisés :
            </h4>

            {orders.filter((o) => o.clientId === selectedClientForDetails.id).length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Aucune commande enregistrée pour ce client pour le moment.
              </div>
            ) : (
              <div className="space-y-2">
                {orders
                  .filter((o) => o.clientId === selectedClientForDetails.id)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-[#0A0D16] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-sky-400">{order.code}</span>
                        <span className="text-slate-300">{order.siteAddress}</span>
                        <span className="text-[10px] text-slate-500">
                          {order.createdAt.slice(0, 10)} • {order.items[0]?.label}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-200">{formatDZD(order.totalTTC)}</div>
                        <div className="text-[10px] text-slate-400">
                          Encaissé : <strong className="text-emerald-400">{formatDZD(order.totalPaid)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CustomModal>
      )}
    </div>
  )
}
