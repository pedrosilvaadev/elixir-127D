import { useStore } from '@/store/useStore'
import { CheckInForm } from '@/features/check-in/CheckInForm'

export function CheckInPage() {
  const selectedDate = useStore((s) => s.selectedDate)
  const setSelectedDate = useStore((s) => s.setSelectedDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-neutral-700">Data:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-neutral-900"
        />
      </div>
      <CheckInForm />
    </div>
  )
}
