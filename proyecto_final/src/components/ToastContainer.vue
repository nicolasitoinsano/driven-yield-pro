<template>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" :class="['toast-item', t.type]">
      <span>{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}</span>
      {{ t.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../stores/toast'
const { toasts } = useToast()
</script>
