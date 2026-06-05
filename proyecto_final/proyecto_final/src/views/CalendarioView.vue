<template>
  <main class="calendario-root">
    <div class="cal-hero">
      <p class="hero-eyebrow">{{ isAdmin ? "Panel de gestión" : "Mis reservas" }}</p>
      <h1 class="hero-title">{{ isAdmin ? "Driven Yield" : "Driven Yield" }} <span>Citas</span></h1>
      <p class="hero-sub">{{ isAdmin ? "Visualiza y gestiona todas las citas del taller" : "Consulta y administra tus citas agendadas" }}</p>
    </div>
    <div class="stats-row">
      <div class="stat-card"><span class="stat-num">{{ totalPendientes }}</span><span class="stat-label">Pendientes</span><div class="stat-dot dot-pendiente"></div></div>
      <div class="stat-card"><span class="stat-num">{{ totalConfirmadas }}</span><span class="stat-label">Confirmadas</span><div class="stat-dot dot-confirmada"></div></div>
      <div class="stat-card"><span class="stat-num">{{ totalCompletadas }}</span><span class="stat-label">Completadas</span><div class="stat-dot dot-completada"></div></div>
      <div class="stat-card"><span class="stat-num">{{ totalCanceladas }}</span><span class="stat-label">Canceladas</span><div class="stat-dot dot-cancelada"></div></div>
    </div>
    <div class="cal-container">
      <div v-if="citasStore.loading" class="loading-state"><div class="spinner"></div><p>Cargando citas...</p></div>
      <div v-else-if="citasStore.error" class="error-state"><p>Error: {{ citasStore.error }}</p></div>
      <CitasCalendar v-else />
    </div>
    <div class="cal-actions" v-if="!isAdmin">
      <router-link to="/agendar" class="btn-agendar">+ Nueva cita</router-link>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue"
import CitasCalendar from "@/components/CitasCalendar.vue"
import { useCitasStore } from "@/stores/citas"
import { useAuthStore } from "@/stores/auth"

const citasStore = useCitasStore()
const authStore  = useAuthStore()
const isAdmin    = computed(() => authStore.isAdmin)

const totalPendientes  = computed(() => citasStore.citas.filter(c => c.estado === "pendiente").length)
const totalConfirmadas = computed(() => citasStore.citas.filter(c => c.estado === "confirmada").length)
const totalCompletadas = computed(() => citasStore.citas.filter(c => c.estado === "completada").length)
const totalCanceladas  = computed(() => citasStore.citas.filter(c => c.estado === "cancelada").length)

onMounted(() => citasStore.fetchCitas())
</script>

<style scoped>
.calendario-root { min-height: 100vh; padding: 2rem 1.5rem 4rem; }

.cal-hero { text-align: center; margin-bottom: 2rem; }
.hero-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: #534AB7; margin-bottom: .5rem; }
.hero-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; margin-bottom: .5rem; }
.hero-title span { color: #dc2626; }
.hero-sub { color: var(--color-text-secondary); font-size: 1rem; }

.stats-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
.stat-card {
  background: var(--color-background-secondary, #1a1a1a);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: .9rem 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 110px;
  position: relative;
  overflow: hidden;
}
.stat-num   { font-size: 1.8rem; font-weight: 700; line-height: 1; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.5); }

/* ✅ Corregido: CSS válido con background y colores correctos */
.stat-dot { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
.dot-pendiente  { background: #f59e0b; }
.dot-confirmada { background: #534AB7; }
.dot-completada { background: #22c55e; }
.dot-cancelada  { background: #6b7280; }

.cal-container {
  background: var(--color-background-secondary, #1a1a1a);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.loading-state, .error-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem; }
.spinner {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #534AB7;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.cal-actions { text-align: center; margin-top: 1.5rem; }
.btn-agendar {
  display: inline-block;
  background: #534AB7;
  color: #fff;
  padding: .75rem 2rem;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}
.btn-agendar:hover { opacity: 0.88; }

/* ✅ Corregido: un solo bloque limpio de overrides para FullCalendar */
:deep(.fc .fc-button) {
  background: rgba(255,255,255,0.08) !important;
  border-color: rgba(255,255,255,0.15) !important;
  color: #fff !important;
  font-size: 13px !important;
}
:deep(.fc .fc-button-primary:not(:disabled).fc-button-active),
:deep(.fc .fc-button-primary:not(:disabled):active) {
  background: linear-gradient(135deg, #7f1d1d, #dc2626) !important;
  border-color: rgba(220, 38, 38, 0.6) !important;
  box-shadow: 0 0 12px rgba(220, 38, 38, 0.5) !important;
  color: #fff !important;
}
:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th) {
  border-color: rgba(255,255,255,0.08) !important;
}
:deep(.fc .fc-daygrid-day.fc-day-today)  { background: rgba(220,38,38,0.1) !important; }
:deep(.fc .fc-daygrid-day-number)        { color: #fff; }
:deep(.fc .fc-col-header-cell-cushion)   { color: rgba(255,255,255,0.6); }
:deep(.fc-toolbar-title)                 { color: #fff; }
:deep(.fc-event)                         { cursor: pointer; border-radius: 5px !important; font-size: 11px !important; }

/* Fondo rojo en la cabecera de días */
:deep(.fc .fc-col-header) {
  background: linear-gradient(135deg, #1a0a0a 0%, #7f1d1d 40%, #dc2626 70%, #ff6b6b 100%) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(220, 38, 38, 0.4) !important;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important;
}

:deep(.fc .fc-col-header-cell) {
  background: transparent !important;
  border-color: rgba(255, 80, 80, 0.2) !important;
  position: relative !important;
}

:deep(.fc .fc-col-header-cell::after) {
  content: '' !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 10% !important;
  width: 80% !important;
  height: 1px !important;
  background: linear-gradient(90deg, transparent, rgba(255,100,100,0.6), transparent) !important;
}

/* Texto de los días (Lun, Mar...) en blanco y legible */
:deep(.fc .fc-col-header-cell-cushion) {
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 8px 4px !important;
  text-decoration: none !important;
}

</style>