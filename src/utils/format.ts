export function formatLiters(value: number): string {
  return value.toLocaleString('he-IL', { maximumFractionDigits: 0 }) + " ל׳"
}

export function formatPercent(value: number): string {
  return value.toLocaleString('he-IL', { maximumFractionDigits: 1 }) + '%'
}
