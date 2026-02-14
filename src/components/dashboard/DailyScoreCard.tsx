import { useStore } from '@/store/useStore'
import { getScoreLevel } from '@/utils/score'

const LEVEL_LABELS = ['Vazio', 'Baixo', 'Médio', 'Bom', 'Excelente']
const LEVEL_COLORS = [
  'bg-neutral-100 text-neutral-500',
  'bg-amber-100 text-amber-800',
  'bg-sky-100 text-sky-800',
  'bg-emerald-100 text-emerald-800',
  'bg-emerald-600 text-white',
]

export function DailyScoreCard() {
  const getTodayProgressPercent = useStore((s) => s.getTodayProgressPercent)
  const progressByDate = useStore((s) => s.progressByDate)
  const today = new Date().toISOString().slice(0, 10)
  const saved = progressByDate[today]
  const score = saved?.score ?? getTodayProgressPercent()
  const level = getScoreLevel(score)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-neutral-500">Score do dia</h2>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-neutral-900">{score}</span>
        <span className="text-neutral-500">/ 100</span>
      </div>
      <div className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${LEVEL_COLORS[level]}`}>
        {LEVEL_LABELS[level]}
      </div>
    </div>
  )
}
