import { useLocation } from 'react-router-dom'

export function PlaceholderPage() {
  const path = useLocation().pathname
  const name = path.slice(1) || 'Página'
  const title = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-2 text-neutral-500">Em breve.</p>
    </div>
  )
}
