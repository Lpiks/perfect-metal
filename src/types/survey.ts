export type SurveyStatus = 'a_faire' | 'realise' | 'annule'

export interface SiteSurvey {
  id: string
  code: string // e.g. "METRE-2026-0018"
  clientId: string
  clientName: string
  clientPhone: string
  siteAddress: string
  wilaya: string
  surveyDate: string
  surveyorName: string // Nom du métreur
  
  // Mesures physiques relevées sur chantier (en mm)
  widthClearMm: number    // Largeur claire (passage libre entre murs)
  heightClearMm: number   // Hauteur claire (sol au linteau)
  lintelDepthMm: number   // Hauteur de retombée du linteau (espace pour coffre)
  leftEcoinconMm: number  // Écoinçon gauche (place pour coulisse gauche)
  rightEcoinconMm: number // Écoinçon droit (place pour coulisse droite)
  
  // Contraintes techniques
  wallMaterial: 'beton' | 'brique_creuse' | 'ipn_acier' | 'pierre'
  power220vAvailable: boolean // Alimentation 220V disponible à proximité
  windingDirection: 'interieur' | 'exterieur' // Enroulement intérieur ou sous linteau
  hasObstacles: boolean       // Tuyaux, descente pluviale, climatiseur...
  
  notes?: string
  status: SurveyStatus
  associatedOrderId?: string // Si transformé en devis/commande
  createdAt: string
  updatedAt: string
}
