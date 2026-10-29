import { create } from 'zustand'
import { Client } from '../types/client'
import { Order, ProductionStage, PaymentEntry, DocumentType, PaymentStatus } from '../types/order'
import { InventoryItem } from '../types/inventory'
import { ShutterItem } from '../types/shutter'
import { InstallationJob, InstallationTeam } from '../types/installation'
import { SiteSurvey } from '../types/survey'
import { Supplier, PurchaseOrder } from '../types/supplier'
import { SavTicket } from '../types/sav'
import {
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_TEAMS,
  INITIAL_INSTALLATIONS,
  INITIAL_SURVEYS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASES,
  INITIAL_SAV_TICKETS,
} from '../utils/sampleData'

export type ERPView = 
  | 'dashboard' 
  | 'configurator' 
  | 'orders' 
  | 'kanban' 
  | 'installations'
  | 'surveys'
  | 'suppliers'
  | 'sav'
  | 'clients' 
  | 'inventory' 
  | 'finance' 
  | 'settings'

interface ERPStoreState {
  currentView: ERPView
  setCurrentView: (view: ERPView) => void
  
  // Données Principales
  clients: Client[]
  orders: Order[]
  inventory: InventoryItem[]
  
  // Nouveaux Modules Opérationnels
  teams: InstallationTeam[]
  installations: InstallationJob[]
  surveys: SiteSurvey[]
  suppliers: Supplier[]
  purchases: PurchaseOrder[]
  savTickets: SavTicket[]
  
  // Sélections pour modals & impression
  selectedOrderIdForPrint: string | null
  setSelectedOrderIdForPrint: (id: string | null) => void
  printDocumentMode: 'invoice' | 'devis' | 'delivery' | 'cutting_sheet' | 'pv_reception' | 'metre'
  setPrintDocumentMode: (mode: 'invoice' | 'devis' | 'delivery' | 'cutting_sheet' | 'pv_reception' | 'metre') => void
  
  // Actions Clients
  addClient: (client: Omit<Client, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalBilled' | 'totalPaid' | 'balanceDue'>) => Client
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  
  // Actions Commandes & Devis
  createOrder: (orderData: Partial<Order> & { clientId: string; items: ShutterItem[] }) => Order
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void
  advanceProductionStage: (id: string, nextStage: ProductionStage) => void
  recordPayment: (orderId: string, payment: Omit<PaymentEntry, 'id'>) => void
  convertDocumentType: (orderId: string, newType: DocumentType) => void
  
  // Actions Stocks
  adjustInventoryStock: (itemId: string, deltaQuantity: number, reason: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => void

  // Actions Pose & Chantiers
  addInstallationJob: (job: Omit<InstallationJob, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => void
  updateInstallationJob: (id: string, updates: Partial<InstallationJob>) => void
  signPvInstallation: (id: string, rating: number, notes?: string, collectedAmount?: number) => void

  // Actions Prise de Cotes (Métré)
  addSiteSurvey: (survey: Omit<SiteSurvey, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => SiteSurvey
  updateSiteSurvey: (id: string, updates: Partial<SiteSurvey>) => void

  // Actions Fournisseurs & Achats
  addSupplier: (supplier: Omit<Supplier, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'totalPurchasedDzd' | 'totalPaidDzd' | 'balanceDueDzd'>) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => void
  recordSupplierPayment: (purchaseId: string, amount: number) => void

  // Actions SAV & Garantie
  addSavTicket: (ticket: Omit<SavTicket, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => void
  updateSavTicket: (id: string, updates: Partial<SavTicket>) => void
  resolveSavTicket: (id: string, resolutionNotes: string, partsReplaced?: string, invoicedCost?: number) => void
  
  // Sauvegarde & Restauration
  exportDataJson: () => string
  importDataJson: (jsonString: string) => boolean
  resetToSampleData: () => void
}

const STORAGE_KEY = 'perfect_metal_erp_state_v2'

interface PersistentStateData {
  clients: Client[]
  orders: Order[]
  inventory: InventoryItem[]
  teams: InstallationTeam[]
  installations: InstallationJob[]
  surveys: SiteSurvey[]
  suppliers: Supplier[]
  purchases: PurchaseOrder[]
  savTickets: SavTicket[]
}

function loadSavedState(): PersistentStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.clients && parsed.orders && parsed.inventory) {
        return {
          clients: parsed.clients,
          orders: parsed.orders,
          inventory: parsed.inventory,
          teams: parsed.teams || INITIAL_TEAMS,
          installations: parsed.installations || INITIAL_INSTALLATIONS,
          surveys: parsed.surveys || INITIAL_SURVEYS,
          suppliers: parsed.suppliers || INITIAL_SUPPLIERS,
          purchases: parsed.purchases || INITIAL_PURCHASES,
          savTickets: parsed.savTickets || INITIAL_SAV_TICKETS,
        }
      }
    }
  } catch (e) {
    console.error('Erreur chargement état local:', e)
  }
  return {
    clients: INITIAL_CLIENTS,
    orders: INITIAL_ORDERS,
    inventory: INITIAL_INVENTORY,
    teams: INITIAL_TEAMS,
    installations: INITIAL_INSTALLATIONS,
    surveys: INITIAL_SURVEYS,
    suppliers: INITIAL_SUPPLIERS,
    purchases: INITIAL_PURCHASES,
    savTickets: INITIAL_SAV_TICKETS,
  }
}

function persistState(state: PersistentStateData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Erreur sauvegarde état local:', e)
  }
}

