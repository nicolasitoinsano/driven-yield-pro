<template>
  <div class="mecanicos-page">

    <!-- HEADER -->
    <div class="page-header">
      <div class="header-content">
        <h1>🔧 Panel de Mecánicos</h1>
        <p>Rendimiento, ingresos y gestión del equipo</p>
      </div>
      <button v-if="isAdmin" class="btn-primary" @click="abrirModalCrear">
        + Nuevo Mecánico
      </button>
    </div>

    <!-- STATS GENERALES -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👨‍🔧</div>
        <div class="stat-info">
          <span class="stat-value">{{ mecanicos.length }}</span>
          <span class="stat-label">Total Mecánicos</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ mecanicosDisponibles }}</span>
          <span class="stat-label">Disponibles</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ totalCitas }}</span>
          <span class="stat-label">Citas Totales</span>
        </div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="stat-value">{{ formatPeso(totalIngresos) }}</span>
          <span class="stat-label">Ingresos Totales</span>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando mecánicos...</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <button @click="cargarMecanicos" class="btn-secondary">Reintentar</button>
    </div>

    <template v-else>

      <!-- RANKING TOP 3 -->
      <div class="section-title">🏆 Ranking por Ingresos</div>
      <div class="ranking-grid">
        <div
          v-for="(m, i) in rankingTop3"
          :key="m.id"
          class="ranking-card"
          :class="['pos-' + (i+1)]"
        >
          <div class="ranking-pos">{{ ['🥇','🥈','🥉'][i] }}</div>
          <div class="ranking-nombre">{{ m.nombre }}</div>
          <div class="ranking-especialidad">{{ m.especialidad || 'Sin especialidad' }}</div>
          <div class="ranking-monto">{{ formatPeso(m.total_generado) }}</div>
          <div class="ranking-citas">{{ m.citas_completadas || 0 }} citas completadas</div>
        </div>
      </div>

      <!-- TABLA -->
      <div class="section-title">👨‍🔧 Todos los Mecánicos</div>
      <div class="table-container">
        <table class="mecanicos-table">
          <thead>
            <tr>
              <th>Mecánico</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Citas</th>
              <th>Completadas</th>
              <th>Ingresos</th>
              <th v-if="isAdmin">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in mecanicos"
              :key="m.id"
              @click="verDetalle(m)"
              class="table-row"
            >
              <td>
                <div class="mecanico-nombre">
                  <div class="avatar">{{ m.nombre.charAt(0) }}</div>
                  <div>
                    <strong>{{ m.nombre }}</strong>
                    <small v-if="m.telefono">{{ m.telefono }}</small>
                  </div>
                </div>
              </td>
              <td>{{ m.especialidad || '—' }}</td>
              <td>
                <span class="badge" :class="m.disponible ? 'badge-green' : 'badge-red'">
                  {{ m.disponible ? 'Disponible' : 'No disponible' }}
                </span>
              </td>
              <td>{{ m.total_citas || 0 }}</td>
              <td>{{ m.citas_completadas || 0 }}</td>
              <td class="monto">{{ formatPeso(m.total_generado) }}</td>
              <td v-if="isAdmin" @click.stop>
                <button class="btn-icon" @click="abrirModalEditar(m)">✏️</button>
                <button class="btn-icon btn-danger" @click="confirmarEliminar(m)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </template>

    <!-- MODAL DETALLE -->
    <div v-if="mecanicoDetalle" class="modal-overlay" @click.self="mecanicoDetalle = null">
      <div class="modal">
        <button class="modal-close" @click="mecanicoDetalle = null">✕</button>
        <div v-if="loadingDetalle" class="loading-state"><div class="spinner"></div></div>
        <template v-else-if="detalle">
          <h2>{{ detalle.mecanico.nombre }}</h2>
          <p class="detalle-especialidad">{{ detalle.mecanico.especialidad || 'Sin especialidad' }}</p>
          <div class="detalle-stats">
            <div class="detalle-stat">
              <span class="ds-value">{{ detalle.resumen.total_citas }}</span>
              <span class="ds-label">Total citas</span>
            </div>
            <div class="detalle-stat green">
              <span class="ds-value">{{ detalle.resumen.completadas }}</span>
              <span class="ds-label">Completadas</span>
            </div>
            <div class="detalle-stat yellow">
              <span class="ds-value">{{ detalle.resumen.pendientes }}</span>
              <span class="ds-label">Pendientes</span>
            </div>
            <div class="detalle-stat blue">
              <span class="ds-value">{{ formatPeso(detalle.resumen.total_generado) }}</span>
              <span class="ds-label">Total generado</span>
            </div>
          </div>
          <div class="detalle-citas">
            <h3>Historial de citas</h3>
            <div v-if="detalle.citas.length === 0" class="empty">Sin citas registradas</div>
            <div v-for="c in detalle.citas" :key="c.id" class="cita-item">
              <div class="cita-info">
                <strong>{{ c.cliente }}</strong>
                <small>{{ c.vehiculo }} · {{ c.servicio }}</small>
                <small>{{ c.fecha }} {{ c.hora }}</small>
              </div>
              <div class="cita-right">
                <span class="badge" :class="badgeEstado(c.estado)">{{ c.estado }}</span>
                <span class="cita-monto">{{ formatPeso(c.monto) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- MODAL CREAR/EDITAR -->
    <div v-if="modalForm" class="modal-overlay" @click.self="modalForm = false">
      <div class="modal modal-form">
        <button class="modal-close" @click="modalForm = false">✕</button>
        <h2>{{ editando ? 'Editar Mecánico' : 'Nuevo Mecánico' }}</h2>
        <div class="form-group">
          <label>Nombre *</label>
          <input v-model="form.nombre" placeholder="Nombre completo" />
        </div>
        <div class="form-group">
          <label>Especialidad</label>
          <input v-model="form.especialidad" placeholder="Ej: Motor y transmisión" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input v-model="form.telefono" placeholder="Ej: 3001234567" />
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select v-model="form.disponible">
            <option :value="true">Disponible</option>
            <option :value="false">No disponible</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn-secondary" @click="modalForm = false">Cancelar</button>
          <button class="btn-primary" @click="guardarMecanico" :disabled="guardando">
            {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
      </div>
    </div>

    <!-- MODAL CONFIRMAR ELIMINAR -->
    <div v-if="mecanicoAEliminar" class="modal-overlay" @click.self="mecanicoAEliminar = null">
      <div class="modal modal-confirm">
        <h2>⚠️ Eliminar mecánico</h2>
        <p>¿Estás seguro de eliminar a <strong>{{ mecanicoAEliminar.nombre }}</strong>?</p>
        <p class="confirm-warning">Sus citas quedarán sin mecánico asignado.</p>
        <div class="form-actions">
          <button class="btn-secondary" @click="mecanicoAEliminar = null">Cancelar</button>
          <button class="btn-danger-full" @click="eliminarMecanico" :disabled="eliminando">
            {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')
const token   = computed(() => auth.token)
const API     = 'http://localhost:8000'

const mecanicos         = ref([])
const loading           = ref(true)
const error             = ref(null)
const mecanicoDetalle   = ref(null)
const detalle           = ref(null)
const loadingDetalle    = ref(false)
const modalForm         = ref(false)
const editando          = ref(false)
const guardando         = ref(false)
const formError         = ref('')
const mecanicoAEliminar = ref(null)
const eliminando        = ref(false)
const form = ref({ nombre: '', especialidad: '', telefono: '', disponible: true })

const mecanicosDisponibles = computed(() => mecanicos.value.filter(m => m.disponible).length)
const totalCitas           = computed(() => mecanicos.value.reduce((s, m) => s + (m.total_citas || 0), 0))
const totalIngresos        = computed(() => mecanicos.value.reduce((s, m) => s + (m.total_generado || 0), 0))
const rankingTop3          = computed(() =>
  [...mecanicos.value].sort((a, b) => b.total_generado - a.total_generado).slice(0, 3)
)

const formatPeso = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0)

const badgeEstado = (e) => ({
  completada: 'badge-green',
  pendiente:  'badge-yellow',
  cancelada:  'badge-red',
  confirmada: 'badge-blue',
}[e] || 'badge-gray')

const headers = () => ({ 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' })

async function cargarMecanicos() {
  loading.value = true
  error.value   = null
  try {
    const r = await fetch(`${API}/api/mecanicos`)
    const d = await r.json()
    mecanicos.value = d.mecanicos || []
  } catch {
    error.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

async function verDetalle(m) {
  mecanicoDetalle.value = m
  detalle.value         = null
  loadingDetalle.value  = true
  try {
    const r = await fetch(`${API}/api/mecanicos/${m.id}/ingresos`, { headers: headers() })
    detalle.value = await r.json()
  } catch {
    detalle.value = null
  } finally {
    loadingDetalle.value = false
  }
}

function abrirModalCrear() {
  editando.value  = false
  form.value      = { nombre: '', especialidad: '', telefono: '', disponible: true }
  formError.value = ''
  modalForm.value = true
}

function abrirModalEditar(m) {
  editando.value  = true
  form.value      = { nombre: m.nombre, especialidad: m.especialidad || '', telefono: m.telefono || '', disponible: m.disponible }
  formError.value = ''
  modalForm.value = true
  mecanicoDetalle.value = m
}

async function guardarMecanico() {
  if (!form.value.nombre.trim()) { formError.value = 'El nombre es obligatorio'; return }
  guardando.value = true
  formError.value = ''
  try {
    const id  = editando.value ? mecanicoDetalle.value.id : null
    const url = id ? `${API}/api/mecanicos/${id}` : `${API}/api/mecanicos`
    const r   = await fetch(url, { method: id ? 'PUT' : 'POST', headers: headers(), body: JSON.stringify(form.value) })
    if (!r.ok) { const e = await r.json(); formError.value = e.detail || 'Error al guardar'; return }
    modalForm.value = false
    await cargarMecanicos()
  } catch {
    formError.value = 'Error de conexión'
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(m) { mecanicoAEliminar.value = m }

async function eliminarMecanico() {
  eliminando.value = true
  try {
    await fetch(`${API}/api/mecanicos/${mecanicoAEliminar.value.id}`, { method: 'DELETE', headers: headers() })
    mecanicoAEliminar.value = null
    await cargarMecanicos()
  } catch {
    alert('Error al eliminar')
  } finally {
    eliminando.value = false
  }
}

onMounted(cargarMecanicos)
</script>

<style scoped>
.mecanicos-page { max-width: 1200px; margin: 0 auto; padding: 6rem 1.5rem 2rem; font-family: inherit; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.page-header h1 { font-size: 1.8rem; font-weight: 700; margin: 0; color: white; }
.page-header p  { color: #6b7280; margin: 0.25rem 0 0; }
.btn-primary    { background: #f59e0b; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-primary:hover { background: #d97706; }
.btn-secondary  { background: #374151; color: #e5e7eb; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-danger-full { background: #ef4444; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-icon       { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 0.3rem; border-radius: 4px; }
.btn-icon:hover { background: rgba(255,255,255,0.1); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card  { background: #1f2937; border-radius: 12px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.3); }
.stat-card.highlight { background: #1f2937; border: 1px solid #f59e0b; }
.stat-icon  { font-size: 2rem; }
.stat-value { font-size: 1.4rem; font-weight: 700; display: block; color: white; }
.stat-label { font-size: 0.8rem; color: #6b7280; }
.section-title { font-size: 1.1rem; font-weight: 700; margin: 2rem 0 1rem; color: white; }
.ranking-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.ranking-card { background: #1f2937; border-radius: 12px; padding: 1.5rem; text-align: center; border-top: 4px solid #374151; }
.ranking-card.pos-1 { border-color: #f59e0b; background: #1f2937; }
.ranking-card.pos-2 { border-color: #9ca3af; }
.ranking-card.pos-3 { border-color: #d97706; }
.ranking-pos  { font-size: 2.5rem; }
.ranking-nombre { font-weight: 700; font-size: 1rem; margin: 0.5rem 0 0.2rem; color: white; }
.ranking-especialidad { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.8rem; }
.ranking-monto { font-size: 1.2rem; font-weight: 700; color: #059669; }
.ranking-citas { font-size: 0.75rem; color: #6b7280; margin-top: 0.3rem; }
.table-container { background: #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.3); }
.mecanicos-table { width: 100%; border-collapse: collapse; }
.mecanicos-table th { background: #111827; padding: 0.9rem 1rem; text-align: left; font-size: 0.8rem; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.mecanicos-table td { padding: 0.9rem 1rem; border-top: 1px solid #374151; font-size: 0.9rem; color: #e5e7eb; }
.table-row { cursor: pointer; transition: background .15s; }
.table-row:hover { background: #374151; }
.mecanico-nombre { display: flex; align-items: center; gap: 0.8rem; }
.mecanico-nombre strong { display: block; color: white; }
.mecanico-nombre small  { color: #6b7280; font-size: 0.78rem; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #f59e0b; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
.monto  { font-weight: 600; color: #059669; }
.badge        { padding: 0.25rem 0.65rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-green  { background: #064e3b; color: #6ee7b7; }
.badge-red    { background: #7f1d1d; color: #fca5a5; }
.badge-yellow { background: #78350f; color: #fcd34d; }
.badge-blue   { background: #1e3a5f; color: #93c5fd; }
.badge-gray   { background: #374151; color: #9ca3af; }
.loading-state { text-align: center; padding: 3rem; color: #6b7280; }
.error-state   { text-align: center; padding: 2rem; color: #ef4444; }
.spinner { width: 36px; height: 36px; border: 3px solid #374151; border-top-color: #f59e0b; border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal { background: #1f2937; border-radius: 16px; padding: 2rem; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; color: #e5e7eb; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #6b7280; }
.modal h2 { margin: 0 0 0.3rem; font-size: 1.3rem; color: white; }
.detalle-especialidad { color: #6b7280; margin-bottom: 1.5rem; }
.detalle-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.detalle-stat { background: #111827; border-radius: 10px; padding: 1rem; text-align: center; }
.detalle-stat.green  { background: #064e3b; }
.detalle-stat.yellow { background: #78350f; }
.detalle-stat.blue   { background: #1e3a5f; }
.ds-value { display: block; font-size: 1.3rem; font-weight: 700; color: white; }
.ds-label { font-size: 0.78rem; color: #9ca3af; }
.detalle-citas h3 { font-size: 1rem; margin-bottom: 0.8rem; color: white; }
.cita-item { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-radius: 8px; background: #111827; margin-bottom: 0.5rem; gap: 1rem; }
.cita-info strong { display: block; font-size: 0.9rem; color: white; }
.cita-info small  { display: block; color: #6b7280; font-size: 0.78rem; }
.cita-right { text-align: right; flex-shrink: 0; }
.cita-monto { display: block; font-weight: 600; color: #059669; font-size: 0.85rem; margin-top: 0.3rem; }
.empty { color: #6b7280; text-align: center; padding: 1rem; }
.modal-form .form-group { margin-bottom: 1rem; }
.modal-form label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: #e5e7eb; }
.modal-form input, .modal-form select { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #374151; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box; background: #111827; color: #e5e7eb; }
.form-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 1.5rem; }
.form-error { color: #ef4444; font-size: 0.85rem; margin-top: 0.8rem; text-align: center; }
.modal-confirm { max-width: 400px; text-align: center; }
.modal-confirm h2 { margin-bottom: 1rem; }
.confirm-warning { color: #ef4444; font-size: 0.85rem; }
</style>