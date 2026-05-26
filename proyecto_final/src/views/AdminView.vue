<template>
  <div class="admin-shell">

    <!-- ══ SIDEBAR ══ -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="brand">
          <div class="brand-mark">LC</div>
          <div class="brand-info">
            <span class="brand-name">driven yield</span>
            <span class="brand-role">Administrador</span>
          </div>
        </div>

        <nav class="sidenav">
          <div class="sidenav-group-label">PANEL</div>
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['sidenav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="sidenav-icon" v-html="tab.svg"></span>
            <span class="sidenav-label">{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <div class="sidebar-bottom">
        <div class="sys-status">
          <div class="sys-dot"></div>
          <div class="sys-info">
            <span class="sys-label">Sistema</span>
            <span class="sys-value">Operativo</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══ -->
    <main class="main-area">

      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">{{ currentTab.label }}</h1>
          <div class="topbar-date">{{ todayStr }}</div>
        </div>
        <div class="topbar-right">
          <div class="topbar-stat">
            <span class="ts-value">{{ citas.length }}</span>
            <span class="ts-label">citas totales</span>
          </div>
          <div class="topbar-divider"></div>
          <div class="topbar-stat">
            <span class="ts-value green">{{ citas.filter(c=>c.estado==='completada').length }}</span>
            <span class="ts-label">completadas</span>
          </div>
        </div>
      </header>

      <!-- ─── DASHBOARD ─── -->
      <div v-if="activeTab === 'dashboard'" class="view-panel">

        <div class="kpi-row">
          <div v-for="(k, i) in kpis" :key="k.label" :class="['kpi', `kpi--${i}`]">
            <div class="kpi-header">
              <span class="kpi-label">{{ k.label }}</span>
              <span class="kpi-icon" v-html="k.svg"></span>
            </div>
            <div class="kpi-value">{{ k.value }}</div>
            <div class="kpi-sub">{{ k.sub }}</div>
            <div class="kpi-track"><div class="kpi-fill" :style="`width:${k.pct}%`"></div></div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">Actividad Reciente</div>
            <div class="pill">Últimas 5</div>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha / Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in citas.slice(0,5)" :key="c.id">
                <td>
                  <div class="cell-client">
                    <div class="ava" :style="`background:${avatarColor(c.cliente)}`">{{ c.cliente[0] }}</div>
                    <span>{{ c.cliente }}</span>
                  </div>
                </td>
                <td>{{ c.servicio }}</td>
                <td>
                  <span class="cell-date">{{ c.fecha }}</span>
                  <span class="cell-time">{{ c.hora }}</span>
                </td>
                <td><span :class="['stato', `stato--${c.estado}`]">{{ c.estado }}</span></td>
                <td>
                  <div class="cell-actions">
                    <button class="act act--ok"   @click="updateEstado(c.id,'confirmada')" title="Confirmar">✓</button>
                    <button class="act act--done" @click="updateEstado(c.id,'completada')" title="Completar">◎</button>
                    <button class="act act--del"  @click="updateEstado(c.id,'cancelada')"  title="Cancelar">✕</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── CITAS ─── -->
      <div v-if="activeTab === 'citas'" class="view-panel">
        <div class="toolbar">
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="citaSearch" placeholder="Buscar cliente o servicio…" />
          </div>
          <div class="filter-pills">
            <button
              v-for="f in filterOpts"
              :key="f.value"
              :class="['fpill', { active: citaFilter === f.value }]"
              @click="citaFilter = f.value"
            >{{ f.label }}</button>
          </div>
        </div>

        <div class="panel-card">
          <table class="tbl">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredCitas" :key="c.id">
                <td>
                  <div class="cell-client">
                    <div class="ava" :style="`background:${avatarColor(c.cliente)}`">{{ c.cliente[0] }}</div>
                    <span>{{ c.cliente }}</span>
                  </div>
                </td>
                <td class="muted">{{ c.vehiculo }}</td>
                <td>{{ c.servicio }}</td>
                <td>
                  <span class="cell-date">{{ c.fecha }}</span>
                  <span class="cell-time">{{ c.hora }}</span>
                </td>
                <td class="cell-money">${{ c.monto }}</td>
                <td><span :class="['stato', `stato--${c.estado}`]">{{ c.estado }}</span></td>
                <td>
                  <div class="cell-actions">
                    <button class="act act--ok"    @click="updateEstado(c.id,'confirmada')">✓</button>
                    <button class="act act--done"  @click="updateEstado(c.id,'completada')">◎</button>
                    <button class="act act--del"   @click="updateEstado(c.id,'cancelada')">✕</button>
                    <button class="act act--trash" @click="deleteCita(c.id)">⌫</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredCitas.length">
                <td colspan="7" class="empty-row">
                  <div class="empty-msg">Sin resultados para esta búsqueda</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── CLIENTES ─── -->
      <div v-if="activeTab === 'clientes'" class="view-panel">
        <div class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">Usuarios registrados</div>
            <div class="pill">{{ clientes.length }} total</div>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in clientes" :key="u.id">
                <td>
                  <div class="cell-client">
                    <div class="ava" :style="`background:${avatarColor(u.name)}`">{{ u.name[0] }}</div>
                    <span>{{ u.name }}</span>
                  </div>
                </td>
                <td class="mono muted">{{ u.username }}</td>
                <td class="muted">{{ u.email }}</td>
                <td class="muted">{{ u.phone || '—' }}</td>
                <td><span :class="['stato', u.role==='admin' ? 'stato--confirmada' : 'stato--completada']">{{ u.role }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── PANEL AVANZADO ─── -->
      <div v-if="activeTab === 'panel'" class="view-panel view-panel--full">
        <AdminPanel />
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
import { useToast } from '../stores/toast'
import AdminPanel from '../components/AdminPanel.vue'

const auth = useAuthStore()
const citasStore = useCitasStore()
const toast = useToast()

const activeTab = ref('dashboard')
const citaSearch = ref('')
const citaFilter = ref('todos')

const tabs = [
  {
    id: 'dashboard', label: 'Dashboard',
    svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  },
  {
    id: 'citas', label: 'Citas',
    svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  },
  {
    id: 'clientes', label: 'Clientes',
    svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    id: 'panel', label: 'Panel Avanzado',
    svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 8h.01M6 12h.01M10 8h8M10 12h5"/></svg>`
  },
]

const filterOpts = [
  { value: 'todos',      label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada',  label: 'Cancelada' },
]

const currentTab    = computed(() => tabs.find(t => t.id === activeTab.value))
const citas         = computed(() => citasStore.citas)
const clientes      = computed(() => auth.getUsers())

const filteredCitas = computed(() => citas.value.filter(c => {
  const mF = citaFilter.value === 'todos' || c.estado === citaFilter.value
  const mS = !citaSearch.value ||
    c.cliente.toLowerCase().includes(citaSearch.value.toLowerCase()) ||
    c.servicio.toLowerCase().includes(citaSearch.value.toLowerCase())
  return mF && mS
}))

const todayStr = computed(() =>
  new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const total  = computed(() => citas.value.length)
const pend   = computed(() => citas.value.filter(c => c.estado === 'pendiente').length)
const done   = computed(() => citas.value.filter(c => c.estado === 'completada').length)
const income = computed(() => citas.value.filter(c => c.estado === 'completada').reduce((s,c) => s+(c.monto||0), 0))

const kpis = computed(() => [
  { label: 'Total Citas',  value: total.value,        sub: 'registradas',  pct: Math.min(100, total.value*10), svg:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>` },
  { label: 'Pendientes',   value: pend.value,         sub: 'por atender',  pct: Math.min(100, pend.value*20),  svg:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { label: 'Completadas',  value: done.value,         sub: 'finalizadas',  pct: Math.min(100, done.value*20),  svg:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` },
  { label: 'Ingresos',     value: `$${income.value}`, sub: 'generados',    pct: 70,                            svg:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
])

const avatarColors = ['#ff1a2e','#457b9d','#2a9d8f','#e9c46a','#f4a261','#6a4c93','#1982c4','#8ac926']
function avatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}
function updateEstado(id, estado) {
  citasStore.actualizarEstado(id, estado)
  toast.success(`Cita marcada como ${estado}`)
}
function deleteCita(id) {
  citasStore.eliminarCita(id)
  toast.info('Cita eliminada')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── Shell ── */
.admin-shell {
  display: flex;
  height: calc(100vh - var(--nav-height, 68px));
  font-family: 'Inter', sans-serif;
  background: #0c0c0e;
  color: #e2e2e5;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 230px;
  flex-shrink: 0;
  background: #101012;
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0.875rem;
  overflow-y: auto;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 2rem;
  padding: 0 0.375rem;
}
.brand-mark {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff1a2e, #c0001a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
.brand-name  { font-size: 0.85rem; font-weight: 700; color: #fff; display: block; line-height: 1.2; }
.brand-role  { font-size: 0.65rem; color: rgba(255,255,255,0.28); display: block; font-family: 'JetBrains Mono', monospace; margin-top: 1px; }

.sidenav-group-label {
  font-size: 0.58rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.18);
  padding: 0 0.5rem;
  margin-bottom: 0.4rem;
}
.sidenav { display: flex; flex-direction: column; gap: 0.1rem; }
.sidenav-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.75rem;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255,255,255,0.38);
  font-size: 0.84rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
}
.sidenav-item:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.75); }
.sidenav-item.active {
  background: rgba(255,26,46,0.1);
  color: #ff4455;
  border-color: rgba(255,26,46,0.18);
}
.sidenav-icon { display: flex; align-items: center; flex-shrink: 0; }
.sidenav-label { flex: 1; }

.sys-status {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 0.75rem;
  background: rgba(34,197,94,0.05);
  border: 1px solid rgba(34,197,94,0.1);
  border-radius: 9px;
}
.sys-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  flex-shrink: 0;
  animation: blink 2.5s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.sys-label { font-size: 0.6rem; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; display: block; }
.sys-value { font-size: 0.72rem; color: #22c55e; font-weight: 600; display: block; }

/* ── Main Area ── */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: #101012;
  flex-shrink: 0;
}
.topbar-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.015em;
  margin-bottom: 0.15rem;
}
.topbar-date {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.28);
  font-family: 'JetBrains Mono', monospace;
  text-transform: capitalize;
}
.topbar-right { display: flex; align-items: center; gap: 1.25rem; }
.topbar-stat { display: flex; flex-direction: column; align-items: flex-end; }
.ts-value { font-size: 1.05rem; font-weight: 700; color: #fff; line-height: 1; }
.ts-value.green { color: #4ade80; }
.ts-label { font-size: 0.62rem; color: rgba(255,255,255,0.28); font-family: 'JetBrains Mono', monospace; margin-top: 0.1rem; }
.topbar-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.07); }

/* ── View Panel ── */
.view-panel {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.07) transparent;
}

