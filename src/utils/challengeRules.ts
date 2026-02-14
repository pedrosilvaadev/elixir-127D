/**
 * Regras condicionais do desafio Preparação 127D.
 * Centraliza quais tarefas são obrigatórias por dia/semana/mês conforme perfil.
 */

import type { EnglishLevel, HabitId } from '@/types'
import {
  addDays,
  differenceInDays,
  format,
  getWeek,
  startOfWeek,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CHALLENGE_DAYS = 127

export function getChallengeEndDate(startDate: string): string {
  const start = parseISO(startDate)
  const end = addDays(start, CHALLENGE_DAYS - 1)
  return format(end, 'yyyy-MM-dd')
}

export function getDayNumber(startDate: string, currentDate: string): number {
  const start = parseISO(startDate)
  const current = parseISO(currentDate)
  const day = differenceInDays(current, start) + 1
  return Math.max(0, Math.min(day, CHALLENGE_DAYS))
}

export function isWithinChallenge(startDate: string, date: string): boolean {
  const start = parseISO(startDate)
  const end = addDays(start, CHALLENGE_DAYS - 1)
  const d = parseISO(date)
  return !isBefore(d, start) && !isAfter(d, end)
}

export function isEnglishStudyRequired(level: EnglishLevel): boolean {
  return level === 'A1' || level === 'A2' || level === 'B1'
}

/** Tarefas diárias obrigatórias (ids) para um dado dia */
export function getDailyTaskIds(englishLevel: EnglishLevel): HabitId[] {
  const base: HabitId[] = [
    'apply_2_jobs',
    'linkedin_comment',
    'linkedin_likes',
    'follow_recruiter',
  ]
  if (isEnglishStudyRequired(englishLevel)) {
    base.push('english_study')
  }
  return base
}

/** Meta numérica por hábito (ex: 2 vagas, 30 min) */
export function getDailyTarget(habitId: HabitId): number {
  const targets: Record<string, number> = {
    apply_2_jobs: 2,
    linkedin_comment: 1,
    linkedin_likes: 2,
    follow_recruiter: 1,
    english_study: 30, // minutos
  }
  return targets[habitId] ?? 1
}

export function getWeekStart(date: string): string {
  return format(startOfWeek(parseISO(date), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function getWeekNumber(date: string): number {
  return getWeek(parseISO(date), { weekStartsOn: 1, firstWeekContainsDate: 4 })
}

export function formatDayLabel(date: string): string {
  return format(parseISO(date), "EEEE, d 'de' MMMM", { locale: ptBR })
}

export function formatShortDate(date: string): string {
  return format(parseISO(date), 'dd/MM/yyyy')
}

export { CHALLENGE_DAYS }
