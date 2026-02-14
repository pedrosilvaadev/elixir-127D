import { useStore } from '@/store/useStore'
import { getChallengeEndDate, getDayNumber } from '@/utils/challengeRules'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Flame, Target, Calendar, Briefcase } from 'lucide-react'

export function StatsCards() {
  const profile = useStore((s) => s.profile)
  const progressByDate = useStore((s) => s.progressByDate)

  if (!profile) return null

  const today = format(new Date(), 'yyyy-MM-dd')
  const dayNumber = getDayNumber(profile.challengeStartDate, today)
  const endDate = getChallengeEndDate(profile.challengeStartDate)
  const getStreakFn = useStore((s) => s.getStreak)
  const getTotalApplicationsFn = useStore((s) => s.getTotalApplications)
  const streak = getStreakFn()
  const totalApps = getTotalApplicationsFn()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-neutral-500">
          <Flame className="h-5 w-5" />
          <span className="text-sm font-medium">Streak</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{streak} dias</p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-neutral-500">
          <Target className="h-5 w-5" />
          <span className="text-sm font-medium">Trajetória</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-neutral-900">Dia {dayNumber}</p>
        <p className="text-xs text-neutral-400">/ 127</p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-neutral-500">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">Término</span>
        </div>
        <p className="mt-1 text-lg font-bold text-neutral-900">
          {format(parseISO(endDate), "d 'de' MMM", { locale: ptBR })}
        </p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-neutral-500">
          <Briefcase className="h-5 w-5" />
          <span className="text-sm font-medium">Aplicações</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{totalApps}</p>
      </div>
    </div>
  )
}
