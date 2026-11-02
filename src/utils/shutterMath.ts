import { SlatType, MotorType, FinishType, ShutterAccessories } from '../types/shutter'

export interface SlatCharacteristics {
  name: string
  thicknessMm: number
  weightPerM2Kg: number // Poids au m² en kg
  usefulHeightMm: number // Hauteur utile par lame en mm
  basePricePerM2Dzd: number // Prix de base matière au m²
}

export const SLAT_CATALOG: Record<SlatType, SlatCharacteristics> = {
  lame_pleine_8_10: {
    name: 'Lame Pleine Galva 8/10e',
    thicknessMm: 0.8,
    weightPerM2Kg: 9.6,
    usefulHeightMm: 80,
    basePricePerM2Dzd: 6500,
  },
  lame_pleine_10_10: {
    name: 'Lame Pleine Galva 10/10e (Renforcée)',
    thicknessMm: 1.0,
    weightPerM2Kg: 11.8,
    usefulHeightMm: 80,
    basePricePerM2Dzd: 8200,
  },
  lame_microperforee: {
    name: 'Lame Micro-Perforée Galva (Vitrine)',
    thicknessMm: 0.9,
    weightPerM2Kg: 8.9,
    usefulHeightMm: 80,
    basePricePerM2Dzd: 9400,
  },
  lame_cobra: {
    name: 'Grille Cobra / Tubes Ondulés',
    thicknessMm: 1.2,
    weightPerM2Kg: 10.5,
    usefulHeightMm: 75,
    basePricePerM2Dzd: 11000,
  },
  lame_alu_isolee: {
    name: 'Aluminium Double Paroi Isolée Polyuréthane',
    thicknessMm: 1.0,
    weightPerM2Kg: 5.5,
    usefulHeightMm: 77,
    basePricePerM2Dzd: 14500,
  },
  lame_alu_extrude: {
    name: 'Aluminium Extrudé Haute Sécurité',
    thicknessMm: 1.5,
    weightPerM2Kg: 9.8,
    usefulHeightMm: 80,
    basePricePerM2Dzd: 17500,
  },
}

export interface DimensioningParams {
  widthClearMm: number
  heightClearMm: number
  slatType: SlatType
  finishType: FinishType
  accessories: ShutterAccessories
  customMarginPercent?: number
  customSlatPricePerM2?: number
  customBpcSurchargePerM2?: number
  customMotorPrices?: Partial<Record<MotorType, number>>
}

export interface CalculationResult {
  widthTotalMm: number
  heightTotalMm: number
  surfaceM2: number
  slatCount: number
  slatCutLengthMm: number
  guideCutLengthMm: number
  axisCutLengthMm: number
  axisDiameterMm: number
  springBoxesCount: number
  curtainWeightKg: number
  totalWeightKg: number
  recommendedMotor: MotorType
  motorTorqueNm: number
  rawMaterialCost: number
  powderCoatingCost: number
  motorAccessoriesCost: number
  laborFabricationCost: number
  unitPriceHT: number
  vatAmount: number
  unitPriceTTC: number
}

/**
 * Moteur de calcul technique et financier déterministe pour rideaux métalliques PERFECT METAL
 */
