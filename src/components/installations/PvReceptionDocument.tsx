import React from 'react'
import { InstallationJob } from '../../types/installation'
import { formatDZD } from '../../utils/currency'
import { Printer, ArrowLeft, ShieldCheck, CheckSquare, Star } from 'lucide-react'

interface PvReceptionDocumentProps {
  job: InstallationJob
  onBack?: () => void
}

export const PvReceptionDocument: React.FC<PvReceptionDocumentProps> = ({ job, onBack }) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header Actions (Non imprimé) */}
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
              Procès-Verbal de Réception de Pose — {job.code}
            </h2>
            <p className="text-xs text-slate-400">Document contractuel d'achèvement de chantier et déblocage de solde</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Printer size={16} />
          Imprimer le PV de Pose (A4)
        </button>
      </div>

      {/* DOCUMENT A4 IMPRIMABLE */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0 min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Entête Officielle PERFECT METAL */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex items-center gap-4">
              <img
                src="./logo.jpg"
                alt="PERFECT METAL"
                className="w-16 h-16 rounded-xl object-contain border border-slate-300"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">PERFECT METAL</h1>
                <p className="text-xs font-bold text-sky-800 uppercase tracking-widest">
                  Département Pose, Automatismes & Maintenance
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tél Service Pose : +213 (0) 555 40 11 22</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-700 text-white text-xs font-black rounded mb-1">
                PV DE RÉCEPTION DE CHANTIER
              </span>
              <div className="text-lg font-mono font-black text-slate-900">{job.code}</div>
              <div className="text-xs text-slate-600">Réf Commande : <strong className="font-mono">{job.orderCode}</strong></div>
              <div className="text-xs text-slate-600">Date Pose : <span className="font-bold">{job.scheduledDate}</span></div>
            </div>
          </div>

          {/* Informations Chantier & Client */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Client / Maître d'Ouvrage :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{job.clientName}</p>
              <p className="text-slate-600">{job.clientPhone}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Lieu d'Intervention :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{job.siteAddress}</p>
              <p className="text-slate-600">{job.wilaya}</p>
            </div>
          </div>

          {/* Équipe & Rideau Posé */}
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 mb-6 text-xs flex items-center justify-between">
            <div>
              <span className="text-sky-900 font-bold block">Équipe de Poseurs Référente :</span>
              <span className="text-slate-700 font-medium">{job.teamName || 'Équipe Technique Usine'}</span>
            </div>
            <div className="text-right">
              <span className="text-sky-900 font-bold block">Spécification Matériel :</span>
              <span className="text-slate-800 font-bold font-mono">{job.shutterSummary}</span>
            </div>
          </div>

          {/* GRILLE DES CONTRÔLES TECHNIQUES & ESSAIS FONCTIONNELS */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1.5 rounded flex items-center justify-between mb-3">
              <span>POINTS DE CONTRÔLE VÉRIFIÉS AVEC LE CLIENT SUR SITE</span>
              <span className="text-[10px] font-mono">CONFORME</span>
            </h3>

            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 text-left">Poste d'Inspection & Essai</th>
                  <th className="p-2.5 text-left">Critère de Tolérance & Qualité</th>
                  <th className="p-2.5 text-center w-24">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Fixation & Aplomb des Coulisses</td>
                  <td className="p-2.5 text-slate-600">Chevillage solide, verticalité niveau à bulle, joint d'étanchéité intact</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Enroulement & Fonctionnement Tablier</td>
                  <td className="p-2.5 text-slate-600">Montée et descente fluides, pas de coincement ni de frottement métallique</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Réglage des Fins de Course Moteur</td>
                  <td className="p-2.5 text-slate-600">Arrêt automatique haut et bas précis au ras du sol avec lame finale</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Aspect du Thermolaquage RAL</td>
                  <td className="p-2.5 text-slate-600">Peinture au four exempte de rayures, uniformité de la texture sablée/mate</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Remise & Essai des Télécommandes</td>
                  <td className="p-2.5 text-slate-600">Programmation des émetteurs radio validée et remise au client avec boîte à clé</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Débrayage Manuel de Secours</td>
                  <td className="p-2.5 text-slate-600">Démonstration du déverrouillage manuel en cas de coupure d'électricité Sonelgaz</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">[ X ] CONFORME</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RÈGLEMENT DU SOLDE DE CHANTIER */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 mb-6 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-700 block">Solde Restant Dû à l'Achèvement :</span>
              <span className="text-[11px] text-slate-500">Payable immédiatement à la signature du présent PV</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-black text-slate-900">
                {formatDZD(job.balanceToCollectDzd)}
              </span>
              <div className="text-[10px] text-emerald-700 font-bold">
                {job.balanceToCollectDzd === 0 ? '✓ Chantier entièrement soldé' : 'À encaisser par les poseurs'}
              </div>
            </div>
          </div>

          {/* GARANTIE CONTRACTUELLE */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2 mb-6">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Validation de la Garantie :</strong> La signature de ce PV déclenche la garantie officielle PERFECT METAL :
              <strong> 2 ans sur le thermo-laquage époxy au four</strong> et <strong>1 an sur la motorisation et les automatismes</strong>.
            </span>
          </div>
        </div>

        {/* MENTIONS LÉGALES & SIGNATURES */}
        <div className="border-t-2 border-slate-900 pt-6">
          <p className="text-[11px] text-slate-600 italic mb-4">
            « Le client soussigné déclare avoir assisté aux essais de fonctionnement et avoir pris livraison du rideau métallique
            conforme à sa commande, sans réserve apparente sur la fabrication, le thermolaquage et la motorisation. »
          </p>

          <div className="grid grid-cols-2 gap-12 text-xs">
            <div className="border border-dashed border-slate-300 rounded-xl p-4 h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-800">Date & Signature du Client :</span>
              <span className="text-[10px] text-slate-400">Mention manuscrite « Bon pour réception sans réserve »</span>
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-4 h-28 flex flex-col justify-between text-right">
              <span className="font-bold text-slate-800">Chef d'Équipe Poseur PERFECT METAL :</span>
              <span className="text-[10px] text-slate-400">Signature & Visa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
