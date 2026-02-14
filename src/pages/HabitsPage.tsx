import { useStore } from '@/store/useStore'
import { HabitList } from '@/features/habits/HabitList'
import { format } from 'date-fns'

export function HabitsPage() {
  const selectedDate = useStore((s) => s.selectedDate)
  const setSelectedDate = useStore((s) => s.setSelectedDate)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Rastreador</h1>
        <p className="text-neutral-500">Consistência é a chave.</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Hoje
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-neutral-900"
        />
      </div>
      <HabitList />
    </div>
  )
}
