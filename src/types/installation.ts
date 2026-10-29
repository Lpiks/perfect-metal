export type InstallationStatus = 'a_planifier' | 'planifie' | 'en_cours' | 'pose_terminee' | 'reporte'

export interface InstallationTeam {
  id: string
  name: string // e.g. "Équipe 1 - Alger Centre & Ouest"
  leaderName: string // e.g. "Mourad (Chef Monteur)"
  phone: string
  vehiclePlate: string // e.g. "Toyota Hilux 01928-116-16"
  activeJobsCount: number
}

export interface InstallationJob {
  id: string
  code: string // e.g. "POSE-2026-0042"
  orderId: string
  orderCode: string
  clientId: string
  clientName: string
  clientPhone: string
  siteAddress: string
  wilaya: string
  scheduledDate: string
  scheduledTime?: string
  teamId?: string
  teamName?: string
  shutterSummary: string // e.g. "Rideau 3600x2700mm - RAL 7016 Sablé"
  balanceToCollectDzd: number // Solde à encaisser sur place par les poseurs
  status: InstallationStatus
  pvSigned: boolean
  pvSignatureDate?: string
  clientRating?: number // Note satisfaction 1 à 5
  notes?: string
  createdAt: string
  updatedAt: string
}
