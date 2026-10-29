export type SlatType = 
  | 'lame_pleine_8_10' 
  | 'lame_pleine_10_10' 
  | 'lame_microperforee' 
  | 'lame_cobra' 
  | 'lame_alu_isolee' 
  | 'lame_alu_extrude'

export type MotorType = 
  | 'manuel' 
  | 'central_mono' 
  | 'central_bi' 
  | 'tubulaire' 
  | 'lateral_industriel'

export type FinishType = 'brut_galva' | 'thermolaquage_ral'

export type RalTexture = 'brillant' | 'satine' | 'mat' | 'sable'

export interface RalColor {
  code: string // e.g. "RAL 7016"
  name: string // e.g. "Gris Anthracite"
  hex: string  // e.g. "#383E42"
  popular?: boolean
}

export interface ShutterAccessories {
  coulissesType: 'G40' | 'G60' | 'G80' // Coulisses avec joint anti-bruit
  lameFinaleRenforcee: boolean
  serrureCentrale: boolean
  sabotsSol: boolean // Sabots de verrouillage au sol
  deblocageSecours: boolean // Débrayage extérieur avec boîte blindée
  boiteCle: boolean // Boîte à clé extérieure
  telecommandesCount: number // Nombre de télécommandes radio
  parachuteSecurite: boolean // Parachute anti-chute conforme EN 13241
  caissonCoffre: boolean // Coffre d'habillage aluminium/acier
}

export interface ShutterItem {
  id: string
  reference: string // e.g. "RIDEAU-01"
  label: string // e.g. "Rideau Façade Principale Magasin"
  locationTag?: string // e.g. "Villa Hydra - Accès Garage"
  
  // Cotes physiques (en millimètres)
  widthClearMm: number    // Largeur claire (passage libre)
  heightClearMm: number   // Hauteur claire (sous linteau)
  widthTotalMm: number    // Largeur finie (avec coulisses)
  heightTotalMm: number   // Hauteur totale (avec coffre/enroulement)
  
  // Composants tablier
  slatType: SlatType
  slatThicknessMm: number // ex: 0.8, 1.0, 1.2
  
  // Axe & Motorisation
  axisDiameterMm: number  // ex: 60, 76, 101, 133
  springBoxesCount: number // Nombre de boîtes à ressorts
  motorType: MotorType
  motorBrand?: string     // ex: "ACM Italy", "Somfy", "Titan"
  motorTorqueNm: number   // Couple calculé en Nm
  
  // Finition & Peinture
  finishType: FinishType
  ralCode?: string        // ex: "RAL 7016"
  ralName?: string
  ralHex?: string
  ralTexture?: RalTexture
  
  // Accessoires sélectionnés
  accessories: ShutterAccessories
  
  // Calculs techniques dérivés
  surfaceM2: number       // Surface calculée (m²)
  curtainWeightKg: number // Poids du tablier (kg)
  totalWeightKg: number   // Poids total avec axe et coulisses (kg)
  slatCutLengthMm: number // Longueur de coupe exacte de chaque lame (mm)
  slatCount: number       // Nombre de lames
  guideCutLengthMm: number // Longueur de coupe des coulisses (mm)
  axisCutLengthMm: number  // Longueur de coupe de l'axe (mm)
  
  // Chiffrage financier (DZD)
  rawMaterialCost: number    // Coût acier/alu/bobines
  powderCoatingCost: number  // Coût poudre + thermolaquage au four
  motorAccessoriesCost: number // Coût moteur + quincaillerie
  laborFabricationCost: number // Main d'œuvre atelier
  installationCost: number     // Pose sur site (optionnelle)
  unitPriceHT: number          // Prix unitaire HT
  vatRate: number              // TVA (ex: 19% ou 0% si exonéré)
  unitPriceTTC: number         // Prix unitaire TTC
  quantity: number
  totalTTC: number
}
