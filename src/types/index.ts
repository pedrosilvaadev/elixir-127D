/**
 * Modelos de dados mapeados para integração futura com Supabase PostgreSQL.
 * Tabelas sugeridas: users, challenge_days, habits, tasks, check_ins, metrics.
 */

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'event'

export type HabitId =
  | 'apply_2_jobs'
  | 'linkedin_comment'
  | 'linkedin_likes'
  | 'follow_recruiter'
  | 'english_study'
  | 'mock_interview'
  | 'module_prospeccao'
  | 'module_processo'
  | 'module_networking'
  | 'record_interview'
  | 'feedback_after_3'
  | 'cv_versions'
  | 'spreadsheet_updated'

export interface UserProfile {
  id: string
  name: string
  email?: string
  englishLevel: EnglishLevel
  yearsOfExperience: number
  challengeStartDate: string // ISO date
  createdAt: string
  updatedAt: string
}

/** Para Supabase: challenge_days ou daily_progress */
export interface DayProgress {
  id: string
  userId: string
  date: string // YYYY-MM-DD
  completedTaskIds: HabitId[]
  diary?: string
  checkInAnswers: CheckInAnswers
  score: number // 0-100, estilo Duolingo
  createdAt: string
  updatedAt: string
}

export interface CheckInAnswers {
  productiveWork: boolean
  dayWasGood: boolean
  sleptWell: boolean
  keptPromises: boolean
}

/** Para Supabase: habits ou habit_definitions */
export interface HabitDefinition {
  id: HabitId
  label: string
  frequency: TaskFrequency
  targetCount: number // ex: 2 vagas, 1 comment, 30 min
  unit: 'count' | 'minutes'
  requiredEnglishLevel?: EnglishLevel // só obrigatório se nível < B2
  eventCondition?: string // ex: 'after_3_technical_interviews'
  optionalIfYearsExp?: number // ex: codeUp opcional se 6+
}

/** Registro de conclusão por dia (para contadores/validação) */
export interface HabitCompletion {
  habitId: HabitId
  date: string
  value: number // quantidade (ex: 2 vagas, 30 min)
  completed: boolean
}

/** Para heatmap e métricas */
export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4 // intensidade para cor no heatmap
}

export interface WeeklyConsistency {
  weekStart: string
  completedDays: number
  totalPossible: number
  percentage: number
}

export interface Metrics {
  streakDays: number
  totalApplications: number
  weeklyConsistency: number
  disciplineScore: number
  monthlyCompletionRate: number
  avgApplicationsPerDay: number
  mockInterviewsCount: number
  technicalInterviewsCount: number
}
