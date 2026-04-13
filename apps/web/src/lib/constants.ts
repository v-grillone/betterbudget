export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const CATEGORIES = [
  { key: 'needs',     label: 'Needs',     color: '#818cf8', swatch: 'bg-indigo-400', pctKey: 'needs_pct'     },
  { key: 'wants',     label: 'Wants',     color: '#f87171', swatch: 'bg-red-400',    pctKey: 'wants_pct'     },
  { key: 'investing', label: 'Investing', color: '#34d399', swatch: 'bg-emerald-400', pctKey: 'investing_pct' },
]

export const AMOUNT_CLASS: Record<string, string> = {
  needs:     'text-indigo-400',
  wants:     'text-red-400',
  investing: 'text-emerald-400',
}
