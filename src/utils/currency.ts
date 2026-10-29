/**
 * Formate un montant en Dinar Algérien (DZD) avec séparateurs de milliers
 */
export function formatDZD(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 DZD'
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount) + ' DZD'
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || val === null || val === undefined) return '0'
  return new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val)
}
