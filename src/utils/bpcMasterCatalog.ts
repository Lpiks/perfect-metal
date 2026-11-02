export interface BpcMasterColor {
  ralCode: string
  standardName: string
  family: 'Gris (7000)' | 'Noirs & Blancs (9000)' | 'Bruns (8000)' | 'Beiges (1000)' | 'Bleus (5000)' | 'Verts (6000)' | 'Rouges (3000)' | 'Effets Spéciaux (BM)'
  hex: string
  popularInAlgeria?: boolean
  recommendedSeries?: string
}

/**
 * Cahier de Couleur Officiel BPC (Boyasan Powder Coating Algérie)
 * Répertoire maître complet des teintes architecturales certifiées pour thermolaquage de rideaux métalliques.
 * Codes HEX certifiés selon la norme RAL Classic et les formulations Boyasan BPCOAT.
 */
export const BPC_MASTER_CATALOG: BpcMasterColor[] = [
  // ── 1. GRIS ARCHITECTURAUX (GAMME 7000 - #1 des ventes en Algérie) ──
  { ralCode: '7016', standardName: 'Gris Anthracite (Star Façades & Boutiques)', family: 'Gris (7000)', hex: '#2E353B', popularInAlgeria: true },
  { ralCode: '7021', standardName: 'Gris Noirâtre', family: 'Gris (7000)', hex: '#23282B', popularInAlgeria: true },
  { ralCode: '7022', standardName: 'Gris Ombre', family: 'Gris (7000)', hex: '#333636', popularInAlgeria: true },
  { ralCode: '7024', standardName: 'Gris Graphite', family: 'Gris (7000)', hex: '#343B41', popularInAlgeria: true },
  { ralCode: '7035', standardName: 'Gris Industriel Clair (Hangars & Usines)', family: 'Gris (7000)', hex: '#CBD5E1', popularInAlgeria: true },
  { ralCode: '7037', standardName: 'Gris Poussière', family: 'Gris (7000)', hex: '#7D8487' },
  { ralCode: '7038', standardName: 'Gris Agate', family: 'Gris (7000)', hex: '#B5B8B1' },
  { ralCode: '7039', standardName: 'Gris Quartz Minéral', family: 'Gris (7000)', hex: '#6C6960', popularInAlgeria: true },
  { ralCode: '7040', standardName: 'Gris Fenêtre (Menuiserie & Rideaux)', family: 'Gris (7000)', hex: '#82898F', popularInAlgeria: true },
  { ralCode: '7042', standardName: 'Gris Trafic A', family: 'Gris (7000)', hex: '#939999' },
  { ralCode: '7043', standardName: 'Gris Trafic B (Foncé)', family: 'Gris (7000)', hex: '#4E5452' },
  { ralCode: '7044', standardName: 'Gris Soie', family: 'Gris (7000)', hex: '#B8B799' },
  { ralCode: '7004', standardName: 'Gris Signalisation', family: 'Gris (7000)', hex: '#969992' },
  { ralCode: '7005', standardName: 'Gris Souris', family: 'Gris (7000)', hex: '#6B716F' },
  { ralCode: '7011', standardName: 'Gris Fer', family: 'Gris (7000)', hex: '#434B4D' },
  { ralCode: '7012', standardName: 'Gris Basalte', family: 'Gris (7000)', hex: '#4E5754' },
  { ralCode: '7015', standardName: 'Gris Ardoise', family: 'Gris (7000)', hex: '#43474B' },

  // ── 2. NOIRS & BLANCS (GAMME 9000) ──
  { ralCode: '9005', standardName: 'Noir Intense Profond (Prestige)', family: 'Noirs & Blancs (9000)', hex: '#141416', popularInAlgeria: true },
  { ralCode: '9010', standardName: 'Blanc Pur (Pharmacies & Commerces)', family: 'Noirs & Blancs (9000)', hex: '#F8FAFC', popularInAlgeria: true },
  { ralCode: '9016', standardName: 'Blanc Signalisation Brillant', family: 'Noirs & Blancs (9000)', hex: '#F1F5F9', popularInAlgeria: true },
  { ralCode: '9003', standardName: 'Blanc Sécurité', family: 'Noirs & Blancs (9000)', hex: '#ECECE7' },
  { ralCode: '9001', standardName: 'Blanc Crème', family: 'Noirs & Blancs (9000)', hex: '#EFEBD9' },
  { ralCode: '9002', standardName: 'Blanc Grisâtre', family: 'Noirs & Blancs (9000)', hex: '#DDDED4' },
  { ralCode: '9006', standardName: 'Aluminium Argent Métallisé', family: 'Noirs & Blancs (9000)', hex: '#94A3B8', popularInAlgeria: true },
  { ralCode: '9007', standardName: 'Aluminium Gris Foncé Métallisé', family: 'Noirs & Blancs (9000)', hex: '#7E807D', popularInAlgeria: true },
  { ralCode: '9011', standardName: 'Noir Graphite', family: 'Noirs & Blancs (9000)', hex: '#1C1D1F' },
  { ralCode: '9017', standardName: 'Noir Trafic', family: 'Noirs & Blancs (9000)', hex: '#1E1E1E' },
  { ralCode: '9018', standardName: 'Blanc Papyrus', family: 'Noirs & Blancs (9000)', hex: '#C8CBC4' },

  // ── 3. BRUNS & TERRES (GAMME 8000 - Villas & Bois) ──
  { ralCode: '8014', standardName: 'Brun Sépia (Façades & Aspect Bois)', family: 'Bruns (8000)', hex: '#4A3A2C', popularInAlgeria: true },
  { ralCode: '8017', standardName: 'Brun Chocolat', family: 'Bruns (8000)', hex: '#3B2F2F', popularInAlgeria: true },
  { ralCode: '8019', standardName: 'Brun Grisâtre Foncé', family: 'Bruns (8000)', hex: '#36302B', popularInAlgeria: true },
  { ralCode: '8028', standardName: 'Brun Terre d’Ombre', family: 'Bruns (8000)', hex: '#4E3B31' },
  { ralCode: '8001', standardName: 'Brun Ocre', family: 'Bruns (8000)', hex: '#8A5922' },
  { ralCode: '8003', standardName: 'Brun Argile', family: 'Bruns (8000)', hex: '#734222' },
  { ralCode: '8004', standardName: 'Brun Cuivré', family: 'Bruns (8000)', hex: '#8E402A' },
  { ralCode: '8007', standardName: 'Brun Fauve', family: 'Bruns (8000)', hex: '#59351F' },
  { ralCode: '8011', standardName: 'Brun Noisette', family: 'Bruns (8000)', hex: '#5B3A29' },
  { ralCode: '8012', standardName: 'Brun Rougeâtre', family: 'Bruns (8000)', hex: '#592321' },
  { ralCode: '8016', standardName: 'Brun Acajou', family: 'Bruns (8000)', hex: '#4C2F27' },
  { ralCode: '8022', standardName: 'Brun Noirâtre', family: 'Bruns (8000)', hex: '#1F1A17' },

  // ── 4. BEIGES & SABLES (GAMME 1000) ──
  { ralCode: '1015', standardName: 'Ivoire Clair (Sable Saharien)', family: 'Beiges (1000)', hex: '#E3D4B6', popularInAlgeria: true },
  { ralCode: '1013', standardName: 'Blanc Perlé / Ivoire Doux', family: 'Beiges (1000)', hex: '#E5E0D8', popularInAlgeria: true },
  { ralCode: '1019', standardName: 'Gris Beige', family: 'Beiges (1000)', hex: '#A48F7A', popularInAlgeria: true },
  { ralCode: '1000', standardName: 'Beige Sable Vert', family: 'Beiges (1000)', hex: '#C2B078' },
  { ralCode: '1001', standardName: 'Beige Naturel', family: 'Beiges (1000)', hex: '#C6A664' },
  { ralCode: '1002', standardName: 'Jaune Sable', family: 'Beiges (1000)', hex: '#D2B55B' },
  { ralCode: '1014', standardName: 'Ivoire Foncé', family: 'Beiges (1000)', hex: '#DFCEA1' },
  { ralCode: '1020', standardName: 'Jaune Olive', family: 'Beiges (1000)', hex: '#998650' },

  // ── 5. BLEUS INDUSTRIELS (GAMME 5000) ──
  { ralCode: '5010', standardName: 'Bleu Gentiane (Signature Perfect Metal)', family: 'Bleus (5000)', hex: '#1D4ED8', popularInAlgeria: true },
  { ralCode: '5002', standardName: 'Bleu Outremer', family: 'Bleus (5000)', hex: '#1B2F6E', popularInAlgeria: true },
  { ralCode: '5003', standardName: 'Bleu Saphir', family: 'Bleus (5000)', hex: '#1F3448' },
  { ralCode: '5005', standardName: 'Bleu Signalisation', family: 'Bleus (5000)', hex: '#154889' },
  { ralCode: '5009', standardName: 'Bleu Azur', family: 'Bleus (5000)', hex: '#265D77' },
  { ralCode: '5011', standardName: 'Bleu Acier Foncé', family: 'Bleus (5000)', hex: '#1A2730' },
  { ralCode: '5012', standardName: 'Bleu Clair', family: 'Bleus (5000)', hex: '#2B7BB9' },
  { ralCode: '5015', standardName: 'Bleu Ciel', family: 'Bleus (5000)', hex: '#2271B3' },
  { ralCode: '5017', standardName: 'Bleu Trafic', family: 'Bleus (5000)', hex: '#063971' },

  // ── 6. VERTS RÉSIDENTIELS (GAMME 6000) ──
  { ralCode: '6005', standardName: 'Vert Mousse (Résidentiel & Espaces Verts)', family: 'Verts (6000)', hex: '#166534', popularInAlgeria: true },
  { ralCode: '6009', standardName: 'Vert Sapin Foncé', family: 'Verts (6000)', hex: '#26392F', popularInAlgeria: true },
  { ralCode: '6003', standardName: 'Vert Olive', family: 'Verts (6000)', hex: '#4B573E' },
  { ralCode: '6001', standardName: 'Vert Émeraude', family: 'Verts (6000)', hex: '#276235' },
  { ralCode: '6011', standardName: 'Vert Réséda', family: 'Verts (6000)', hex: '#587246' },
  { ralCode: '6018', standardName: 'Vert Jaune Vif', family: 'Verts (6000)', hex: '#48A43F' },
  { ralCode: '6021', standardName: 'Vert Pâle', family: 'Verts (6000)', hex: '#86A47C' },
  { ralCode: '6028', standardName: 'Vert Pin', family: 'Verts (6000)', hex: '#2C5545' },

  // ── 7. ROUGES & BORDEAUX (GAMME 3000) ──
  { ralCode: '3000', standardName: 'Rouge Feu Vif', family: 'Rouges (3000)', hex: '#DC2626', popularInAlgeria: true },
  { ralCode: '3004', standardName: 'Rouge Pourpre / Bordeaux (Boutiques Prestige)', family: 'Rouges (3000)', hex: '#6B1C23', popularInAlgeria: true },
  { ralCode: '3020', standardName: 'Rouge Signalisation Sécurité', family: 'Rouges (3000)', hex: '#C1121F' },
  { ralCode: '3001', standardName: 'Rouge Sécurité', family: 'Rouges (3000)', hex: '#9B2423' },
  { ralCode: '3002', standardName: 'Rouge Carmin', family: 'Rouges (3000)', hex: '#9B1B1E' },
  { ralCode: '3003', standardName: 'Rouge Rubis', family: 'Rouges (3000)', hex: '#801818' },
  { ralCode: '3005', standardName: 'Rouge Vin', family: 'Rouges (3000)', hex: '#531921' },

  // ── 8. EFFETS SPÉCIAUX & MÉTALLISÉS BPC (SÉRIE BM & ARCHITECTURE) ──
  { ralCode: 'Mars', standardName: 'BPC Mars 2525 (Effet Rouille / Corten Sablé)', family: 'Effets Spéciaux (BM)', hex: '#78350F', popularInAlgeria: true, recommendedSeries: 'BPCOAT-BM (Spécial)' },
  { ralCode: 'Bronze', standardName: 'BPC Bronze 124 (Aspect Anodisé Sablé)', family: 'Effets Spéciaux (BM)', hex: '#594433', popularInAlgeria: true, recommendedSeries: 'BPCOAT-AL (Anodisé)' },
  { ralCode: 'Canon', standardName: 'BPC Canon de Fusil (Titanium Métallisé)', family: 'Effets Spéciaux (BM)', hex: '#4B5563', popularInAlgeria: true, recommendedSeries: 'BPCOAT-BM (Bonded Metallic)' },
  { ralCode: 'Doré', standardName: 'BPC Or Saharien Sablé Pailleté', family: 'Effets Spéciaux (BM)', hex: '#B45309', popularInAlgeria: false, recommendedSeries: 'BPCOAT-BM' },
]

export const BPC_COLOR_FAMILIES = [
  'Toutes les familles',
  'Gris (7000)',
  'Noirs & Blancs (9000)',
  'Bruns (8000)',
  'Beiges (1000)',
  'Bleus (5000)',
  'Verts (6000)',
  'Rouges (3000)',
  'Effets Spéciaux (BM)',
] as const
