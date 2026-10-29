import React from 'react'
import { ProductionStage, PaymentStatus, DocumentType } from '../../types/order'
import { ClientCategory } from '../../types/client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'slate' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  }

  const dotColors = {
    blue: 'bg-sky-400',
    cyan: 'bg-cyan-400',
    amber: 'bg-amber-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    slate: 'bg-slate-400',
    purple: 'bg-purple-400',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  }

  return (
    <span
      className={`inline-flex items-center font-medium border tracking-wide select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />}
      {children}
    </span>
  )
}

export const ProductionStageBadge: React.FC<{ stage: ProductionStage; size?: 'sm' | 'md' }> = ({
  stage,
  size = 'md',
}) => {
  switch (stage) {
    case 'attente_validation':
      return <Badge variant="slate" size={size} dot>Attente Devis</Badge>
    case 'decoupe_profilage':
      return <Badge variant="blue" size={size} dot>1. Découpe & Débit</Badge>
    case 'peinture_four':
      return <Badge variant="amber" size={size} dot>2. Cabine & Four RAL</Badge>
    case 'assemblage_mecanique':
      return <Badge variant="cyan" size={size} dot>3. Montage & Axe</Badge>
    case 'controle_qualite':
      return <Badge variant="purple" size={size} dot>4. Test Moteur / CQ</Badge>
    case 'pret_expedition':
      return <Badge variant="emerald" size={size} dot>Prêt Atelier</Badge>
    case 'livre_pose':
      return <Badge variant="emerald" size={size} dot>Livré & Posé</Badge>
    default:
      return <Badge variant="slate" size={size}>Inconnu</Badge>
  }
}

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'solde_regle':
      return <Badge variant="emerald" size={size} dot>Payé (Soldé)</Badge>
    case 'acompte_recu':
      return <Badge variant="amber" size={size} dot>Acompte Versé</Badge>
    case 'non_paye':
      return <Badge variant="rose" size={size} dot>Non Payé (Créance)</Badge>
    default:
      return <Badge variant="slate" size={size}>Non défini</Badge>
  }
}

export const DocumentTypeBadge: React.FC<{ type: DocumentType }> = ({ type }) => {
  switch (type) {
    case 'devis':
      return <Badge variant="slate" size="sm">DEVIS</Badge>
    case 'commande':
      return <Badge variant="blue" size="sm">BON COMMANDE</Badge>
    case 'livraison':
      return <Badge variant="amber" size="sm">BON LIVRAISON</Badge>
    case 'facture':
      return <Badge variant="emerald" size="sm">FACTURE</Badge>
  }
}

export const ClientCategoryBadge: React.FC<{ category: ClientCategory }> = ({ category }) => {
  switch (category) {
    case 'particulier':
      return <Badge variant="slate" size="sm">Particulier (Villa)</Badge>
    case 'commerce':
      return <Badge variant="cyan" size="sm">Commerce / Vitrine</Badge>
    case 'revendeur_pro':
      return <Badge variant="blue" size="sm">Revendeur Pro</Badge>
    case 'promoteur_btp':
      return <Badge variant="purple" size="sm">Promoteur BTP</Badge>
  }
}
