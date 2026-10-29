export type SavIssueType = 
  | 'moteur_bloque' 
  | 'lame_deboitee' 
  | 'telecommande_perdue' 
  | 'peinture_rayee' 
  | 'serrure_grippee' 
  | 'parachute_declenche' 
  | 'autre'

export type SavPriority = 'normale' | 'urgente' | 'critique'

export type SavStatus = 'ouvert' | 'intervention_programmee' | 'resolu' | 'ferme'

export interface SavTicket {
  id: string
  code: string // e.g. "SAV-2026-0012"
  orderId?: string
  orderCode?: string
  clientId: string
  clientName: string
  clientPhone: string
  siteAddress: string
  wilaya: string
  reportedDate: string
  issueType: SavIssueType
  description: string
  priority: SavPriority
  status: SavStatus
  underWarranty: boolean // Si sous garantie légale Perfect Metal
  technicianAssigned?: string
  scheduledInterventionDate?: string
  resolvedDate?: string
  resolutionNotes?: string
  partsReplaced?: string
  invoicedCostDzd: number // 0 si sous garantie, ou montant si hors garantie
  createdAt: string
  updatedAt: string
}
