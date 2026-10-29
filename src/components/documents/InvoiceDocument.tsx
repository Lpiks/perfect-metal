import React from 'react'
import { Order } from '../../types/order'
import { formatDZD } from '../../utils/currency'
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'

interface InvoiceDocumentProps {
  order: Order
  onBack?: () => void
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ order, onBack }) => {
  const isInvoice = order.documentType === 'facture'
  const isDevis = order.documentType === 'devis'
  const isBL = order.documentType === 'livraison'

  const documentTitle = isInvoice
    ? 'FACTURE DÉFINITIVE'
    : isDevis
    ? 'DEVIS / CHIFFRAGE PROFORMA'
    : isBL
    ? 'BON DE LIVRAISON'
    : 'BON DE COMMANDE'

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
              {documentTitle} — {order.code}
            </h2>
            <p className="text-xs text-slate-400">Document commercial haute fidélité prêt pour impression et signature</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
        >
          <Printer size={16} />
          Imprimer le Document (A4)
        </button>
      </div>

      {/* DOCUMENT A4 IMPRIMABLE */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0 min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Entête Officielle PERFECT METAL */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src="./logo.jpg"
                alt="PERFECT METAL"
                className="w-20 h-20 rounded-xl object-contain border border-slate-300"
              />
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">PERFECT METAL</h1>
                <p className="text-xs font-bold text-sky-800 uppercase tracking-widest">
                  Fabrication de Rideaux Métalliques & Thermolaquage au Four
                </p>
                <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                  <p>Zone Industrielle • Alger, Algérie</p>
                  <p>Tél : +213 (0) 550 12 34 56 / +213 (0) 661 00 00 00</p>
                  <p>Email : contact@perfect-metal.dz</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-black rounded mb-2 tracking-wider">
                {documentTitle}
              </div>
              <div className="text-xl font-mono font-black text-slate-900">{order.code}</div>
              <div className="text-xs text-slate-600 mt-1">
                Date : <span className="font-bold">{order.createdAt.slice(0, 10)}</span>
              </div>
              <div className="text-xs text-slate-600">
                Échéance : <span className="font-bold">{order.estimatedDeliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Adresses : Émetteur & Destinataire */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider block mb-1">
                Émis par :
              </span>
              <p className="font-bold text-slate-900 text-sm">SARL PERFECT METAL</p>
              <p className="text-slate-600">Spécialiste Fermetures Industrielles & Résidentielles</p>
              <p className="text-slate-600">NIF : 001916029384756 • RC : 16/00-098234B</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider block mb-1">
                Facturé à :
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.clientName}</p>
              <p className="text-slate-700">{order.siteAddress}</p>
              <p className="text-slate-700 font-medium">Wilaya : {order.clientWilaya}</p>
              <p className="text-slate-600">Tél : {order.clientPhone}</p>
            </div>
          </div>

          {/* Tableau des Articles & Rideaux */}
          <div className="mb-8 overflow-hidden rounded-xl border border-slate-300">
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3 text-left">Désignation & Spécifications Techniques</th>
                  <th className="p-3 text-center">Dimensions</th>
                  <th className="p-3 text-center">Finition / RAL</th>
                  <th className="p-3 text-center">Qté</th>
                  <th className="p-3 text-right font-mono">P.U HT (DZD)</th>
                  <th className="p-3 text-right font-mono">Total HT (DZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Tablier :{' '}
                        <strong className="text-slate-800">
                          {item.slatType.replace('lame_', '').replace('_', ' ').toUpperCase()}
                        </strong>{' '}
                        ({item.slatThicknessMm} mm)
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Motorisation : {item.motorBrand} ({item.motorTorqueNm} Nm)
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Accessoires : Coulisses {item.accessories.coulissesType},{' '}
                        {item.accessories.telecommandesCount} télécommandes,{' '}
                        {item.accessories.serrureCentrale && 'Serrure centrale, '}
                        {item.accessories.sabotsSol && 'Sabots sol, '}
                        {item.accessories.caissonCoffre && 'Coffre habillage'}
                      </div>
                    </td>

                    <td className="p-3.5 text-center font-mono">
                      <div className="font-bold text-slate-900">
                        {item.widthClearMm} × {item.heightClearMm} mm
                      </div>
                      <div className="text-[10px] text-slate-500">Surface : {item.surfaceM2} m²</div>
                    </td>

                    <td className="p-3.5 text-center">
                      {item.finishType === 'thermolaquage_ral' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-300 font-bold text-slate-900">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-400"
                            style={{ backgroundColor: item.ralHex || '#383E42' }}
                          />
                          <span>{item.ralCode}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-semibold">Galva Brut</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                      {item.quantity || 1}
                    </td>

                    <td className="p-3.5 text-right font-mono text-slate-800">
                      {formatDZD(item.unitPriceHT)}
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      {formatDZD(item.unitPriceHT * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Règlements & Totaux Financiers */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Historique des Règlements (Gauche) */}
            <div className="col-span-7 space-y-3 text-xs">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider block">
                Suivi des Règlements & Acomptes Encaissés :
              </span>

              {order.payments.length === 0 ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-center">
                  Aucun paiement enregistré pour cette commande.
                </div>
              ) : (
                <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Mode</th>
                      <th className="p-2 text-left">Réf / Reçu</th>
                      <th className="p-2 text-right font-mono">Montant (DZD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2">{p.date.slice(0, 10)}</td>
                        <td className="p-2 capitalize font-medium">{p.method}</td>
                        <td className="p-2 text-slate-600 font-mono">{p.receiptNumber || p.reference || '-'}</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-700">
                          {formatDZD(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 flex items-start gap-2">
                <ShieldCheck size={16} className="text-sky-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Garantie Perfect Metal :</strong> Nos rideaux bénéficient d'une garantie contractuelle de 2 ans
                  sur le thermo-laquage époxy-polyester et 1 an sur la motorisation.
                </span>
              </div>
            </div>

            {/* Récapitulatif Financier (Droite) */}
            <div className="col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Brut HT :</span>
                <span className="font-mono">{formatDZD(order.totalHT)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Remise Commerciale :</span>
                  <span className="font-mono">- {formatDZD(order.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Net Commercial HT :</span>
                <span className="font-mono">{formatDZD(order.netHT)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>TVA (19%) :</span>
                <span className="font-mono">{formatDZD(order.vatAmount)}</span>
              </div>

              <div className="flex justify-between font-black text-base text-slate-900 border-t-2 border-slate-900 pt-2">
                <span>NET À PAYER TTC :</span>
                <span className="font-mono text-sky-900">{formatDZD(order.totalTTC)}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Total Encaissé :</span>
                  <span className="font-mono">{formatDZD(order.totalPaid)}</span>
                </div>

                <div className="flex justify-between text-rose-700 font-black text-sm">
                  <span>RESTE À PAYER :</span>
                  <span className="font-mono">{formatDZD(order.balanceDue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de Page : Signatures & Cachet */}
        <div className="border-t-2 border-slate-300 pt-6 mt-8">
          <div className="grid grid-cols-2 gap-12 text-xs">
            <div className="border border-dashed border-slate-300 rounded-xl p-4 h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-700">Accord & Signature du Client :</span>
              <span className="text-[10px] text-slate-400">Date et mention manuscrite « Bon pour accord »</span>
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-4 h-28 flex flex-col justify-between text-right">
              <span className="font-bold text-slate-700">Cachet & Signature SARL PERFECT METAL :</span>
              <span className="text-[10px] text-slate-400">Direction Générale</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 mt-6 pt-3 border-t border-slate-100">
            PERFECT METAL Algérie • Rideaux Métalliques Automatiques • Poudrage Électrostatique Haute Résistance
          </div>
        </div>
      </div>
    </div>
  )
}
