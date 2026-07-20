<script setup lang="ts">
import Button from 'primevue/button'
import KanbanBoard from './components/KanbanBoard.vue'
import { useBoard } from './composables/useBoard'

/** Корневой лэйаут: шапка приложения + доска на всю оставшуюся высоту */
const { resetBoard } = useBoard()
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">
        <i class="pi pi-th-large app__logo" aria-hidden="true" />
        <h1 class="app__title">TaskFlow</h1>
        <span class="app__subtitle">канбан-доска</span>
      </div>
      <Button
        label="Сбросить доску"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        size="small"
        @click="resetBoard"
      />
    </header>

    <main class="app__main">
      <KanbanBoard />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  flex-shrink: 0;
}

.app__brand {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.app__logo {
  font-size: 1.25rem;
  color: var(--p-primary-color);
}

.app__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.app__subtitle {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
}

.app__main {
  flex: 1;
  min-height: 0;
}
</style>

