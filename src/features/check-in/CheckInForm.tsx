import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { formatDayLabel, formatShortDate } from '@/utils/challengeRules'
import { Building2, Sun, Moon, Target } from 'lucide-react'

const QUESTIONS = [
  { key: 'productiveWork' as const, label: 'Trabalho produtivo?', icon: Building2 },
  { key: 'dayWasGood' as const, label: 'O dia foi bom?', icon: Sun },
  { key: 'sleptWell' as const, label: 'Dormiu bem?', icon: Moon },
  { key: 'keptPromises' as const, label: 'Cumpriu promessas?', icon: Target },
]

export function CheckInForm() {
  const selectedDate = useStore((s) => s.selectedDate)
  const resetDraftForDate = useStore((s) => s.resetDraftForDate)
  const checkInDraft = useStore((s) => s.checkInDraft)
  useEffect(() => {
    resetDraftForDate(selectedDate)
  }, [selectedDate, resetDraftForDate])
  const diaryDraft = useStore((s) => s.diaryDraft)
  const setCheckInDraft = useStore((s) => s.setCheckInDraft)
  const setDiaryDraft = useStore((s) => s.setDiaryDraft)
  const saveDay = useStore((s) => s.saveDay)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900">Check-in</h1>
      <p className="mt-1 text-neutral-500 capitalize">
        {formatDayLabel(selectedDate)}
      </p>
      <div className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-lg font-medium text-neutral-900">
        {formatShortDate(selectedDate)}
      </div>

      <div className="mt-8 space-y-3">
        {QUESTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setCheckInDraft({ [key]: !checkInDraft[key] })}
            className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
              checkInDraft[key]
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-700">
          Diário
        </h2>
        <textarea
          value={diaryDraft}
          onChange={(e) => setDiaryDraft(e.target.value)}
          placeholder="Escreva aqui o seu dia..."
          className="min-h-[140px] w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          rows={5}
        />
      </div>

      <button
        type="button"
        onClick={saveDay}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-neutral-800"
      >
        Finalizar dia
      </button>
    </div>
  )
}
