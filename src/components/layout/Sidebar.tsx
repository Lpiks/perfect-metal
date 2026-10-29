import React from 'react'
import { useERPStore, ERPView } from '../../store/erpStore'
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Users,
  Boxes,
  TrendingUp,
  Settings,
  Plus,
  Truck,
  Ruler,
  Factory,
  LifeBuoy,
} from 'lucide-react'

interface SidebarProps {
  onOpenConfigurator: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenConfigurator }) => {
  const { currentView, setCurrentView, orders, inventory, installations, savTickets } = useERPStore()

  const inProductionCount = orders.filter(
    (o) => o.status === 'actif' && o.productionStage !== 'livre_pose' && o.documentType !== 'devis'
  ).length

  const pendingPoseCount = installations.filter((i) => i.status !== 'pose_terminee').length
  const criticalStockCount = inventory.filter((i) => i.currentStock <= i.minimumStock).length
  const openSavCount = savTickets.filter((s) => s.status !== 'resolu').length

  const navItems: { id: ERPView; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Vue Générale', icon: <LayoutDashboard size={17} /> },
    {
      id: 'kanban',
      label: 'Atelier & Débit',
      icon: <Wrench size={17} />,
      badge: inProductionCount > 0 ? inProductionCount : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'installations',
      label: 'Pose & Chantiers',
      icon: <Truck size={17} />,
      badge: pendingPoseCount > 0 ? pendingPoseCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    { id: 'surveys', label: 'Métré & Cotes', icon: <Ruler size={17} /> },
    { id: 'orders', label: 'Commandes & Devis', icon: <FileText size={17} /> },
    { id: 'clients', label: 'Clients & Créances', icon: <Users size={17} /> },
    {
      id: 'suppliers',
      label: 'Fournisseurs & Dettes',
      icon: <Factory size={17} />,
    },
    {
      id: 'inventory',
      label: 'Stocks & Poudres RAL',
      icon: <Boxes size={17} />,
      badge: criticalStockCount > 0 ? '!' : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'sav',
      label: 'SAV & Dépannage',
      icon: <LifeBuoy size={17} />,
      badge: openSavCount > 0 ? openSavCount : undefined,
      badgeColor: 'bg-rose-500/80 text-white',
    },
    { id: 'finance', label: 'Trésorerie & Marges', icon: <TrendingUp size={17} /> },
    { id: 'settings', label: 'Paramètres & Backup', icon: <Settings size={17} /> },
  ]

  return (
    <aside className="w-64 bg-[#080B12] border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0 no-print h-screen overflow-hidden">
      {/* Haut : Logo & Marque */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <img
            src="./logo.jpg"
            alt="PERFECT METAL"
            className="w-10 h-10 rounded-xl object-contain border border-sky-500/30 shadow-md shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-wider text-white">PERFECT METAL</span>
            <span className="text-[10px] text-sky-400 font-semibold tracking-widest uppercase">
              ERP INDUSTRIEL
            </span>
          </div>
        </div>

        {/* Bouton Rapide Nouveau Rideau */}
        <div className="p-3">
          <button
            type="button"
            onClick={onOpenConfigurator}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/25 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>Nouveau Rideau (CPQ)</span>
          </button>
        </div>

        {/* Menu de Navigation */}
        <nav className="px-2.5 py-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-sky-400' : 'text-slate-500'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bas : Indicateur Hors-Ligne & Version */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#06080E] shrink-0">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-200">100% Hors-Ligne</span>
            <span className="text-[10px] text-slate-500">Base Locale • v1.2.0</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
