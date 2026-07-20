/**
 * Доменные типы канбан-доски.
 * Единая точка правды для структур данных всего приложения.
 */

/** Приоритет задачи — влияет на цвет бейджа на карточке */
export type TaskPriority = 'low' | 'medium' | 'high'

/** Уникальные идентификаторы — брендированные алиасы для читаемости сигнатур */
export type TaskId = string
export type ColumnId = string
export type UserId = string

/** Пользователь, на которого может быть назначена задача */
export interface User {
  id: UserId
  /** Полное имя, отображается в тултипах и селекте исполнителя */
  name: string
  /** Инициалы для аватара (например, «АК») */
  initials: string
  /** Цвет фона аватара в HEX */
  color: string
}

/** Карточка задачи */
export interface Task {
  id: TaskId
  title: string
  description: string
  priority: TaskPriority
  /** Исполнитель; null — задача не назначена */
  assigneeId: UserId | null
  /** Метки для быстрой категоризации */
  tags: string[]
  /** Дата создания в ISO-формате */
  createdAt: string
}

/** Колонка доски — содержит упорядоченный список задач */
export interface Column {
  id: ColumnId
  title: string
  /** Акцентный цвет заголовка колонки */
  color: string
  /** Порядок элементов массива = порядок карточек в колонке */
  tasks: Task[]
}

/** Состояние всей доски — сериализуется в localStorage как есть */
export interface BoardState {
  /** Версия схемы: при изменении структуры данных инвалидируем сохранение */
  version: number
  columns: Column[]
}

/** Данные формы создания/редактирования задачи (без служебных полей) */
export type TaskDraft = Omit<Task, 'id' | 'createdAt'>
