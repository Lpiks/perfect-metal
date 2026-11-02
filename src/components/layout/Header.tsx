import React from 'react'
import { useERPStore, ERPView } from '../../store/erpStore'
import { formatDZD } from '../../utils/currency'
import { Plus, Calendar, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface HeaderProps {
  onOpenConfigurator: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfigurator }) => {
  const { currentView, orders, suppliers, isSidebarCollapsed, toggleSidebar } = useERPStore()

  const viewTitles: Record<ERPView, { title: string; subtitle: string }> = {
    dashboard: { title: 'Tableau de Bord Général', subtitle: 'Atelier Perfect Metal • Vue synthétique' },
    configurator: { title: 'Configurateur Rideaux CPQ', subtitle: 'Calcul de calepinage et dimensionnement' },
    kanban: { title: 'Suivi de Fabrication Atelier', subtitle: 'Découpe, profilage, thermolaquage et montage' },
    installations: { title: 'Planning des Poses & PV', subtitle: 'Affectation des équipes monteurs et PV de conformité' },
    surveys: { title: 'Fiches de Métré & Cotes', subtitle: 'Relevés géométriques, linteaux et contraintes 220V' },
    orders: { title: 'Commandes, Devis & Factures', subtitle: 'Gestion commerciale et facturation pro' },
    clients: { title: 'Carnet Clients & Créances', subtitle: 'Particuliers, commerces et revendeurs B2B' },
    suppliers: { title: 'Fournisseurs & Dettes', subtitle: 'Bobines tôle, moteurs ACM, poudres et règlements' },
    inventory: { title: 'Stocks & Poudres RAL', subtitle: 'Matières premières, bobines galva et moteurs' },
    sav: { title: 'SAV, Dépannage & Garanties', subtitle: 'Tickets pannes, réclamations et réparations sous garantie' },
    finance: { title: 'Trésorerie & Marges Brutes', subtitle: 'Recouvrement des créances et rentabilité nette' },
    settings: { title: 'Paramètres & Sauvegardes', subtitle: 'Configuration locale et sécurité des données' },
  }

  const currentInfo = viewTitles[currentView] || viewTitles.dashboard

  const totalOutstanding = orders.reduce((sum, o) => sum + (o.status === 'actif' ? o.balanceDue : 0), 0)
  const totalSupplierDebt = suppliers.reduce((sum, s) => sum + s.balanceDueDzd, 0)

  return (
    <header className="h-14 min-h-[56px] px-4 md:px-6 bg-[#090D17] border-b border-slate-800/80 flex items-center justify-between select-none shrink-0 no-print gap-3">
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-400 border border-slate-800 cursor-pointer transition-colors shrink-0"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        <div className="flex flex-col justify-center min-w-0">
          <h2 className="text-sm font-bold text-slate-100 truncate tracking-tight leading-tight">
            {currentInfo.title}
          </h2>
          <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date, Metrics Pills & Compact Quick Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Date Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F1424] border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap shrink-0">
          <Calendar size={12} className="text-sky-400 shrink-0" />
          <span className="capitalize">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</span>
        </div>

        {/* Supplier Debt Pill - Guaranteed No Wrap */}
        {totalSupplierDebt > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-400">Dettes Fourn. :</span>
            <strong className="font-mono text-amber-300 font-semibold">{formatDZD(totalSupplierDebt)}</strong>
          </div>
        )}

        {/* Customer Receivables Pill - Guaranteed No Wrap */}
        {totalOutstanding > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <span className="text-slate-400">Créances Clients :</span>
            <strong className="font-mono text-rose-300 font-semibold">{formatDZD(totalOutstanding)}</strong>
          </div>
        )}

        {/* Quick Compact Action Button */}
        <button
          type="button"
          onClick={onOpenConfigurator}
          title="Nouveau Rideau (Chiffrage CPQ)"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-sky-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus size={14} className="shrink-0" />
          <span className="hidden sm:inline">Nouveau Rideau</span>
        </button>
      </div>
    </header>
  )
}
