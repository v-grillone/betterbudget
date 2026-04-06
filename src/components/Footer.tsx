import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 py-6">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <Link href="/policy" className="text-xs text-stone-500 hover:text-stone-700 transition-colors duration-150">
            Policy
          </Link>
          <Link href="/terms" className="text-xs text-stone-500 hover:text-stone-700 transition-colors duration-150">
            Terms
          </Link>
        </div>
        <p className="text-xs text-stone-500">© 2026 betterbudget</p>
      </div>
    </footer>
  )
}
