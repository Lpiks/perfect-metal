export type ClientCategory = 'particulier' | 'commerce' | 'revendeur_pro' | 'promoteur_btp'

export interface Client {
  id: string
  code: string // e.g. CLI-2026-001
  fullName: string
  companyName?: string
  phone: string
  phoneSecondary?: string
  email?: string
  address: string
  city: string
  wilaya: string
  category: ClientCategory
  taxId?: string // NIF/NIS/RC if pro
  notes?: string
  totalOrders: number
  totalBilled: number
  totalPaid: number
  balanceDue: number // totalBilled - totalPaid (créance)
  createdAt: string
  updatedAt: string
}
