<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import type { Task } from '../types/kanban'
import { PRIORITY_LABELS, PRIORITY_SEVERITIES, findUser, formatDate } from '../utils/taskView'

/**
 * Карточка задачи внутри колонки.
 * Чисто презентационный компонент: все изменения делегируются наверх через события.
 */
const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  /** Пользователь хочет открыть задачу на редактирование */
  edit: [task: Task]
  /** Пользователь удаляет задачу */
  remove: [taskId: Task['id']]
}>()

const assignee = computed(() => findUser(props.task.assigneeId))
</script>

<template>
  <article class="task-card" @dblclick="emit('edit', task)">
    <header class="task-card__header">
      <Tag
        :value="PRIORITY_LABELS[task.priority]"
        :severity="PRIORITY_SEVERITIES[task.priority]"
        class="task-card__priority"
      />
      <div class="task-card__actions">
        <Button
          icon="pi pi-pencil"
          text
          rounded
          size="small"
          severity="secondary"
          aria-label="Редактировать задачу"
          @click="emit('edit', task)"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          size="small"
          severity="danger"
          aria-label="Удалить задачу"
          @click="emit('remove', task.id)"
        />
      </div>
    </header>

    <h3 class="task-card__title">{{ task.title }}</h3>
    <p v-if="task.description" class="task-card__description">{{ task.description }}</p>

    <ul v-if="task.tags.length" class="task-card__tags">
      <li v-for="tag in task.tags" :key="tag" class="task-card__tag">#{{ tag }}</li>
    </ul>

    <footer class="task-card__footer">
      <time class="task-card__date" :datetime="task.createdAt">
        <i class="pi pi-calendar" aria-hidden="true" />
        {{ formatDate(task.createdAt) }}
      </time>
      <Avatar
        v-if="assignee"
        v-tooltip.top="assignee.name"
        :label="assignee.initials"
        shape="circle"
        size="small"
        :style="{ backgroundColor: assignee.color, color: '#fff' }"
      />
    </footer>
  </article>
</template>

<style scoped>
.task-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
  cursor: grab;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transform: translateY(-1px);
}

.task-card:active {
  cursor: grabbing;
}

.task-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Кнопки действий появляются только при наведении — меньше визуального шума */
.task-card__actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.task-card:hover .task-card__actions,
.task-card:focus-within .task-card__actions {
  opacity: 1;
}

.task-card__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--p-text-color);
}

.task-card__description {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--p-text-muted-color);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task-card__tag {
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--p-surface-100);
  color: var(--p-text-muted-color);
}

.task-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.task-card__date {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}
</style>
