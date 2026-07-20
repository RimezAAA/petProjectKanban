import type { TaskPriority, User, UserId } from '../types/kanban'
import { USERS } from '../data/mockData'

/**
 * Утилиты представления: маппинг доменных значений в подписи и стили UI.
 * Вынесены из компонентов, чтобы карточка и диалог использовали одни и те же данные.
 */

/** Человекочитаемые подписи приоритетов */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

/** Severity для PrimeVue Tag по приоритету */
export const PRIORITY_SEVERITIES: Record<TaskPriority, 'secondary' | 'warn' | 'danger'> = {
  low: 'secondary',
  medium: 'warn',
  high: 'danger',
}

/** Опции селекта приоритета в форме задачи */
export const PRIORITY_OPTIONS: Array<{ label: string; value: TaskPriority }> = (
  ['low', 'medium', 'high'] as const
).map((value) => ({ label: PRIORITY_LABELS[value], value }))

/** Ищет пользователя по id; null — задача не назначена */
export function findUser(userId: UserId | null): User | null {
  if (userId === null) return null
  return USERS.find((user) => user.id === userId) ?? null
}

/** Форматирует ISO-дату в короткий вид «15 июл.» */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