/* ── KPI Row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.875rem;
}
.kpi {
  background: #101012;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1.25rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: border-color 0.2s, transform 0.2s;
}
.kpi:hover { border-color: rgba(255,26,46,0.25); transform: translateY(-1px); }
.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem; }
.kpi-label { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.12em; }
.kpi-icon { color: rgba(255,255,255,0.15); }
.kpi-value { font-size: 1.9rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.1; }
.kpi-sub { font-size: 0.67rem; color: rgba(255,255,255,0.22); font-family: 'JetBrains Mono', monospace; }
.kpi-track { height: 2px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 0.6rem; overflow: hidden; }
.kpi-fill { height: 100%; background: linear-gradient(90deg, #ff1a2e, #ff6670); border-radius: 2px; }
.kpi--3 .kpi-value { color: #4ade80; }
.kpi--3 .kpi-fill { background: linear-gradient(90deg, #22c55e, #86efac); }

/* ── Panel Card ── */
.panel-card {
  background: #101012;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;
}
.panel-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.panel-card-title { font-size: 0.84rem; font-weight: 600; color: #fff; }
.pill {
  font-size: 0.62rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 0.18rem 0.6rem;
  border-radius: 100px;
}

/* ── Table ── */
.tbl { width: 100%; border-collapse: collapse; }
.tbl thead tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
.tbl th {
  padding: 0.7rem 1.25rem;
  font-size: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255,255,255,0.22);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  text-align: left;
  white-space: nowrap;
  font-weight: 500;
}
.tbl td {
  padding: 0.85rem 1.25rem;
  font-size: 0.84rem;
  color: rgba(255,255,255,0.55);
  border-bottom: 1px solid rgba(255,255,255,0.03);
  vertical-align: middle;
}
.tbl tbody tr { transition: background 0.12s; }
.tbl tbody tr:hover td { background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.82); }
.tbl tbody tr:last-child td { border-bottom: none; }

