import React, { useState } from 'react'
import { useERPStore } from './store/erpStore'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { DashboardView } from './components/dashboard/DashboardView'
import { ProductionKanban } from './components/production/ProductionKanban'
import { InstallationsView } from './components/installations/InstallationsView'
import { SurveysView } from './components/surveys/SurveysView'
import { OrdersView } from './components/orders/OrdersView'
import { ClientsView } from './components/clients/ClientsView'
import { SuppliersView } from './components/suppliers/SuppliersView'
import { InventoryView } from './components/inventory/InventoryView'
import { SavView } from './components/sav/SavView'
import { FinanceView } from './components/finance/FinanceView'
import { SettingsView } from './components/settings/SettingsView'
import { ShutterConfiguratorModal } from './components/configurator/ShutterConfiguratorModal'

export const App: React.FC = () => {
  const { currentView, setCurrentView } = useERPStore()
  const [isConfiguratorModalOpen, setIsConfiguratorModalOpen] = useState(false)

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'kanban':
        return <ProductionKanban />
      case 'installations':
        return <InstallationsView />
      case 'surveys':
        return <SurveysView />
      case 'orders':
        return <OrdersView />
      case 'clients':
        return <ClientsView />
      case 'suppliers':
        return <SuppliersView />
      case 'inventory':
        return <InventoryView />
      case 'sav':
        return <SavView />
      case 'finance':
        return <FinanceView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090E] text-slate-100 font-sans">
      {/* Barre Latérale Navigation */}
      <Sidebar onOpenConfigurator={() => setIsConfiguratorModalOpen(true)} />

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Entête Supérieure */}
        <Header onOpenConfigurator={() => setIsConfiguratorModalOpen(true)} />

        {/* Zone de contenu défilable */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 bg-[#07090E]">
          {renderActiveView()}
        </main>
      </div>

      {/* Modal Global Configurateur de Rideaux (CPQ) */}
      <ShutterConfiguratorModal
        isOpen={isConfiguratorModalOpen}
        onClose={() => setIsConfiguratorModalOpen(false)}
        onSuccess={() => {
          setCurrentView('orders')
        }}
      />
    </div>
  )
}

export default App
