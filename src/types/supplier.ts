export type SupplierCategory = 
  | 'bobines_acier' 
  | 'moteurs_automatismes' 
  | 'poudres_thermolaquage' 
  | 'quincaillerie_coulisses'

export interface Supplier {
  id: string
  code: string // e.g. "FOURN-001"
  name: string // e.g. "Sider El Hadjar / Import Métal"
  category: SupplierCategory
  contactPerson?: string
  phone: string
  email?: string
  address: string
  city: string
  wilaya: string
  taxId?: string // NIF
  totalPurchasedDzd: number // Total achats effectués
  totalPaidDzd: number      // Total réglé au fournisseur
  balanceDueDzd: number     // Dette fournisseur (ce que l'usine doit)
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PurchaseItem {
  name: string
  quantity: number
  unit: string
  unitPriceDzd: number
  totalDzd: number
}

export interface PurchaseOrder {
  id: string
  code: string // e.g. "ACH-2026-0034"
  supplierId: string
  supplierName: string
  date: string
  expectedDeliveryDate: string
  items: PurchaseItem[]
  totalHT: number
  vatAmount: number
  totalTTC: number
  paidAmount: number
  balanceDue: number // Dette restante sur cette facture d'achat
  paymentStatus: 'non_paye' | 'acompte' | 'regle'
  status: 'commande' | 'recu' | 'annule'
  notes?: string
  createdAt: string
  updatedAt: string
}