.cell-client { display: flex; align-items: center; gap: 0.6rem; }
.cell-client span { font-weight: 600; color: #f0f0f2; font-size: 0.84rem; }
.ava {
  width: 30px; height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.74rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  flex-shrink: 0;
}
.cell-date { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.6); font-family: 'JetBrains Mono', monospace; }
.cell-time { display: block; font-size: 0.67rem; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; margin-top: 0.1rem; }
.cell-money { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #4ade80 !important; }
.cell-actions { display: flex; gap: 0.28rem; }
.muted { color: rgba(255,255,255,0.3) !important; }
.mono  { font-family: 'JetBrains Mono', monospace; }

/* ── Badges ── */
.stato {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 5px;
  font-size: 0.62rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.stato--pendiente  { background: rgba(251,191,36,0.08);  color: #fbbf24; }
.stato--confirmada { background: rgba(59,130,246,0.08);  color: #60a5fa; }
.stato--completada { background: rgba(34,197,94,0.08);   color: #4ade80; }
.stato--cancelada  { background: rgba(239,68,68,0.08);   color: #f87171; }

/* ── Action buttons ── */
.act {
  width: 26px; height: 26px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.14s ease;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}
.act--ok    { background: rgba(59,130,246,0.07); color: #60a5fa; border-color: rgba(59,130,246,0.13); }
.act--done  { background: rgba(34,197,94,0.07);  color: #4ade80; border-color: rgba(34,197,94,0.13); }
.act--del   { background: rgba(251,191,36,0.07); color: #fbbf24; border-color: rgba(251,191,36,0.13); }
.act--trash { background: rgba(239,68,68,0.07);  color: #f87171; border-color: rgba(239,68,68,0.13); }
.act:hover  { transform: scale(1.15); filter: brightness(1.3); }

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-wrap: wrap;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #101012;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px;
  padding: 0.5rem 0.85rem;
  color: rgba(255,255,255,0.25);
  transition: border-color 0.18s;
}
.search-box:focus-within { border-color: rgba(255,26,46,0.35); }
.search-box input {
  background: none;
  border: none;
  outline: none;
  color: #e2e2e5;
  font-size: 0.82rem;
  font-family: 'Inter', sans-serif;
  width: 210px;
}
.search-box input::placeholder { color: rgba(255,255,255,0.2); }

.filter-pills { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.fpill {
  padding: 0.38rem 0.8rem;
  border-radius: 7px;
  border: 1px solid rgba(255,255,255,0.07);
  background: transparent;
  color: rgba(255,255,255,0.3);
  font-size: 0.74rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.14s ease;
}
.fpill:hover  { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.65); }
.fpill.active { background: rgba(255,26,46,0.1); color: #ff4455; border-color: rgba(255,26,46,0.22); }

/* ── Empty ── */
.empty-row td { text-align: center; padding: 3rem !important; }
.empty-msg { color: rgba(255,255,255,0.18); font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }

/* ── Responsive — Full Coverage ── */

/* Large tablets (≤1024px) */
@media (max-width: 1024px) {
  .kpi-row { grid-template-columns: 1fr 1fr; }
  .tbl th, .tbl td { padding-left: 1rem; padding-right: 1rem; }
}

/* Tablets (≤768px) — sidebar becomes top bar */
@media (max-width: 768px) {
  .admin-shell { flex-direction: column; height: auto; min-height: 100vh; }

  /* Sidebar → horizontal top nav */
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    gap: 0.5rem;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .sidebar-top { display: flex; flex-direction: row; align-items: center; gap: 0.75rem; flex-wrap: wrap; width: 100%; }
  .brand { margin-bottom: 0; }
  .brand-role { display: none; }
  .sidenav { flex-direction: row; gap: 0.25rem; }
  .sidenav-item { padding: 0.5rem 0.85rem; font-size: 0.8rem; white-space: nowrap; }
  .sidenav-group-label, .sidebar-bottom { display: none; }

  /* Main */
  .main-area { overflow: visible; }
  .topbar { padding: 0.875rem 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
  .topbar-right { gap: 1rem; }
  .view-panel { padding: 1.25rem 1rem; gap: 1rem; overflow-y: visible; }

  /* KPIs */
  .kpi-row { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .kpi { padding: 1rem 1rem 0.875rem; }
  .kpi-value { font-size: 1.6rem; }

  /* Table: horizontal scroll */
  .panel-card { overflow-x: auto; }
  .tbl { min-width: 600px; }

  /* Toolbar */
  .toolbar { flex-direction: column; align-items: stretch; gap: 0.75rem; }
  .search-box { width: 100%; }
  .search-box input { width: 100%; }
  .filter-pills { flex-wrap: wrap; }
}

/* Mobile (≤480px) */
@media (max-width: 480px) {
  .sidebar { padding: 0.6rem 0.875rem; }
  .brand-name { font-size: 0.78rem; }
  .brand-mark { width: 28px; height: 28px; font-size: 0.58rem; border-radius: 7px; }
  .sidenav-item { padding: 0.45rem 0.65rem; font-size: 0.75rem; }
  .sidenav-icon svg { width: 13px; height: 13px; }

  .topbar { padding: 0.75rem 0.875rem; }
  .topbar-title { font-size: 0.95rem; }
  .topbar-right { display: none; } /* hidden on tiny screens — info is in KPIs */

  .view-panel { padding: 1rem 0.875rem; }
  .kpi-row { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
  .kpi { padding: 0.875rem 0.875rem 0.75rem; }
  .kpi-value { font-size: 1.4rem; }
  .kpi-label { font-size: 0.58rem; }

  .tbl { min-width: 520px; }
  .tbl th { padding: 0.6rem 0.875rem; font-size: 0.58rem; }
  .tbl td { padding: 0.75rem 0.875rem; font-size: 0.8rem; }
  .ava { width: 26px; height: 26px; font-size: 0.68rem; border-radius: 6px; }

  .panel-card-header { padding: 0.75rem 1rem; }
  .fpill { font-size: 0.68rem; padding: 0.3rem 0.6rem; }
}

/* Very small phones (≤360px) */
@media (max-width: 360px) {
  .kpi-row { grid-template-columns: 1fr; }
  .sidenav-label { display: none; }
  .sidenav-item { padding: 0.4rem 0.6rem; }
}

/* ── Panel Avanzado ── */
.view-panel--full {
  padding: 0 !important;
  overflow-y: auto;
  overflow-x: hidden;
}

/* When panel tab is active, let main-area scroll */
.admin-shell:has(.view-panel--full) .main-area {
  overflow-y: auto;
}

</style>