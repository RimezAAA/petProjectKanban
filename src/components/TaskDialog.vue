<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import type { Task, TaskDraft, UserId } from '../types/kanban'
import { USERS } from '../data/mockData'
import { PRIORITY_OPTIONS } from '../utils/taskView'

/**
 * Диалог создания/редактирования задачи.
 * Режим определяется наличием props.task: null — создание, иначе — редактирование.
 * Наружу отдаёт готовый TaskDraft — вся работа со стором остаётся на родителе.
 */
const props = defineProps<{
  /** Задача для редактирования; null — режим создания */
  task: Task | null
}>()

const emit = defineEmits<{
  /** Пользователь подтвердил форму */
  submit: [draft: TaskDraft]
}>()

/** Управление видимостью через v-model из родителя */
const visible = defineModel<boolean>('visible', { required: true })

/** Опции селекта исполнителя + пункт «Не назначено» */
const assigneeOptions = [
  { label: 'Не назначено', value: null as UserId | null },
  ...USERS.map((user) => ({ label: user.name, value: user.id as UserId | null })),
]

/** Локальное состояние формы — не мутирует исходную задачу до сабмита */
const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as TaskDraft['priority'],
  assigneeId: null as UserId | null,
  /** Теги редактируются одной строкой через запятую */
  tagsInput: '',
})

/** Показывать ошибку валидации только после попытки сабмита */
let submitted = false

/** Синхронизация формы при каждом открытии диалога */
watch(visible, (isOpen) => {
  if (!isOpen) return
  submitted = false
  form.title = props.task?.title ?? ''
  form.description = props.task?.description ?? ''
  form.priority = props.task?.priority ?? 'medium'
  form.assigneeId = props.task?.assigneeId ?? null
  form.tagsInput = props.task?.tags.join(', ') ?? ''
})

const isEdit = computed(() => props.task !== null)
const titleInvalid = computed(() => submitted && form.title.trim().length === 0)

function handleSubmit(): void {
  submitted = true
  const title = form.title.trim()
  if (!title) return

  emit('submit', {
    title,
    description: form.description.trim(),
    priority: form.priority,
    assigneeId: form.assigneeId,
    // Строка «ui, ux» → ['ui', 'ux'] без пустых значений и дублей
    tags: [...new Set(form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean))],
  })
  visible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? 'Редактировать задачу' : 'Новая задача'"
    modal
    :style="{ width: 'min(30rem, 92vw)' }"
    :draggable="false"
  >
    <form class="task-form" @submit.prevent="handleSubmit">
      <div class="task-form__field">
        <label for="task-title">Название *</label>
        <InputText
          id="task-title"
          v-model="form.title"
          :invalid="titleInvalid"
          placeholder="Что нужно сделать?"
          autofocus
        />
        <small v-if="titleInvalid" class="task-form__error">Название обязательно</small>
      </div>

      <div class="task-form__field">
        <label for="task-description">Описание</label>
        <Textarea
          id="task-description"
          v-model="form.description"
          rows="3"
          auto-resize
          placeholder="Детали задачи…"
        />
      </div>

      <div class="task-form__row">
        <div class="task-form__field">
          <label for="task-priority">Приоритет</label>
          <Select
            id="task-priority"
            v-model="form.priority"
            :options="PRIORITY_OPTIONS"
            option-label="label"
            option-value="value"
          />
        </div>

        <div class="task-form__field">
          <label for="task-assignee">Исполнитель</label>
          <Select
            id="task-assignee"
            v-model="form.assigneeId"
            :options="assigneeOptions"
            option-label="label"
            option-value="value"
          />
        </div>
      </div>

      <div class="task-form__field">
        <label for="task-tags">Метки</label>
        <InputText id="task-tags" v-model="form.tagsInput" placeholder="ui, feature (через запятую)" />
      </div>

      <div class="task-form__footer">
        <Button label="Отмена" severity="secondary" text type="button" @click="visible = false" />
        <Button :label="isEdit ? 'Сохранить' : 'Создать'" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.task-form__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--p-text-muted-color);
}

.task-form__row {
  display: flex;
  gap: 1rem;
}

.task-form__error {
  color: var(--p-red-500);
}

.task-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