const initialLoaded = loadSavedState()

export const useERPStore = create<ERPStoreState>((set, get) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  clients: initialLoaded.clients,
  orders: initialLoaded.orders,
  inventory: initialLoaded.inventory,
  teams: initialLoaded.teams,
  installations: initialLoaded.installations,
  surveys: initialLoaded.surveys,
  suppliers: initialLoaded.suppliers,
  purchases: initialLoaded.purchases,
  savTickets: initialLoaded.savTickets,

  selectedOrderIdForPrint: null,
  setSelectedOrderIdForPrint: (id) => set({ selectedOrderIdForPrint: id }),
  printDocumentMode: 'invoice',
  setPrintDocumentMode: (mode) => set({ printDocumentMode: mode }),

  // ── Clients ──
  addClient: (clientData) => {
    const clients = get().clients
    const nextNum = clients.length + 1
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      code: `CLI-2026-${String(nextNum).padStart(3, '0')}`,
      totalOrders: 0,
      totalBilled: 0,
      totalPaid: 0,
      balanceDue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedClients = [newClient, ...clients]
    set({ clients: updatedClients })
    persistState({ ...get(), clients: updatedClients })
    return newClient
  },

  updateClient: (id, updates) => {
    const updatedClients = get().clients.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    )
    set({ clients: updatedClients })
    persistState({ ...get(), clients: updatedClients })
  },

  deleteClient: (id) => {
    const updatedClients = get().clients.filter((c) => c.id !== id)
    set({ clients: updatedClients })
    persistState({ ...get(), clients: updatedClients })
  },

  // ── Commandes ──
  createOrder: (orderData) => {
    const orders = get().orders
    const clients = get().clients
    const client = clients.find((c) => c.id === orderData.clientId)
    const nextNum = orders.length + 1
    const docType = orderData.documentType || 'devis'
    const prefix = docType === 'devis' ? 'DEV' : docType === 'commande' ? 'BC' : docType === 'livraison' ? 'BL' : 'FAC'
    const code = `${prefix}-2026-${String(nextNum).padStart(4, '0')}`

    const totalHT = orderData.items.reduce((sum, item) => sum + item.unitPriceHT * (item.quantity || 1), 0)
    const discountAmount = orderData.discountAmount || 0
    const netHT = Math.max(0, totalHT - discountAmount)
    const vatAmount = Math.round(netHT * 0.19)
    const totalTTC = netHT + vatAmount

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code,
      documentType: docType,
      clientId: orderData.clientId,
      clientName: client ? (client.companyName ? `${client.fullName} (${client.companyName})` : client.fullName) : 'Client Inconnu',
      clientPhone: client?.phone || '',
      clientWilaya: client?.wilaya || '16 - Alger',
      siteAddress: orderData.siteAddress || client?.address || '',
      items: orderData.items,
      productionStage: docType === 'devis' ? 'attente_validation' : 'decoupe_profilage',
      productionNotes: orderData.productionNotes || '',
      assignedTechnician: orderData.assignedTechnician || 'Équipe Atelier 1',
      estimatedDeliveryDate: orderData.estimatedDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalHT,
      discountAmount,
      netHT,
      vatAmount,
      totalTTC,
      paymentStatus: 'non_paye',
      depositRequired: Math.round(totalTTC * 0.5),
      totalPaid: 0,
      balanceDue: totalTTC,
      payments: [],
      status: 'actif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedOrders = [newOrder, ...orders]

    // Si c'est une commande validée, créer automatiquement un job d'installation à planifier
    let updatedInstallations = get().installations
    if (docType === 'commande') {
      const firstShutter = orderData.items[0]
      const newJob: InstallationJob = {
        id: `inst-${Date.now()}`,
        code: `POSE-2026-${String(updatedInstallations.length + 1).padStart(4, '0')}`,
        orderId: newOrder.id,
        orderCode: newOrder.code,
        clientId: newOrder.clientId,
        clientName: newOrder.clientName,
        clientPhone: newOrder.clientPhone,
        siteAddress: newOrder.siteAddress,
        wilaya: newOrder.clientWilaya,
        scheduledDate: newOrder.estimatedDeliveryDate,
        shutterSummary: firstShutter ? `${firstShutter.label} (${firstShutter.widthClearMm}×${firstShutter.heightClearMm}mm)` : 'Rideau Métallique',
        balanceToCollectDzd: newOrder.balanceDue,
        status: 'a_planifier',
        pvSigned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updatedInstallations = [newJob, ...updatedInstallations]
    }

    // Mettre à jour stats client
    const updatedClients = clients.map((c) => {
      if (c.id === newOrder.clientId) {
        return {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalBilled: c.totalBilled + newOrder.totalTTC,
          balanceDue: c.balanceDue + newOrder.totalTTC,
          updatedAt: new Date().toISOString(),
        }
      }
      return c
    })

    set({ orders: updatedOrders, clients: updatedClients, installations: updatedInstallations })
    persistState({ ...get(), clients: updatedClients, orders: updatedOrders, installations: updatedInstallations })
    return newOrder
  },

  updateOrder: (id, updates) => {
    const updatedOrders = get().orders.map((o) =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    )
    set({ orders: updatedOrders })
    persistState({ ...get(), orders: updatedOrders })
  },

  deleteOrder: (id) => {
    const updatedOrders = get().orders.filter((o) => o.id !== id)
    set({ orders: updatedOrders })
    persistState({ ...get(), orders: updatedOrders })
  },

  advanceProductionStage: (id, nextStage) => {
    const updatedOrders = get().orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          productionStage: nextStage,
          actualDeliveryDate: nextStage === 'livre_pose' ? new Date().toISOString().split('T')[0] : o.actualDeliveryDate,
          updatedAt: new Date().toISOString(),
        }
      }
      return o
    })
    set({ orders: updatedOrders })
    persistState({ ...get(), orders: updatedOrders })
  },

  recordPayment: (orderId, paymentData) => {
    const orders = get().orders
    const clients = get().clients

    const newPayment: PaymentEntry = {
      ...paymentData,
      id: `pay-${Date.now()}`,
    }

    let affectedClientId: string | null = null

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        affectedClientId = o.clientId
        const newTotalPaid = o.totalPaid + newPayment.amount
        const newBalance = Math.max(0, o.totalTTC - newTotalPaid)
        const paymentStatus: PaymentStatus = newBalance <= 0 ? 'solde_regle' : newTotalPaid > 0 ? 'acompte_recu' : 'non_paye'

        return {
          ...o,
          payments: [newPayment, ...o.payments],
          totalPaid: newTotalPaid,
          balanceDue: newBalance,
          paymentStatus,
          updatedAt: new Date().toISOString(),
        }
      }
      return o
    })

    const updatedClients = clients.map((c) => {
      if (c.id === affectedClientId) {
        return {
          ...c,
          totalPaid: c.totalPaid + newPayment.amount,
          balanceDue: Math.max(0, c.balanceDue - newPayment.amount),
          updatedAt: new Date().toISOString(),
        }
      }
      return c
    })

    set({ orders: updatedOrders, clients: updatedClients })
    persistState({ ...get(), clients: updatedClients, orders: updatedOrders })
  },

  convertDocumentType: (orderId, newType) => {
    const updatedOrders = get().orders.map((o) => {
      if (o.id === orderId) {
        const prefix = newType === 'devis' ? 'DEV' : newType === 'commande' ? 'BC' : newType === 'livraison' ? 'BL' : 'FAC'
        const codeNum = o.code.split('-')[2] || '0001'
        return {
          ...o,
          documentType: newType,
          code: `${prefix}-2026-${codeNum}`,
          productionStage: newType === 'commande' && o.productionStage === 'attente_validation' ? 'decoupe_profilage' : o.productionStage,
          updatedAt: new Date().toISOString(),
        }
      }
      return o
    })
    set({ orders: updatedOrders })
    persistState({ ...get(), orders: updatedOrders })
  },

  // ── Stocks ──
  adjustInventoryStock: (itemId, deltaQuantity, _reason) => {
    const updatedInventory = get().inventory.map((item) => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.currentStock + deltaQuantity)
        return {
          ...item,
          currentStock: newStock,
          updatedAt: new Date().toISOString(),
        }
      }
      return item
    })
    set({ inventory: updatedInventory })
    persistState({ ...get(), inventory: updatedInventory })
  },

  addInventoryItem: (itemData) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }
    const updatedInventory = [newItem, ...get().inventory]
    set({ inventory: updatedInventory })
    persistState({ ...get(), inventory: updatedInventory })
  },

  // ── Module 1: Pose & Chantiers ──
  addInstallationJob: (jobData) => {
    const installations = get().installations
    const nextNum = installations.length + 1
    const newJob: InstallationJob = {
      ...jobData,
      id: `inst-${Date.now()}`,
      code: `POSE-2026-${String(nextNum).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newJob, ...installations]
    set({ installations: updated })
    persistState({ ...get(), installations: updated })
  },

  updateInstallationJob: (id, updates) => {
    const updated = get().installations.map((j) =>
      j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
    )
    set({ installations: updated })
    persistState({ ...get(), installations: updated })
  },

  signPvInstallation: (id, rating, notes, collectedAmount) => {
    const job = get().installations.find((j) => j.id === id)
    if (!job) return

    const updatedInstallations = get().installations.map((j) => {
      if (j.id === id) {
        return {
          ...j,
          status: 'pose_terminee' as const,
          pvSigned: true,
          pvSignatureDate: new Date().toISOString(),
          clientRating: rating,
          notes: notes || j.notes,
          balanceToCollectDzd: collectedAmount ? Math.max(0, j.balanceToCollectDzd - collectedAmount) : j.balanceToCollectDzd,
          updatedAt: new Date().toISOString(),
        }
      }
      return j
    })

    // Avancer la commande liée à 'livre_pose'
    if (job.orderId) {
      get().advanceProductionStage(job.orderId, 'livre_pose')
      if (collectedAmount && collectedAmount > 0) {
        get().recordPayment(job.orderId, {
          date: new Date().toISOString(),
          amount: collectedAmount,
          method: 'especes',
          receiptNumber: `REC-POSE-${job.code}`,
          notes: 'Encaissement sur chantier par équipe de pose suite signature PV',
        })
      }
    }

    set({ installations: updatedInstallations })
    persistState({ ...get(), installations: updatedInstallations })
  },

  // ── Module 2: Prise de Cotes (Métré) ──
  addSiteSurvey: (surveyData) => {
    const surveys = get().surveys
    const nextNum = surveys.length + 1
    const newSurvey: SiteSurvey = {
      ...surveyData,
      id: `srv-${Date.now()}`,
      code: `METRE-2026-${String(nextNum).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newSurvey, ...surveys]
    set({ surveys: updated })
    persistState({ ...get(), surveys: updated })
    return newSurvey
  },

  updateSiteSurvey: (id, updates) => {
    const updated = get().surveys.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    )
    set({ surveys: updated })
    persistState({ ...get(), surveys: updated })
  },

  // ── Module 3: Fournisseurs & Achats ──
  addSupplier: (supplierData) => {
    const suppliers = get().suppliers
    const nextNum = suppliers.length + 1
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      code: `FOURN-${String(nextNum).padStart(3, '0')}`,
      totalPurchasedDzd: 0,
      totalPaidDzd: 0,
      balanceDueDzd: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newSupplier, ...suppliers]
    set({ suppliers: updated })
    persistState({ ...get(), suppliers: updated })
  },

  updateSupplier: (id, updates) => {
    const updated = get().suppliers.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    )
    set({ suppliers: updated })
    persistState({ ...get(), suppliers: updated })
  },

  addPurchaseOrder: (poData) => {
    const purchases = get().purchases
    const suppliers = get().suppliers
    const nextNum = purchases.length + 1
    const newPO: PurchaseOrder = {
      ...poData,
      id: `ach-${Date.now()}`,
      code: `ACH-2026-${String(nextNum).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedPurchases = [newPO, ...purchases]

    // Mettre à jour stats fournisseur
    const updatedSuppliers = suppliers.map((s) => {
      if (s.id === newPO.supplierId) {
        return {
          ...s,
          totalPurchasedDzd: s.totalPurchasedDzd + newPO.totalTTC,
          totalPaidDzd: s.totalPaidDzd + newPO.paidAmount,
          balanceDueDzd: s.balanceDueDzd + newPO.balanceDue,
          updatedAt: new Date().toISOString(),
        }
      }
      return s
    })

    set({ purchases: updatedPurchases, suppliers: updatedSuppliers })
    persistState({ ...get(), purchases: updatedPurchases, suppliers: updatedSuppliers })
  },

  recordSupplierPayment: (purchaseId, amount) => {
    let affectedSupplierId: string | null = null
    const updatedPurchases = get().purchases.map((p) => {
      if (p.id === purchaseId) {
        affectedSupplierId = p.supplierId
        const newPaid = p.paidAmount + amount
        const newBalance = Math.max(0, p.totalTTC - newPaid)
        const paymentStatus = newBalance <= 0 ? 'regle' as const : 'acompte' as const
        return {
          ...p,
          paidAmount: newPaid,
          balanceDue: newBalance,
          paymentStatus,
          updatedAt: new Date().toISOString(),
        }
      }
      return p
    })

    const updatedSuppliers = get().suppliers.map((s) => {
      if (s.id === affectedSupplierId) {
        return {
          ...s,
          totalPaidDzd: s.totalPaidDzd + amount,
          balanceDueDzd: Math.max(0, s.balanceDueDzd - amount),
          updatedAt: new Date().toISOString(),
        }
      }
      return s
    })

    set({ purchases: updatedPurchases, suppliers: updatedSuppliers })
    persistState({ ...get(), purchases: updatedPurchases, suppliers: updatedSuppliers })
  },

  // ── Module 4: SAV & Garanties ──
  addSavTicket: (ticketData) => {
    const savTickets = get().savTickets
    const nextNum = savTickets.length + 1
    const newTicket: SavTicket = {
      ...ticketData,
      id: `sav-${Date.now()}`,
      code: `SAV-2026-${String(nextNum).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newTicket, ...savTickets]
    set({ savTickets: updated })
    persistState({ ...get(), savTickets: updated })
  },

  updateSavTicket: (id, updates) => {
    const updated = get().savTickets.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    )
    set({ savTickets: updated })
    persistState({ ...get(), savTickets: updated })
  },

  resolveSavTicket: (id, resolutionNotes, partsReplaced, invoicedCost) => {
    const updated = get().savTickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'resolu' as const,
          resolvedDate: new Date().toISOString(),
          resolutionNotes,
          partsReplaced: partsReplaced || t.partsReplaced,
          invoicedCostDzd: invoicedCost !== undefined ? invoicedCost : t.invoicedCostDzd,
          updatedAt: new Date().toISOString(),
        }
      }
      return t
    })
    set({ savTickets: updated })
    persistState({ ...get(), savTickets: updated })
  },

  // ── Sauvegardes & Restauration ──
  exportDataJson: () => {
    const data = {
      clients: get().clients,
      orders: get().orders,
      inventory: get().inventory,
      teams: get().teams,
      installations: get().installations,
      surveys: get().surveys,
      suppliers: get().suppliers,
      purchases: get().purchases,
      savTickets: get().savTickets,
      exportedAt: new Date().toISOString(),
      appName: 'PERFECT METAL ERP',
    }
    return JSON.stringify(data, null, 2)
  },

  importDataJson: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (Array.isArray(parsed.clients) && Array.isArray(parsed.orders) && Array.isArray(parsed.inventory)) {
        set({
          clients: parsed.clients,
          orders: parsed.orders,
          inventory: parsed.inventory,
          teams: parsed.teams || INITIAL_TEAMS,
          installations: parsed.installations || INITIAL_INSTALLATIONS,
          surveys: parsed.surveys || INITIAL_SURVEYS,
          suppliers: parsed.suppliers || INITIAL_SUPPLIERS,
          purchases: parsed.purchases || INITIAL_PURCHASES,
          savTickets: parsed.savTickets || INITIAL_SAV_TICKETS,
        })
        persistState({
          clients: parsed.clients,
          orders: parsed.orders,
          inventory: parsed.inventory,
          teams: parsed.teams || INITIAL_TEAMS,
          installations: parsed.installations || INITIAL_INSTALLATIONS,
          surveys: parsed.surveys || INITIAL_SURVEYS,
          suppliers: parsed.suppliers || INITIAL_SUPPLIERS,
          purchases: parsed.purchases || INITIAL_PURCHASES,
          savTickets: parsed.savTickets || INITIAL_SAV_TICKETS,
        })
        return true
      }
    } catch (e) {
      console.error('Erreur import JSON:', e)
    }
    return false
  },

  resetToSampleData: () => {
    const freshData = {
      clients: INITIAL_CLIENTS,
      orders: INITIAL_ORDERS,
      inventory: INITIAL_INVENTORY,
      teams: INITIAL_TEAMS,
      installations: INITIAL_INSTALLATIONS,
      surveys: INITIAL_SURVEYS,
      suppliers: INITIAL_SUPPLIERS,
      purchases: INITIAL_PURCHASES,
      savTickets: INITIAL_SAV_TICKETS,
    }
    set(freshData)
    persistState(freshData)
  },
}))