export function calculateShutter(params: DimensioningParams): CalculationResult {
  const { widthClearMm, heightClearMm, slatType, finishType, accessories } = params
  const slat = SLAT_CATALOG[slatType] || SLAT_CATALOG.lame_pleine_8_10

  // 1. Détermination des cotes finies
  // Coulisses standard G60 (60mm d'aile de chaque côté)
  const guideWidthMm = accessories.coulissesType === 'G80' ? 80 : accessories.coulissesType === 'G40' ? 40 : 60
  const widthTotalMm = widthClearMm + guideWidthMm * 2
  
  // Enroulement / Coffre supérieur : ~350mm à 450mm selon la hauteur
  const windingHeightMm = heightClearMm > 3500 ? 450 : 380
  const heightTotalMm = heightClearMm + windingHeightMm

  // 2. Surface & Nombre de lames
  const surfaceM2 = Math.round(((widthTotalMm * heightTotalMm) / 1_000_000) * 100) / 100
  // Nombre de lames nécessaires + 3 lames pour la sécurité de fixation sur l'arbre
  const slatCount = Math.ceil(heightTotalMm / slat.usefulHeightMm) + 3

  // 3. Débit & Longueurs de coupe atelier (mm)
  // Lame : largeur totale moins jeu de fonctionnement dans les coulisses (20 mm total)
  const slatCutLengthMm = widthTotalMm - 20
  // Coulisses : hauteur sous linteau + pénétration coffre
  const guideCutLengthMm = heightClearMm + (windingHeightMm - 60)
  // Axe d'enroulement : largeur totale + débord de fixation flasques (100 mm)
  const axisCutLengthMm = widthTotalMm + 100

  // 4. Poids et Équilibrage
  const curtainWeightKg = Math.round(surfaceM2 * slat.weightPerM2Kg * 10) / 10
  // Poids total avec accessoires, axe et coulisses
  const totalWeightKg = Math.round((curtainWeightKg + 25 + (surfaceM2 * 2.5)) * 10) / 10

  // 5. Diamètre d'axe & Boîtes à ressorts
  let axisDiameterMm = 60
  let springBoxesCount = 2

  if (curtainWeightKg > 280) {
    axisDiameterMm = 101
    springBoxesCount = 6
  } else if (curtainWeightKg > 150) {
    axisDiameterMm = 76
    springBoxesCount = 4
  } else if (curtainWeightKg > 80) {
    axisDiameterMm = 60
    springBoxesCount = 3
  }

  // 6. Dimensionnement Motorisation
  // Couple (Nm) requis : C = (Poids * 9.81 * rayon_axe) / (2 * rendement) avec marge de sécurité 1.3
  const shaftRadiusM = (axisDiameterMm / 2) / 1000
  const theoreticalTorqueNm = Math.round((curtainWeightKg * 9.81 * shaftRadiusM * 1.3) / 1.5)
  const motorTorqueNm = Math.max(theoreticalTorqueNm, 120)

  let recommendedMotor: MotorType = 'central_mono'
  if (curtainWeightKg > 320) {
    recommendedMotor = 'lateral_industriel'
  } else if (curtainWeightKg > 160) {
    recommendedMotor = 'central_bi'
  } else if (slatType === 'lame_alu_isolee' && curtainWeightKg < 80) {
    recommendedMotor = 'tubulaire'
  } else if (curtainWeightKg < 40) {
    recommendedMotor = 'manuel'
  }

  // 7. Chiffrage Financier Déterministe (DZD)
  // Coût matière première (acier galvanisé / alu) basé sur prix catalogue ou personnalisé
  const baseSlatPrice = params.customSlatPricePerM2 ?? slat.basePricePerM2Dzd
  const rawMaterialCost = Math.round(surfaceM2 * baseSlatPrice)

  // Coût thermolaquage au four BPC (peinture polyester/époxy cuite à 200°C)
  // Surface développée = 2 faces tablier + coulisses (approx. surfaceM2 * 2.2)
  let powderCoatingCost = 0
  if (finishType === 'thermolaquage_ral') {
    const developedPaintSurfaceM2 = surfaceM2 * 2.2
    const basePowderPrice = 2800 // Base BPC application + dégraissage + cabine + cuisson four
    const colorSurcharge = params.customBpcSurchargePerM2 ?? 0 // Plus-value teinte spéciale (Sablé, Métallisé)
    powderCoatingCost = Math.round(developedPaintSurfaceM2 * (basePowderPrice + colorSurcharge))
  }

  // Coût motorisation et accessoires
  let motorAccessoriesCost = 0
  const motorRates = {
    manuel: params.customMotorPrices?.manuel ?? 5000,
    central_mono: params.customMotorPrices?.central_mono ?? 28000,
    central_bi: params.customMotorPrices?.central_bi ?? 42000,
    lateral_industriel: params.customMotorPrices?.lateral_industriel ?? 85000,
    tubulaire: params.customMotorPrices?.tubulaire ?? 32000,
  }
  motorAccessoriesCost += motorRates[recommendedMotor] || 5000

  // Quincaillerie supplémentaire
  if (accessories.serrureCentrale) motorAccessoriesCost += 4500
  if (accessories.sabotsSol) motorAccessoriesCost += 5500
  if (accessories.boiteCle) motorAccessoriesCost += 4000
  if (accessories.deblocageSecours) motorAccessoriesCost += 6000
  if (accessories.parachuteSecurite && recommendedMotor !== 'lateral_industriel') motorAccessoriesCost += 14000
  if (accessories.caissonCoffre) motorAccessoriesCost += Math.round(widthTotalMm * 4.5) // ~4500 DZD le mètre de coffre
  motorAccessoriesCost += (accessories.telecommandesCount || 2) * 2200

  // Main d'œuvre fabrication atelier & découpe
  const laborFabricationCost = Math.round(12000 + (surfaceM2 * 1800))

  // Marge commerciale appliquée (30%)
  const directCost = rawMaterialCost + powderCoatingCost + motorAccessoriesCost + laborFabricationCost
  const marginMultiplier = params.customMarginPercent ? 1 + params.customMarginPercent / 100 : 1.30
  const unitPriceHT = Math.round(directCost * marginMultiplier)

  // SANS TVA (Exonération / Régime forfaitaire IFU - TVA 0%)
  const vatAmount = 0
  const unitPriceTTC = unitPriceHT

  return {
    widthTotalMm,
    heightTotalMm,
    surfaceM2,
    slatCount,
    slatCutLengthMm,
    guideCutLengthMm,
    axisCutLengthMm,
    axisDiameterMm,
    springBoxesCount,
    curtainWeightKg,
    totalWeightKg,
    recommendedMotor,
    motorTorqueNm,
    rawMaterialCost,
    powderCoatingCost,
    motorAccessoriesCost,
    laborFabricationCost,
    unitPriceHT,
    vatAmount,
    unitPriceTTC,
  }
}
