export type InventoryCategory = 
  | 'acier_bobines' 
  | 'lames_profils' 
  | 'coulisses_tubes' 
  | 'moteurs' 
  | 'ressorts_axes' 
  | 'poudres_ral' 
  | 'quincaillerie_securite'

export interface InventoryItem {
  id: string
  code: string // e.g. "MAT-RAL-7016" or "MOT-ACM-170"
  name: string
  category: InventoryCategory
  unit: 'kg' | 'm' | 'unite' | 'barre_6m' | 'rouleau'
  currentStock: number
  minimumStock: number // Seuil d'alerte critique
  unitPurchasePrice: number // Prix d'achat unitaire (DZD)
  supplier?: string
  locationInWorkshop?: string // Emplacement magasinier / rayonnage
  notes?: string
  updatedAt: string
}
