/**
 * Score diário estilo Duolingo: baseado em tarefas completas + check-in.
 */

import type { CheckInAnswers } from '@/types'
import type { HabitId } from '@/types'
import { getDailyTaskIds, getDailyTarget } from './challengeRules'
import type { EnglishLevel } from '@/types'

const MAX_SCORE = 100

export function computeDailyScore(
  completedTasks: { habitId: HabitId; value: number }[],
  _checkIn: CheckInAnswers,
  englishLevel: EnglishLevel
): number {
  const requiredIds = getDailyTaskIds(englishLevel)
  let taskPoints = 0
  const totalRequired = requiredIds.length
  for (const id of requiredIds) {
    const target = getDailyTarget(id)
    const done = completedTasks.find((t) => t.habitId === id)
    if (!done) continue
    const ratio = target <= 0 ? 1 : Math.min(1, done.value / target)
    taskPoints += ratio
  }
  // Score 100% pelas tarefas do dia (5/5 = 100)
  const taskScore = totalRequired > 0 ? (taskPoints / totalRequired) * MAX_SCORE : 0
  return Math.round(Math.min(MAX_SCORE, taskScore))
}

export function getScoreLevel(score: number): 0 | 1 | 2 | 3 | 4 {
  if (score >= 90) return 4
  if (score >= 70) return 3
  if (score >= 50) return 2
  if (score >= 25) return 1
  return 0
}
