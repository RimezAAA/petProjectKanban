<script setup lang="ts">
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import KanbanColumn from './KanbanColumn.vue'
import TaskDialog from './TaskDialog.vue'
import { useBoard } from '../composables/useBoard'
import type { ColumnId, Task, TaskDraft, TaskId } from '../types/kanban'

/**
 * Доска: раскладывает колонки по горизонтали и владеет диалогом задачи.
 * Единственное место, где UI-события превращаются в вызовы действий стора.
 */
const { mutableBoard, addTask, updateTask, removeTask } = useBoard()
const confirm = useConfirm()

/** Состояние диалога: открыт ли, какая задача редактируется и целевая колонка */
const dialogVisible = ref(false)
const editingTask = ref<Task | null>(null)
const targetColumnId = ref<ColumnId | null>(null)

/** Открыть диалог создания задачи в указанной колонке */
function openCreate(columnId: ColumnId): void {
  editingTask.value = null
  targetColumnId.value = columnId
  dialogVisible.value = true
}

/** Открыть диалог редактирования существующей задачи */
function openEdit(task: Task): void {
  editingTask.value = task
  targetColumnId.value = null
  dialogVisible.value = true
}

/** Единый обработчик сабмита формы: создание или обновление */
function handleSubmit(draft: TaskDraft): void {
  if (editingTask.value) {
    updateTask(editingTask.value.id, draft)
  } else if (targetColumnId.value) {
    addTask(targetColumnId.value, draft)
  }
}

/** Удаление с подтверждением — защита от случайного клика */
function handleRemove(columnId: ColumnId, taskId: TaskId): void {
  confirm.require({
    message: 'Удалить задачу без возможности восстановления?',
    header: 'Удаление задачи',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена',
    acceptProps: { severity: 'danger' },
    rejectProps: { severity: 'secondary', text: true },
    accept: () => removeTask(columnId, taskId),
  })
}
</script>

<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="column in mutableBoard.columns"
      :key="column.id"
      :column="column"
      @add="openCreate"
      @edit="openEdit"
      @remove="handleRemove"
    />
  </div>

  <TaskDialog v-model:visible="dialogVisible" :task="editingTask" @submit="handleSubmit" />
  <ConfirmDialog :style="{ width: 'min(24rem, 92vw)' }" />
</template>

<style scoped>
.kanban-board {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  height: 100%;
  /* Горизонтальный скролл на узких экранах вместо ломаной сетки */
  overflow-x: auto;
}

/* Мобильные: колонки листаются свайпом с прилипанием к краю экрана */
@media (max-width: 640px) {
  .kanban-board {
    gap: 0.75rem;
    padding: 0.75rem;
    scroll-snap-type: x mandatory;
    /* Инерционный скролл на iOS */
    -webkit-overflow-scrolling: touch;
  }
}
</style>
