import type { BoardState, User } from '../types/kanban'

/**
 * Моковые данные для первого запуска.
 * После первого изменения доски состояние живёт в localStorage,
 * и эти данные используются только при сбросе.
 */

/** Команда проекта — статичный справочник (не редактируется из UI) */
export const USERS: User[] = [
  { id: 'u-1', name: 'Артур Ковалёв', initials: 'АК', color: '#6366f1' },
  { id: 'u-2', name: 'Мария Соколова', initials: 'МС', color: '#ec4899' },
  { id: 'u-3', name: 'Денис Орлов', initials: 'ДО', color: '#14b8a6' },
  { id: 'u-4', name: 'Елена Виноградова', initials: 'ЕВ', color: '#f59e0b' },
]

/** Версия схемы данных — увеличивается при breaking-изменениях типов */
export const BOARD_SCHEMA_VERSION = 1

/** Начальное состояние доски с демо-задачами */
export function createInitialBoard(): BoardState {
  return {
    version: BOARD_SCHEMA_VERSION,
    columns: [
      {
        id: 'col-backlog',
        title: 'Бэклог',
        color: '#94a3b8',
        tasks: [
          {
            id: 't-1',
            title: 'Настроить CI/CD пайплайн',
            description: 'GitHub Actions: линт, тесты и деплой на сервер по пушу в main.',
            priority: 'medium',
            assigneeId: 'u-3',
            tags: ['devops'],
            createdAt: '2026-07-10T09:00:00.000Z',
          },
          {
            id: 't-2',
            title: 'Тёмная тема интерфейса',
            description: 'Добавить переключатель темы с сохранением выбора пользователя.',
            priority: 'low',
            assigneeId: null,
            tags: ['ui', 'ux'],
            createdAt: '2026-07-11T14:30:00.000Z',
          },
          {
            id: 't-3',
            title: 'Исследовать WebSocket-синхронизацию',
            description: 'Оценить трудозатраты на realtime-обновление доски между вкладками.',
            priority: 'low',
            assigneeId: 'u-2',
            tags: ['research'],
            createdAt: '2026-07-12T10:15:00.000Z',
          },
        ],
      },
      {
        id: 'col-todo',
        title: 'К выполнению',
        color: '#60a5fa',
        tasks: [
          {
            id: 't-4',
            title: 'Форма создания задачи',
            description: 'Диалог с валидацией: название обязательно, приоритет по умолчанию — средний.',
            priority: 'high',
            assigneeId: 'u-1',
            tags: ['feature'],
            createdAt: '2026-07-13T08:45:00.000Z',
          },
          {
            id: 't-5',
            title: 'Адаптивная вёрстка доски',
            description: 'Горизонтальный скролл колонок на мобильных устройствах.',
            priority: 'medium',
            assigneeId: 'u-4',
            tags: ['ui', 'mobile'],
            createdAt: '2026-07-14T11:20:00.000Z',
          },
        ],
      },
      {
        id: 'col-progress',
        title: 'В работе',
        color: '#fbbf24',
        tasks: [
          {
            id: 't-6',
            title: 'Drag-and-drop карточек',
            description: 'Перетаскивание между колонками с сохранением порядка в localStorage.',
            priority: 'high',
            assigneeId: 'u-1',
            tags: ['feature', 'core'],
            createdAt: '2026-07-15T09:30:00.000Z',
          },
          {
            id: 't-7',
            title: 'Анимации списка задач',
            description: 'TransitionGroup: плавное появление, удаление и FLIP-перестановка карточек.',
            priority: 'medium',
            assigneeId: 'u-2',
            tags: ['ui', 'animation'],
            createdAt: '2026-07-16T13:00:00.000Z',
          },
        ],
      },
      {
        id: 'col-done',
        title: 'Готово',
        color: '#34d399',
        tasks: [
          {
            id: 't-8',
            title: 'Инициализация проекта',
            description: 'Vite + Vue 3 + TypeScript + PrimeVue, строгий tsconfig.',
            priority: 'high',
            assigneeId: 'u-3',
            tags: ['setup'],
            createdAt: '2026-07-08T16:00:00.000Z',
          },
          {
            id: 't-9',
            title: 'Типизация доменной модели',
            description: 'Интерфейсы Task, Column, User и BoardState без any.',
            priority: 'medium',
            assigneeId: 'u-4',
            tags: ['typescript'],
            createdAt: '2026-07-09T12:10:00.000Z',
          },
        ],
      },
    ],
  }
}
