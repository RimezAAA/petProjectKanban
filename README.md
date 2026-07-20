# TaskFlow — канбан-доска

Пет-проект: канбан-доска для управления задачами с drag-and-drop, анимациями и сохранением состояния в localStorage. Все данные моковые, бэкенд не требуется.

## Стек

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** — строгая типизация доменной модели без `any`
- **PrimeVue 4** — UI-компоненты (Dialog, Select, Tag, Avatar, ConfirmDialog)
- **vue-draggable-plus** — drag-and-drop на базе SortableJS
- **Vite** — сборка

## Возможности

- Перетаскивание карточек внутри колонки и между колонками с сохранением порядка
- Создание, редактирование (двойной клик по карточке) и удаление задач с подтверждением
- Анимации `<TransitionGroup>`: появление, удаление и FLIP-перестановка карточек
- Персист всей доски в `localStorage` с версионированием схемы данных
- Приоритеты, метки, исполнители, валидация формы
- Сброс доски к демо-данным

## Архитектура

```
src/
├── types/kanban.ts          # доменные типы: Task, Column, User, BoardState
├── data/mockData.ts         # моковые пользователи и начальное состояние доски
├── composables/useBoard.ts  # стор-синглтон: реактивное состояние + localStorage
├── utils/taskView.ts        # маппинг доменных значений в подписи/стили UI
└── components/
    ├── KanbanBoard.vue      # раскладка колонок, владеет диалогами
    ├── KanbanColumn.vue     # drag-and-drop список + TransitionGroup
    ├── TaskCard.vue         # презентационная карточка задачи
    └── TaskDialog.vue       # форма создания/редактирования
```

## Запуск

```bash
npm install
npm run dev      # dev-сервер на http://localhost:5173
npm run build    # production-сборка в dist/
```

