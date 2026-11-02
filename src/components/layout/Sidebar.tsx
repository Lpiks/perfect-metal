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
  const { currentView, setCurrentView, orders, inventory, installations, savTickets, isSidebarCollapsed } = useERPStore()

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
    <aside
      className={`bg-[#080B12] border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0 no-print h-full overflow-hidden transition-all duration-200 ease-in-out ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top: Logo & Nav items */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Brand header */}
        <div className={`border-b border-slate-800/80 flex items-center gap-3 ${isSidebarCollapsed ? 'p-3 justify-center' : 'p-3.5'}`}>
          <img
            src="./logo.jpg"
            alt="PERFECT METAL"
            className="w-9 h-9 rounded-xl object-contain border border-sky-500/30 shadow-md shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-black text-xs tracking-wider text-white truncate">PERFECT METAL</span>
              <span className="text-[9px] text-sky-400 font-semibold tracking-widest uppercase truncate">
                ERP INDUSTRIEL
              </span>
            </div>
          )}
        </div>

        {/* Quick CPQ Action Button */}
        <div className="p-2.5">
          <button
            type="button"
            onClick={onOpenConfigurator}
            title="Nouveau Rideau (CPQ)"
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] ${
              isSidebarCollapsed ? 'h-9 px-0' : 'px-3 py-2'
            }`}
          >
            <Plus size={15} className="shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Nouveau Rideau</span>}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="px-2 py-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer relative group ${
                  isSidebarCollapsed ? 'justify-center h-9 px-0' : 'justify-between px-3 py-2'
                } ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.1)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className={`flex items-center gap-2.5 truncate ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <span className={`shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span className="truncate text-[11px]">{item.label}</span>}
                </div>

                {item.badge !== undefined && (
                  isSidebarCollapsed ? (
                    <span
                      className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ring-[#080B12] ${
                        item.badgeColor || 'bg-sky-500'
                      }`}
                    />
                  ) : (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold leading-none shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom: Offline & Version indicator */}
      <div className={`border-t border-slate-800/80 bg-[#06080E] ${isSidebarCollapsed ? 'p-2.5 flex justify-center' : 'p-3'}`}>
        <div className={`flex items-center gap-2 text-xs text-slate-400 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399] shrink-0" />
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-semibold text-slate-200 truncate">100% Hors-Ligne</span>
              <span className="text-[9px] text-slate-500 truncate">Base Locale • v1.2.0</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
