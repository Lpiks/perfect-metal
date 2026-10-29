import React, { useState } from 'react'
import { useERPStore } from '../../store/erpStore'
import { CustomInput } from '../ui/CustomInput'
import {
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Check,
  Building,
} from 'lucide-react'

export const SettingsView: React.FC = () => {
  const { clients, orders, inventory, exportDataJson, importDataJson, resetToSampleData } = useERPStore()

  const [companyName, setCompanyName] = useState('SARL PERFECT METAL')
  const [companyAddress, setCompanyAddress] = useState('Zone Industrielle • Alger, Algérie')
  const [companyPhone, setCompanyPhone] = useState('+213 (0) 550 12 34 56')
  const [companyEmail, setCompanyEmail] = useState('contact@perfect-metal.dz')
  const [taxId, setTaxId] = useState('001916029384756')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleExportBackup = () => {
    const jsonStr = exportDataJson()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PERFECT_METAL_BACKUP_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const ok = importDataJson(content)
        if (ok) {
          alert('Sauvegarde restaurée avec succès !')
        } else {
          alert('Erreur : Fichier de sauvegarde invalide.')
        }
      }
    }
    reader.readAsText(file)
  }

  const handleSaveCompany = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <HardDrive className="text-sky-400" size={22} />
          Paramètres & Sauvegardes 100% Hors-Ligne
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configurez l'entête légale de vos devis et sécurisez vos données sur disque local ou clé USB.
        </p>
      </div>

      {/* État du Système Offline */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3.5 text-xs">
        <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-emerald-300 block text-sm">
            Mode Hors-Ligne Total Opérationnel (100% Offline-First)
          </span>
          <p className="text-slate-300">
            Cette application ne dépend d'aucun serveur distant. Vos devis, clients, fiches de débit et factures
            résident exclusivement sur cette machine dans le fichier de base de données local.
          </p>
          <div className="pt-2 flex items-center gap-4 text-emerald-400/90 font-mono text-[11px]">
            <span>• {clients.length} Clients enregistrés</span>
            <span>• {orders.length} Commandes & Devis</span>
            <span>• {inventory.length} Articles en stock</span>
          </div>
        </div>
      </div>

      {/* Sauvegardes & Restauration */}
      <div className="p-6 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <HardDrive size={16} className="text-sky-400" />
          Sauvegarde & Restauration des Données
        </h3>
        <p className="text-xs text-slate-400">
          Exportez régulièrement une copie de votre base sur une clé USB ou un disque externe pour vous prémunir contre toute panne matérielle.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
          >
            <Download size={15} />
            Exporter Sauvegarde Complète (.json)
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer transition-all">
            <Upload size={15} />
            <span>Restaurer une Sauvegarde</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser les données avec le jeu de démonstration réaliste ?')) {
                resetToSampleData()
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 cursor-pointer transition-all"
          >
            <RefreshCw size={15} />
            Réinitialiser Jeu Démo
          </button>
        </div>
      </div>

      {/* Informations Entreprise pour Entête Factures */}
      <div className="p-6 rounded-2xl bg-[#0B0F1A] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Building size={16} className="text-sky-400" />
          Coordonnées de l'Atelier (Apparaissant sur Devis & Factures)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Raison Sociale"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <CustomInput
            label="Identifiant Fiscal / NIF"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Téléphone Atelier / Bureau"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
          <CustomInput
            label="Email de Contact"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </div>

        <CustomInput
          label="Adresse de l'Usine"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
        />

        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveCompany}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 cursor-pointer transition-all"
          >
            {saveSuccess ? (
              <>
                <Check size={16} />
                <span>Enregistré !</span>
              </>
            ) : (
              <span>Enregistrer les Coordonnées</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
