export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function daysInMonth(yyyyMm: string): number {
  const [y, m] = yyyyMm.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function defaultDate(month: string): string {
  const now = new Date()
  const todayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (month === todayMonth) {
    return `${todayMonth}-${String(now.getDate()).padStart(2, '0')}`
  }
  return `${month}-01`
}

export function formatDate(dateStr: string): string {
  // dateStr is YYYY-MM-DD; parse as local date to avoid UTC offset shift
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
