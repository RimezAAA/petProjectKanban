<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import Button from 'primevue/button'
import TaskCard from './TaskCard.vue'
import type { Column, Task, TaskId } from '../types/kanban'

/**
 * Колонка канбан-доски: заголовок со счётчиком + drag-and-drop список карточек.
 *
 * Ключевой приём: VueDraggable оборачивает <TransitionGroup> (проп target
 * указывает на его реальный DOM-контейнер), поэтому одни и те же CSS-переходы
 * обслуживают и добавление/удаление задач, и FLIP-перестановку карточек.
 */
const props = defineProps<{
  /**
   * Мутабельная ссылка на колонку: VueDraggable напрямую переставляет
   * элементы массива tasks через v-model, изменения подхватывает
   * глубокий watcher стора и сохраняет в localStorage.
   */
  column: Column
}>()

const emit = defineEmits<{
  /** Создать задачу в этой колонке */
  add: [columnId: Column['id']]
  /** Открыть задачу на редактирование */
  edit: [task: Task]
  /** Удалить задачу из этой колонки */
  remove: [columnId: Column['id'], taskId: TaskId]
}>()

/**
 * Флаг активного перетаскивания. Пока карточку тащат, FLIP-анимация
 * TransitionGroup отключается (name = undefined), чтобы не конфликтовать
 * с собственной анимацией SortableJS.
 */
const dragging = ref(false)
</script>

<template>
  <section class="kanban-column">
    <header class="kanban-column__header" :style="{ '--column-accent': props.column.color }">
      <span class="kanban-column__dot" aria-hidden="true" />
      <h2 class="kanban-column__title">{{ column.title }}</h2>
      <span class="kanban-column__count">{{ column.tasks.length }}</span>
      <Button
        icon="pi pi-plus"
        text
        rounded
        size="small"
        severity="secondary"
        aria-label="Добавить задачу"
        @click="emit('add', column.id)"
      />
    </header>

    <!--
      group="tasks" объединяет списки всех колонок: карточки можно
      перетаскивать между ними. target=".kanban-column__list" говорит
      библиотеке управлять DOM-узлом, который рендерит TransitionGroup.
    -->
    <VueDraggable
      v-model="props.column.tasks"
      group="tasks"
      ghost-class="task-ghost"
      drag-class="task-dragging"
      :animation="200"
      target=".kanban-column__list"
      class="kanban-column__body"
      @start="dragging = true"
      @end="dragging = false"
    >
      <TransitionGroup
        tag="div"
        :name="dragging ? undefined : 'task-list'"
        class="kanban-column__list"
      >
        <TaskCard
          v-for="task in column.tasks"
          :key="task.id"
          :task="task"
          @edit="emit('edit', $event)"
          @remove="emit('remove', column.id, $event)"
        />
      </TransitionGroup>
    </VueDraggable>

    <p v-if="column.tasks.length === 0" class="kanban-column__empty">
      Перетащите карточку сюда
    </p>
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-height: 100%;
  border-radius: 14px;
  background: var(--p-surface-100);
  border: 1px solid var(--p-surface-200);
}

/* Планшеты: колонки чуть уже, чтобы помещалось больше без скролла */
@media (max-width: 1024px) {
  .kanban-column {
    width: 270px;
    min-width: 270px;
  }
}

/* Мобильные: колонка почти во всю ширину + точка прилипания для scroll-snap.
   Край соседней колонки остаётся виден — подсказка, что доска листается */
@media (max-width: 640px) {
  .kanban-column {
    width: min(85vw, 320px);
    min-width: min(85vw, 320px);
    scroll-snap-align: start;
  }
}

.kanban-column__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem 0.5rem;
}

/* Цветовая точка-акцент из данных колонки */
.kanban-column__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--column-accent);
  flex-shrink: 0;
}

.kanban-column__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  flex: 1;
}

.kanban-column__count {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: var(--p-surface-200);
  color: var(--p-text-muted-color);
}

/* Обёртка draggable-зоны занимает всю оставшуюся высоту колонки */
.kanban-column__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Список карточек — реальный DOM-узел TransitionGroup */
.kanban-column__list {
  /* relative нужен для позиционирования leave-анимации (position: absolute) */
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem 0.875rem;
  overflow-y: auto;
  flex: 1;
  /* Пустая колонка остаётся валидной drop-зоной */
  min-height: 60px;
}

.kanban-column__empty {
  margin: 0;
  padding: 0 0.75rem 0.875rem;
  font-size: 0.8rem;
  text-align: center;
  color: var(--p-text-muted-color);
}
</style>
