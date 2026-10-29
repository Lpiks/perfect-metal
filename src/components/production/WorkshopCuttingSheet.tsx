import React from 'react'
import { Order } from '../../types/order'
import { Printer, CheckSquare, Wrench, Flame, Gauge, ArrowLeft } from 'lucide-react'

interface WorkshopCuttingSheetProps {
  order: Order
  onBack?: () => void
}

export const WorkshopCuttingSheet: React.FC<WorkshopCuttingSheetProps> = ({ order, onBack }) => {
  const item = order.items[0] // Premier rideau pour la fiche principale

  const handlePrint = () => {
    window.print()
  }

  if (!item) {
    return <div className="p-8 text-center text-slate-400">Aucun rideau dans cette commande.</div>
  }

  return (
    <div className="space-y-6">
      {/* Action Bar (masquée à l'impression) */}
      <div className="flex items-center justify-between no-print bg-[#0E1322] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Fiche de Débit & Ordre de Travail Atelier
            </h2>
            <p className="text-xs text-slate-400">Dossier de production pour l'équipe de fabrication et cabine</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Printer size={16} />
          Imprimer Fiche Atelier (A4)
        </button>
      </div>

      {/* Document Physique A4 (Affichage écran et impression) */}
      <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Entête avec Logo PERFECT METAL */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <img src="./logo.jpg" alt="PERFECT METAL" className="w-16 h-16 rounded-lg object-contain border border-slate-300" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">PERFECT METAL</h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                Atelier de Fabrication de Rideaux & Thermolaquage
              </p>
              <p className="text-[11px] text-slate-500">Zone Industrielle • Tél : +213 (0) 550 00 00 00</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded">
              ORDRE DE FABRICATION
            </span>
            <div className="text-lg font-mono font-black text-slate-900 mt-1">{order.code}</div>
            <div className="text-xs text-slate-600">Délai : <span className="font-bold">{order.estimatedDeliveryDate}</span></div>
          </div>
        </div>

        {/* Informations Client & Chantier */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold uppercase text-[10px]">Client :</span>
            <span className="text-sm font-bold text-slate-900">{order.clientName}</span>
            <span className="block text-slate-600">{order.clientPhone}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold uppercase text-[10px]">Chantier / Destination :</span>
            <span className="text-sm font-bold text-slate-900">{order.siteAddress}</span>
            <span className="block text-slate-600">{order.clientWilaya}</span>
          </div>
        </div>

        {/* Spécifications Générales du Rideau */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Wrench size={14} />
            Désignation : {item.label} ({item.reference})
          </h3>
          <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded-lg text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">Largeur Claire :</span>
              <span className="font-bold text-slate-900">{item.widthClearMm} mm</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Hauteur Claire :</span>
              <span className="font-bold text-slate-900">{item.heightClearMm} mm</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Surface Totale :</span>
              <span className="font-bold text-slate-900">{item.surfaceM2} m²</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Poids Tablier :</span>
              <span className="font-bold text-slate-900">{item.curtainWeightKg} kg</span>
            </div>
          </div>
        </div>

        {/* 1. SECTION DÉCOUPE & DÉBIT ATELIER (Priorité Ouvrier) */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded flex items-center justify-between mb-3">
            <span>1. LISTING DES COUPES MATIÈRE (TOLÉRANCE ±1 MM)</span>
            <span className="text-[10px] font-mono">DÉBIT VALIDÉ</span>
          </h3>

          <table className="w-full text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
              <tr>
                <th className="p-2 text-left">Composant</th>
                <th className="p-2 text-left">Profil / Matière</th>
                <th className="p-2 text-center">Quantité</th>
                <th className="p-2 text-right font-mono text-sm text-slate-900">Longueur Coupe (mm)</th>
                <th className="p-2 text-center">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-blue-50/50">
                <td className="p-2.5 font-bold text-slate-900">Lames du Tablier</td>
                <td className="p-2.5 text-slate-700">
                  {item.slatType.replace('lame_', '').replace('_', ' ').toUpperCase()} ({item.slatThicknessMm} mm)
                </td>
                <td className="p-2.5 text-center font-bold font-mono">{item.slatCount} lames</td>
                <td className="p-2.5 text-right font-black font-mono text-base text-blue-900">
                  {item.slatCutLengthMm} mm
                </td>
                <td className="p-2.5 text-center text-slate-400">[  ] OK</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Coulisses Latérales</td>
                <td className="p-2.5 text-slate-700">
                  Coulisses {item.accessories.coulissesType} (Acier galvanisé avec joints)
                </td>
                <td className="p-2.5 text-center font-bold font-mono">2 barres</td>
                <td className="p-2.5 text-right font-bold font-mono text-sm text-slate-900">
                  {item.guideCutLengthMm} mm
                </td>
                <td className="p-2.5 text-center text-slate-400">[  ] OK</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Axe d'Enroulement</td>
                <td className="p-2.5 text-slate-700">Tube acier rond Ø{item.axisDiameterMm} mm</td>
                <td className="p-2.5 text-center font-bold font-mono">1 axe</td>
                <td className="p-2.5 text-right font-bold font-mono text-sm text-slate-900">
                  {item.axisCutLengthMm} mm
                </td>
                <td className="p-2.5 text-center text-slate-400">[  ] OK</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Lame Finale</td>
                <td className="p-2.5 text-slate-700">Cornière basse renforcée avec caoutchouc</td>
                <td className="p-2.5 text-center font-bold font-mono">1 barre</td>
                <td className="p-2.5 text-right font-bold font-mono text-sm text-slate-900">
                  {item.slatCutLengthMm} mm
                </td>
                <td className="p-2.5 text-center text-slate-400">[  ] OK</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. SECTION THERMOLAQUAGE AU FOUR */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-100 px-3 py-1.5 rounded flex items-center gap-2 mb-3">
            <Flame size={14} className="text-amber-600" />
            2. CONSIGNES CABINE DE PEINTURE & CUISSON AU FOUR
          </h3>

          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg border border-amber-300 bg-amber-50/50 text-xs">
            <div>
              <span className="text-amber-800 text-[10px] block font-bold">Finition Demandée :</span>
              <span className="font-black text-slate-900 text-sm">
                {item.finishType === 'thermolaquage_ral' ? item.ralCode : 'Brut Galvanisé'}
              </span>
              <span className="block text-slate-600">{item.ralName || 'Sans Peinture'}</span>
            </div>
            <div>
              <span className="text-amber-800 text-[10px] block font-bold">Aspect & Texture :</span>
              <span className="font-bold text-slate-900 capitalize">{item.ralTexture || 'Standard'}</span>
              <span className="block text-slate-600">Poudre Époxy-Polyester certifiée</span>
            </div>
            <div>
              <span className="text-amber-800 text-[10px] block font-bold">Cycle de Cuisson :</span>
              <span className="font-bold text-slate-900">200°C pendant 15 minutes</span>
              <span className="block text-slate-600">Dégraissage préalable obligatoire</span>
            </div>
          </div>
        </div>

        {/* 3. SECTION AXE, RESSORTS & MOTORISATION */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded flex items-center gap-2 mb-3">
            <Gauge size={14} className="text-slate-700" />
            3. AXE, RESSORTS D'ÉQUILIBRAGE & MOTORISATION
          </h3>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border border-slate-300 bg-slate-50 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">Motorisation :</span>
              <span className="font-bold text-slate-900">{item.motorBrand}</span>
              <span className="block text-slate-600">Couple : {item.motorTorqueNm} Nm</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">Boîtes à Ressorts :</span>
              <span className="font-bold text-slate-900">{item.springBoxesCount} Boîtes Ø200mm</span>
              <span className="block text-slate-600">Ruban ressort renforcé</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">Sécurité & Commande :</span>
              <span className="font-bold text-slate-900">{item.accessories.telecommandesCount} Télécommandes</span>
              <span className="block text-slate-600">
                {item.accessories.deblocageSecours ? 'Débrayage secours inclus' : 'Sans débrayage'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. CONTRÔLE QUALITÉ & ÉMARGEMENT ATELIER */}
        <div className="border-t-2 border-slate-900 pt-4 grid grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
            <span className="font-bold text-slate-900 block mb-2">1. Débit & Assemblage</span>
            <div className="text-slate-500 text-[11px] space-y-1">
              <div>[  ] Cotes vérifiées</div>
              <div>[  ] Tablier agrafé</div>
              <div className="pt-2 text-slate-400">Signature : ___________</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
            <span className="font-bold text-slate-900 block mb-2">2. Peinture / Four</span>
            <div className="text-slate-500 text-[11px] space-y-1">
              <div>[  ] Teinte RAL conforme</div>
              <div>[  ] Cuisson 200°C effectuée</div>
              <div className="pt-2 text-slate-400">Signature : ___________</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
            <span className="font-bold text-slate-900 block mb-2">3. Test Moteur Final</span>
            <div className="text-slate-500 text-[11px] space-y-1">
              <div>[  ] Fin de course réglée</div>
              <div>[  ] Télécommandes testées</div>
              <div className="pt-2 text-slate-400">Signature : ___________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
