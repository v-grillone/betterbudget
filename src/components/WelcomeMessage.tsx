'use client'

function greeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Good morning'
  if (h >= 12 && h < 18) return 'Good afternoon'
  if (h >= 18 && h < 21) return 'Good evening'
  return 'Good night'
}

export default function WelcomeMessage({ name }: { name: string | null }) {
  const g = greeting()
  return (
    <p className="text-sm text-stone-500 mb-0">
      {name
        ? <>{g}, <span className="font-medium text-stone-700">{name}</span>. Let's add to your budget...</>
        : <>{g}. Let's add to your budget...</>
      }
    </p>
  )
}
