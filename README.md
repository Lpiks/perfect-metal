# PERFECT METAL — ERP Industriel de Chiffrage, Fabrication & Thermolaquage

Système ERP Desktop **100% Hors-Ligne (Offline-First)** développé sur-mesure pour les ateliers de fabrication de **rideaux métalliques** (commerces, vitrines, villas, hangars) et de **thermolaquage au four (peinture époxy-polyester)**.

---

## 🚀 Démarrage Rapide

### 1. Lancer l'Application Desktop Native (Electron)
```bash
npm run dev
# ou
npm run desktop:dev
```

### 2. Lancer en Mode Web Léger (Vite)
```bash
npm run web
# Ouvre instantanément l'interface sur http://127.0.0.1:5174
```

### 3. Compiler l'Application pour Production
```bash
npm run build
```

---

## 🛠️ Piliers Fonctionnels Intégrés

### 1. Configurateur Technique Déterministe (CPQ)
* **Dimensions précises** : Saisie en millimètres ($W_{\text{claire}} \times H_{\text{claire}}$).
* **Types de Lames** :
  * Lame Pleine Galva $8/10^{\text{e}}$ & $10/10^{\text{e}}$ Renforcée
  * Lame Micro-Perforée pour vitrines commerciales
  * Grille Cobra / Tubes ondulés
  * Aluminium Double Paroi Isolée Polyuréthane
  * Aluminium Extrudé Haute Résistance
* **Calculs Automatiques** :
  * Surface totale ($m^2$) et poids du tablier ($kg$)
  * Diamètre d'arbre ($\varnothing 60, 76, 101, 133\text{ mm}$) et boîtes à ressorts compensateurs
  * Dimensionnement automatique du couple moteur ($Nm$) : Moteur central ACM Titan, Unititan, Tubulaire ou Latéral industriel avec parachute
* **Nuancier RAL & Thermolaquage au four** :
  * Nuancier interactif avec rendu couleur direct (RAL 7016, 9005, 9010, 8014, 5010...)
  * Finitions : Sablé texturé, Mat, Brillant, Satiné
  * Calcul de la surface développée à peindre et coût matière
* **Visualisation 2D en temps réel** : Schéma vectoriel SVG dynamique du rideau avec les vraies cotes, lames, coulisses, coffre et teinte RAL sélectionnée.

### 2. Suivi d'Atelier & Fiches de Débit (Fabrication)
* **Fiche de Débit Atelier A4** : Listing exact des longueurs de coupe des lames ($L - 20\text{ mm}$), coulisses et axe d'enroulement pour les ouvriers.
* **Kanban de Production (6 Étapes)** :
  1. *Attente Devis* ➔ 2. *Découpe & Débit* ➔ 3. *Cabine & Four RAL (200°C)* ➔ 4. *Montage & Axe* ➔ 5. *Test Moteur / CQ* ➔ 6. *Livré & Posé*.

### 3. Facturation & Suivi Commercial
* Cycle complet : **Devis** $\to$ **Bon de Commande** $\to$ **Bon de Livraison (BL)** $\to$ **Facture finale**.
* Gestion des acomptes (ex: 50% au lancement) et soldes.
* Suivi des créances et impayés en temps réel.
* Génération de documents commerciaux A4 haute fidélité avec logo **PERFECT METAL**.

### 4. Stocks & Matières Premières
* Suivi des bobines acier, lames profilées, barres de coulisses, moteurs ACM, et poudres RAL en kg.
* Alertes visuelles automatiques dès qu'un article passe sous le seuil critique.
* Mouvements de stock simplifiés (+ Entrée réception / - Sortie fabrication).

---

## 🎨 Exigences UI/UX Respectées
* **100% Custom Components** : Aucun composant par défaut du navigateur (zéro `<select>` natif, zéro date picker natif).
* **Interactivité Stricte** : `cursor-pointer` absolu sur tous les boutons, liens, onglets, déclencheurs de dropdowns et cellules de calendrier.
* **Palette Industrielle** : Sombre profond (`#07090E`), bleu métallique Perfect Metal (`#0284C7`), et finitions chromées.
