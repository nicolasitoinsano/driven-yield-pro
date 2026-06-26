<template>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" :class="['toast-item', t.type]">
      <span>{{ t.type === 'success' ? '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>' : t.type === 'error' ? '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>' : '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>' }}</span>
      {{ t.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../stores/toast'
const { toasts } = useToast()
</script>
