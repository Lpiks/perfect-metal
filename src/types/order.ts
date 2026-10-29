import { ShutterItem } from './shutter'

export type DocumentType = 'devis' | 'commande' | 'livraison' | 'facture'

export type ProductionStage = 
  | 'attente_validation'
  | 'decoupe_profilage'
  | 'peinture_four'
  | 'assemblage_mecanique'
  | 'controle_qualite'
  | 'pret_expedition'
  | 'livre_pose'

export type PaymentStatus = 'non_paye' | 'acompte_recu' | 'solde_regle'

export type PaymentMethod = 'especes' | 'cheque' | 'virement' | 'versement_bancaire'

export interface PaymentEntry {
  id: string
  date: string
  amount: number
  method: PaymentMethod
  reference?: string // N° Chèque ou Bordereau
  receiptNumber?: string
  recordedBy?: string
  notes?: string
}

export interface Order {
  id: string
  code: string // e.g. DEV-2026-0042 or FAC-2026-0019
  documentType: DocumentType
  clientId: string
  clientName: string
  clientPhone: string
  clientWilaya: string
  siteAddress: string // Adresse du chantier / pose
  
  // Articles & rideaux
  items: ShutterItem[]
  
  // Suivi de production atelier (Kanban)
  productionStage: ProductionStage
  productionNotes?: string
  assignedTechnician?: string
  estimatedDeliveryDate: string
  actualDeliveryDate?: string
  
  // Chiffrage financier global (DZD)
  totalHT: number
  discountAmount: number // Remise commerciale
  netHT: number
  vatAmount: number      // TVA 19%
  totalTTC: number
  
  // Règlements & créances
  paymentStatus: PaymentStatus
  depositRequired: number // Acompte demandé (ex: 50%)
  totalPaid: number       // Total encaissé
  balanceDue: number      // Reste à payer (créance)
  payments: PaymentEntry[]
  
  // Métadonnées
  status: 'brouillon' | 'actif' | 'annule' | 'archive'
  createdAt: string
  updatedAt: string
}
