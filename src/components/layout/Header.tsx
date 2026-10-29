import React from 'react'
import { useERPStore, ERPView } from '../../store/erpStore'
import { formatDZD } from '../../utils/currency'
import { Plus, Bell, Shield, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface HeaderProps {
  onOpenConfigurator: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfigurator }) => {
  const { currentView, orders, suppliers } = useERPStore()

  const viewTitles: Record<ERPView, { title: string; subtitle: string }> = {
    dashboard: { title: 'Tableau de Bord Général', subtitle: 'Atelier Perfect Metal • Vue synthétique' },
    configurator: { title: 'Configurateur Rideaux CPQ', subtitle: 'Calcul de calepinage et dimensionnement' },
    kanban: { title: 'Suivi de Fabrication Atelier', subtitle: 'Découpe, profilage, thermolaquage et montage' },
    installations: { title: 'Planning des Poses & PV de Réception', subtitle: 'Affectation des équipes monteurs et PV de conformité' },
    surveys: { title: 'Fiches de Métré & Cotes Chantier', subtitle: 'Relevés géométriques, linteaux et contraintes 220V' },
    orders: { title: 'Commandes, Devis & Factures', subtitle: 'Gestion commerciale et facturation pro' },
    clients: { title: 'Carnet Clients & Suivi Créances', subtitle: 'Particuliers, commerces et revendeurs B2B' },
    suppliers: { title: 'Fournisseurs & Dettes Matière', subtitle: 'Bobines tôle, moteurs ACM, poudres et règlements' },
    inventory: { title: 'Stocks & Poudres RAL', subtitle: 'Matières premières, bobines galva et moteurs' },
    sav: { title: 'SAV, Dépannage & Garanties', subtitle: 'Tickets pannes, réclamations et réparations sous garantie' },
    finance: { title: 'Trésorerie & Marges Brutes', subtitle: 'Recouvrement des créances et rentabilité nette' },
    settings: { title: 'Paramètres & Sauvegardes', subtitle: 'Configuration locale et sécurité des données' },
  }

  const currentInfo = viewTitles[currentView] || viewTitles.dashboard

  const totalOutstanding = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.balanceDue : 0), 0)
  const totalSupplierDebt = suppliers.reduce((sum, s) => sum + s.balanceDueDzd, 0)

  return (
    <header className="h-16 px-6 bg-[#090D17] border-b border-slate-800/80 flex items-center justify-between select-none shrink-0 no-print">
      {/* Titre de la vue */}
      <div>
        <h2 className="text-base font-bold text-slate-100">{currentInfo.title}</h2>
        <p className="text-[11px] text-slate-400">{currentInfo.subtitle}</p>
      </div>

      {/* Actions Droite */}
      <div className="flex items-center gap-4">
        {/* Date du jour */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1424] border border-slate-800 text-xs text-slate-300">
          <Calendar size={13} className="text-sky-400" />
          <span className="capitalize">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</span>
        </div>

        {/* Pilule Dettes Fournisseurs */}
        {totalSupplierDebt > 0 && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Dettes Fournisseurs : </span>
            <strong className="font-mono text-amber-400">{formatDZD(totalSupplierDebt)}</strong>
          </div>
        )}

        {/* Pilule Créance Clients */}
        {totalOutstanding > 0 && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Créances Clients : </span>
            <strong className="font-mono text-rose-400">{formatDZD(totalOutstanding)}</strong>
          </div>
        )}

        {/* Bouton Rapide Nouveau Rideau */}
        <button
          type="button"
          onClick={onOpenConfigurator}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nouveau Rideau</span>
        </button>
      </div>
    </header>
  )
}
