import { create } from 'zustand'
import type {
  UserProfile,
  DayProgress,
  CheckInAnswers,
  HabitId,
  ContributionDay,
} from '@/types'
import { getDailyTaskIds, getDailyTarget } from '@/utils/challengeRules'
import { computeDailyScore } from '@/utils/score'
import { addDays, subDays, format, parseISO, eachDayOfInterval, isBefore } from 'date-fns'

const DEFAULT_CHECK_IN: CheckInAnswers = {
  productiveWork: false,
  dayWasGood: false,
  sleptWell: false,
  keptPromises: false,
}

const STORAGE_KEYS = {
  profile: 'prep127_profile',
  progress: 'prep127_progress',
}

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

function loadProgress(): Record<string, DayProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress)
    return raw ? (JSON.parse(raw) as Record<string, DayProgress>) : {}
  } catch {
    return {}
  }
}

function saveProfile(p: UserProfile | null) {
  if (p) localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(p))
  else localStorage.removeItem(STORAGE_KEYS.profile)
}

function saveProgress(progress: Record<string, DayProgress>) {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress))
}

interface HabitCompletionState {
  habitId: HabitId
  value: number
}

interface AppState {
  profile: UserProfile | null
  progressByDate: Record<string, DayProgress>
  selectedDate: string
  checkInDraft: CheckInAnswers
  diaryDraft: string
  habitCompletionsDraft: HabitCompletionState[]

  setProfile: (p: UserProfile | null) => void
  setChallengeStartDate: (date: string) => void
  setSelectedDate: (date: string) => void
  setCheckInDraft: (c: Partial<CheckInAnswers>) => void
  setDiaryDraft: (text: string) => void
  setHabitCompletion: (habitId: HabitId, value: number) => void
  saveDay: () => void
  getProgress: (date: string) => DayProgress | undefined
  getHeatmapData: (startDate: string) => ContributionDay[]
  getStreak: () => number
  getTodayProgressPercent: () => number
  getTotalApplications: () => number
  resetDraftForDate: (date: string) => void
}

const today = format(new Date(), 'yyyy-MM-dd')

export const useStore = create<AppState>((set, get) => ({
  profile: loadProfile(),
  progressByDate: loadProgress(),
  selectedDate: today,
  checkInDraft: DEFAULT_CHECK_IN,
  diaryDraft: '',
  habitCompletionsDraft: [],

  setProfile: (p) => {
    set({ profile: p })
    saveProfile(p)
  },

  setChallengeStartDate: (date: string) => {
    const profile = get().profile
    if (!profile) return
    const updated = { ...profile, challengeStartDate: date, updatedAt: new Date().toISOString() }
    set({ profile: updated })
    saveProfile(updated)
  },

  setSelectedDate: (date: string) => {
    set({ selectedDate: date })
    get().resetDraftForDate(date)
  },

  setCheckInDraft: (c) => {
    set((s) => ({ checkInDraft: { ...s.checkInDraft, ...c } }))
  },

  setDiaryDraft: (text: string) => {
    set({ diaryDraft: text })
  },

  setHabitCompletion: (habitId: HabitId, value: number) => {
    set((s) => {
      const rest = s.habitCompletionsDraft.filter((h) => h.habitId !== habitId)
      return { habitCompletionsDraft: [...rest, { habitId, value }] }
    })
  },

  saveDay: () => {
    const { profile, selectedDate, checkInDraft, diaryDraft, habitCompletionsDraft, progressByDate } =
      get()
    if (!profile) return
    const score = computeDailyScore(
      habitCompletionsDraft,
      checkInDraft,
      profile.englishLevel
    )
    // Inclui hábito se value >= meta (ex.: linkedin_comment com value 1 conta como completo)
    const completedTaskIds = habitCompletionsDraft
      .filter((h) => h.value >= getDailyTarget(h.habitId))
      .map((h) => h.habitId) as HabitId[]
    const progress: DayProgress = {
      id: `day-${selectedDate}`,
      userId: profile.id,
      date: selectedDate,
      completedTaskIds,
      diary: diaryDraft || undefined,
      checkInAnswers: { ...checkInDraft },
      score,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const next = { ...progressByDate, [selectedDate]: progress }
    set({
      progressByDate: next,
      checkInDraft: DEFAULT_CHECK_IN,
      diaryDraft: '',
      habitCompletionsDraft: [],
    })
    saveProgress(next)
    // Repopula o draft do dia salvo para a UI refletir os dados persistidos
    get().resetDraftForDate(selectedDate)
  },

  getProgress: (date: string) => get().progressByDate[date],

  getHeatmapData: (startDate: string) => {
    const { progressByDate } = get()
    const start = parseISO(startDate)
    const end = addDays(start, 126)
    const days = eachDayOfInterval({ start, end })
    return days.map((d) => {
      const key = format(d, 'yyyy-MM-dd')
      const prog = progressByDate[key]
      const count = prog?.score ?? 0
      let level: 0 | 1 | 2 | 3 | 4 = 0
      if (count >= 90) level = 4
      else if (count >= 70) level = 3
      else if (count >= 50) level = 2
      else if (count >= 25) level = 1
      return { date: key, count, level }
    })
  },

  getStreak: () => {
    const { progressByDate, profile } = get()
    if (!profile) return 0
    const start = parseISO(profile.challengeStartDate)
    let d = new Date()
    let streak = 0
    while (!isBefore(d, start)) {
      const key = format(d, 'yyyy-MM-dd')
      const prog = progressByDate[key]
      if (prog && prog.score >= 50) streak++
      else break
      d = subDays(d, 1)
    }
    return streak
  },

  getTodayProgressPercent: () => {
    const { profile, habitCompletionsDraft, getProgress } = get()
    if (!profile) return 0
    const todayKey = format(new Date(), 'yyyy-MM-dd')
    const saved = getProgress(todayKey)
    if (saved) return saved.score
    const ids = getDailyTaskIds(profile.englishLevel)
    if (ids.length === 0) return 0
    let done = 0
    for (const id of ids) {
      const target = id === 'english_study' ? 30 : id === 'apply_2_jobs' ? 2 : 1
      const c = habitCompletionsDraft.find((h) => h.habitId === id)
      if (c && c.value >= target) done++
    }
    return Math.round((done / ids.length) * 100)
  },

  getTotalApplications: () => {
    const { progressByDate } = get()
    return Object.values(progressByDate).reduce(
      (acc, p) =>
        acc + (p.completedTaskIds?.includes('apply_2_jobs') ? 2 : 0),
      0
    )
  },

  resetDraftForDate: (date: string) => {
    const progress = get().getProgress(date)
    set({
      checkInDraft: progress?.checkInAnswers ?? DEFAULT_CHECK_IN,
      diaryDraft: progress?.diary ?? '',
      habitCompletionsDraft: (progress?.completedTaskIds ?? []).map((id) => ({
        habitId: id,
        value: getDailyTarget(id),
      })),
    })
  },
}))
