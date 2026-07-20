import { reactive, watch, readonly } from 'vue'
import type { BoardState, Column, ColumnId, TaskDraft, TaskId } from '../types/kanban'
import { BOARD_SCHEMA_VERSION, createInitialBoard } from '../data/mockData'

/** Ключ хранения доски в localStorage */
const STORAGE_KEY = 'taskflow.board'

/**
 * Читает доску из localStorage.
 * Возвращает null, если данных нет, они повреждены или устарела версия схемы —
 * в этом случае доска инициализируется моковыми данными.
 */
function loadBoard(): BoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as BoardState).version === BOARD_SCHEMA_VERSION &&
      Array.isArray((parsed as BoardState).columns)
    ) {
      return parsed as BoardState
    }
    return null
  } catch {
    // Повреждённый JSON — молча откатываемся к мокам
    return null
  }
}

/** Сохраняет текущее состояние доски в localStorage */
function saveBoard(state: BoardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded / приватный режим — приложение продолжает работать без персиста
  }
}

/**
 * Модуль-синглтон: состояние создаётся один раз на всё приложение,
 * поэтому все компоненты работают с одной и той же доской.
 */
const board = reactive<BoardState>(loadBoard() ?? createInitialBoard())

// Глубокое наблюдение покрывает и drag-and-drop (VueDraggable мутирует массивы
// колонок через v-model), и точечные правки задач — всё попадает в localStorage.
watch(board, saveBoard, { deep: true })

/** Генерирует уникальный id задачи */
function createTaskId(): TaskId {
  return `t-${crypto.randomUUID()}`
}

function findColumn(columnId: ColumnId): Column | undefined {
  return board.columns.find((column) => column.id === columnId)
}

/**
 * Стор канбан-доски: реактивное состояние + действия над задачами.
 * Наружу состояние отдаётся как readonly — мутации только через действия
 * (исключение: v-model для draggable, см. KanbanColumn).
 */
export function useBoard() {
  /** Добавляет задачу в конец указанной колонки */
  function addTask(columnId: ColumnId, draft: TaskDraft): void {
    const column = findColumn(columnId)
    if (!column) return
    column.tasks.push({
      ...draft,
      id: createTaskId(),
      createdAt: new Date().toISOString(),
    })
  }

  /** Обновляет поля существующей задачи (поиск по всем колонкам) */
  function updateTask(taskId: TaskId, draft: TaskDraft): void {
    for (const column of board.columns) {
      const task = column.tasks.find((t) => t.id === taskId)
      if (task) {
        Object.assign(task, draft)
        return
      }
    }
  }

  /** Удаляет задачу из колонки */
  function removeTask(columnId: ColumnId, taskId: TaskId): void {
    const column = findColumn(columnId)
    if (!column) return
    const index = column.tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) column.tasks.splice(index, 1)
  }

  /** Полный сброс доски к демо-данным */
  function resetBoard(): void {
    const initial = createInitialBoard()
    board.columns.splice(0, board.columns.length, ...initial.columns)
  }

  return {
    /** Реактивное состояние доски (readonly-обёртка для шаблонов) */
    board: readonly(board),
    /** Мутабельная ссылка — нужна VueDraggable для v-model списков задач */
    mutableBoard: board,
    addTask,
    updateTask,
    removeTask,
    resetBoard,
  }
}
