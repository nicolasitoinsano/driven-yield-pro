<template>
  <main class="perfil-root">
    
    <!-- Background effects -->
    <div class="bg-grid"></div>
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>

    <div class="perfil-header observe-me">
      <div class="header-inner">
        <div class="header-text">
          <p class="hero-eyebrow">CENTRO DE CONTROL DE CLIENTE</p>
          <h1 class="hero-title">GARAGE <span>VIRTUAL</span></h1>
          <p class="hero-sub">Historial de telemetría y mantenimientos de tu flota.</p>
        </div>
        <div class="user-badge">
          <div class="user-avatar">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</div>
          <div class="user-info">
            <span class="user-name">{{ user?.name }}</span>
            <span class="user-role"><span class="pulse-dot"></span> OPERADOR AUTORIZADO</span>
          </div>
        </div>
      </div>
    </div>

    <div class="perfil-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar observe-me" style="transition-delay: 0.1s">
        <nav class="sidebar-nav matte-card">
          <button :class="['nav-btn', { active: activeTab === 'garage' }]" @click="activeTab = 'garage'">
            <span class="nav-icon">🚗</span> GARAGE Y VEHÍCULOS
          </button>
          <button :class="['nav-btn', { active: activeTab === 'citas' }]" @click="activeTab = 'citas'">
            <span class="nav-icon">⏱️</span> HISTORIAL DE SERVICIOS
          </button>
          <button :class="['nav-btn', { active: activeTab === 'info' }]" @click="activeTab = 'info'">
            <span class="nav-icon">🔒</span> CREDENCIALES
          </button>
          <button class="nav-btn text-red" @click="handleLogout">
            <span class="nav-icon">⏏️</span> CERRAR SESIÓN
          </button>
        </nav>

        <div class="stats-card matte-card" style="margin-top: 1.5rem">
          <h4 class="stats-title">ESTADÍSTICAS GLOBALES</h4>
          <div class="stat-row">
            <span>Vehículos Registrados</span>
            <strong>{{ vehiculos.length }}</strong>
          </div>
          <div class="stat-row">
            <span>Servicios Totales</span>
            <strong>{{ citas.length }}</strong>
          </div>
          <div class="stat-row">
            <span>Citas Pendientes</span>
            <strong class="text-primary">{{ citas.filter(c => c.estado === 'pendiente').length }}</strong>
          </div>
        </div>
      </aside>

      <!-- CONTENT -->
      <div class="content-area observe-me" style="transition-delay: 0.2s">
        
        <!-- CARGANDO -->
        <div v-if="loadingData" class="loading-state">
          <div class="spinner"></div>
          <p>ESTABLECIENDO CONEXIÓN SEGURA...</p>
        </div>

        <transition v-else name="fade" mode="out-in">
          
          <!-- TAB: GARAGE -->
          <div v-if="activeTab === 'garage'" key="garage" class="tab-panel">
            <div class="panel-header">
              <h2 class="panel-title">FLOTA <span>REGISTRADA</span></h2>
              <p class="panel-desc">Vehículos vinculados a este perfil operativo.</p>
            </div>

            <div v-if="vehiculos.length === 0" class="empty-state matte-card">
              <span class="empty-icon">∅</span>
              <h3>Sin vehículos registrados</h3>
              <p>Tu expediente está vacío. Los vehículos se registrarán automáticamente al agendar tu primer servicio.</p>
              <router-link to="/agendar" class="btn btn-primary mt-4">AGENDAR SERVICIO →</router-link>
            </div>

            <div v-else class="vehicles-grid">
              <div v-for="v in vehiculos" :key="v.id_vehiculo" class="vehicle-card matte-card">
                <div class="v-header">
                  <div class="v-plate">{{ v.numero_de_placa || 'SIN PLACA' }}</div>
                  <div class="v-year">{{ v.año }}</div>
                </div>
                <div class="v-body">
                  <h3 class="v-brand">{{ v.marca }}</h3>
                  <p class="v-model">{{ v.modelo }}</p>
                  <p class="v-color">Color: {{ v.color }}</p>
                </div>
                <div class="v-footer">
                  <router-link :to="{ path: '/agendar', query: { placa: v.numero_de_placa } }" class="btn btn-ghost btn-sm">
                    NUEVO SERVICIO
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: HISTORIAL CITAS -->
          <div v-else-if="activeTab === 'citas'" key="citas" class="tab-panel">
            <div class="panel-header">
              <h2 class="panel-title">REGISTRO DE <span>TELEMETRÍA</span></h2>
              <p class="panel-desc">Historial completo de intervenciones mecánicas.</p>
            </div>

            <div v-if="citas.length === 0" class="empty-state matte-card">
              <span class="empty-icon">∅</span>
              <h3>Sin historial de servicios</h3>
              <p>Aún no se han registrado intervenciones en tus vehículos.</p>
            </div>

            <div v-else class="timeline">
              <div v-for="(cita, idx) in citas" :key="cita.id" class="timeline-item">
                <div class="tl-dot"></div>
                <div class="tl-content matte-card">
                  <div class="tl-header">
                    <span class="tl-date">{{ cita.fecha }} | {{ cita.hora }}</span>
                    <span :class="['status-badge', cita.estado]">{{ cita.estado }}</span>
                  </div>
                  <h3 class="tl-service">{{ cita.servicio }}</h3>
                  <div class="tl-details">
                    <span>Monto: ${{ cita.monto }} COP</span>
                  </div>
                  <button v-if="cita.estado === 'pendiente'" class="btn btn-ghost btn-sm text-red mt-3" @click="cancelarCita(cita.id)">
                    CANCELAR ORDEN
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: CREDENCIALES -->
          <div v-else-if="activeTab === 'info'" key="info" class="tab-panel">
            <div class="panel-header">
              <h2 class="panel-title">CREDENCIALES DE <span>ACCESO</span></h2>
              <p class="panel-desc">Modifica tu información de contacto y cifrado.</p>
            </div>

            <div class="form-container matte-card">
              <div class="form-group">
                <label>NOMBRE OPERATIVO</label>
                <input v-model="editForm.nombre" type="text" />
              </div>
              <div class="form-group">
                <label>CORREO DE CONTACTO</label>
                <input v-model="editForm.email" type="email" />
              </div>
              <div class="form-group">
                <label>TELÉFONO</label>
                <input v-model="editForm.telefono" type="tel" />
              </div>
              <hr class="form-divider" />
              <p class="form-note">Solo llena esto si deseas cambiar tu contraseña:</p>
              <div class="form-group">
                <label>CLAVE ACTUAL</label>
                <input v-model="editForm.contrasena_actual" type="password" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <label>NUEVA CLAVE</label>
                <input v-model="editForm.contrasena_nueva" type="password" placeholder="••••••••" />
              </div>

              <button class="btn btn-primary" style="margin-top: 1rem" @click="saveProfile">
                ACTUALIZAR EXPEDIENTE
              </button>
            </div>
          </div>

        </transition>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
import { useToast } from '../stores/toast'
import { storeToRefs } from 'pinia'
import { API_BASE_URL } from '../config/api'

const auth = useAuthStore()
const citasStore = useCitasStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { user } = storeToRefs(auth)

const activeTab = ref(route.query.tab || 'garage')
const loadingData = ref(true)
const vehiculos = ref([])
const citas = computed(() => citasStore.citas)
const observer = ref(null)

const editForm = ref({
  nombre: '', email: '', telefono: '', contrasena_actual: '', contrasena_nueva: ''
})

onMounted(async () => {
  if (!user.value) await auth.init()
  if (user.value?.role === 'admin') {
    router.push('/admin')
    return
  }

  editForm.value.nombre = user.value?.name || ''
  editForm.value.email = user.value?.email || ''
  editForm.value.telefono = user.value?.phone || ''

  await citasStore.fetchCitas()
  await fetchPerfilData()

  // Intersection Observer for animations
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible') })
  }, { threshold: 0.1 })
  setTimeout(() => {
    document.querySelectorAll('.observe-me').forEach(el => observer.value?.observe(el))
  }, 100)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

async function fetchPerfilData() {
  loadingData.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/perfil`, { headers: auth.authHeaders() })
    if (res.ok) {
      const data = await res.json()
      vehiculos.value = data.vehiculos || []
    }
  } catch (e) {
    console.error(e)
    toast.error('Error de conexión.')
  } finally {
    loadingData.value = false
  }
}

async function saveProfile() {
  if (!editForm.value.nombre || !editForm.value.email) {
    toast.error('Nombre y email son requeridos')
    return
  }
  const payload = {
    nombre: editForm.value.nombre,
    email: editForm.value.email,
    telefono: editForm.value.telefono
  }
  if (editForm.value.contrasena_nueva) {
    payload.contrasena_actual = editForm.value.contrasena_actual
    payload.contrasena_nueva = editForm.value.contrasena_nueva
  }

  try {
    const res = await fetch(`${API_BASE_URL}/perfil`, {
      method: 'PUT',
      headers: auth.authHeaders(),
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      toast.success('Expediente actualizado.')
      auth.user.name = payload.nombre
      auth.user.email = payload.email
      editForm.value.contrasena_actual = ''
      editForm.value.contrasena_nueva = ''
    } else {
      const err = await res.json()
      toast.error(err.detail || 'Error al actualizar.')
    }
  } catch (e) {
    toast.error('Error de conexión.')
  }
}

async function cancelarCita(id) {
  if(!confirm('¿Estás seguro de cancelar esta orden de servicio?')) return
  try {
    const res = await citasStore.actualizarEstado(id, 'cancelada')
    if (res.ok) {
      toast.success('Orden cancelada.')
    } else {
      toast.error('No se pudo cancelar.')
    }
  } catch (e) {
    toast.error('Error de red.')
  }
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.perfil-root {
  min-height: 100vh; background: var(--bg-base); padding-top: var(--nav-height);
  position: relative; overflow: hidden;
}

.bg-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(rgba(230,0,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(230,0,35,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Animations */
.observe-me { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.observe-me.is-visible { opacity: 1; transform: translateY(0); }

/* Header */
.perfil-header { position: relative; z-index: 1; padding: 4rem 2rem 2rem; max-width: 1200px; margin: 0 auto; }
.header-inner { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: var(--border-matte); padding-bottom: 2rem; }
.hero-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; color: var(--primary); letter-spacing: 3px; margin-bottom: 0.5rem; }
.hero-title { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 900; color: white; line-height: 1; margin-bottom: 0.5rem; }
.hero-title span { color: transparent; -webkit-text-stroke: 1px var(--primary); }
.hero-sub { color: var(--text-secondary); font-size: 1rem; }

.user-badge { display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.02); padding: 0.8rem 1.5rem; border-radius: 8px; border: var(--border-matte); }
.user-avatar { width: 50px; height: 50px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 900; border-radius: 4px; }
.user-info { display: flex; flex-direction: column; }
.user-name { color: white; font-weight: 700; font-size: 1.1rem; }
.user-role { color: var(--text-muted); font-size: 0.7rem; letter-spacing: 1px; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; }
.pulse-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* Layout */
.perfil-layout { display: flex; gap: 2rem; max-width: 1200px; margin: 0 auto; padding: 2rem; position: relative; z-index: 1; }
.sidebar { flex: 0 0 280px; }
.content-area { flex: 1; min-height: 500px; }

/* Sidebar Nav */
.sidebar-nav { display: flex; flex-direction: column; padding: 1rem; gap: 0.5rem; }
.nav-btn { background: transparent; border: 1px solid transparent; color: var(--text-secondary); font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-align: left; padding: 1rem; border-radius: 6px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.8rem; letter-spacing: 1px; }
.nav-btn:hover { background: rgba(255,255,255,0.03); color: white; }
.nav-btn.active { background: rgba(230,0,35,0.1); border-color: rgba(230,0,35,0.3); color: white; }
.nav-icon { font-size: 1.2rem; }
.text-red { color: var(--primary); }
.text-red:hover { background: rgba(230,0,35,0.1); }

.stats-card { padding: 1.5rem; }
.stats-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 1rem; }
.stat-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.8rem; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
.stat-row strong { color: white; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; }
.text-primary { color: var(--primary) !important; text-shadow: 0 0 10px rgba(230,0,35,0.5); }

/* Panels */
.panel-header { margin-bottom: 2rem; }
.panel-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 900; color: white; line-height: 1; margin-bottom: 0.5rem; }
.panel-title span { color: transparent; -webkit-text-stroke: 1px var(--primary); }
.panel-desc { color: var(--text-secondary); font-size: 0.95rem; }

/* Garage Grid */
.vehicles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.vehicle-card { padding: 1.5rem; position: relative; overflow: hidden; border-top: 2px solid var(--primary); }
.vehicle-card::after { content: ''; position: absolute; top:0; right:0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(230,0,35,0.1), transparent); pointer-events: none; }
.v-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.v-plate { background: rgba(255,255,255,0.1); padding: 0.4rem 0.8rem; border-radius: 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 900; color: white; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.2); }
.v-year { color: var(--text-muted); font-size: 0.85rem; font-weight: 700; }
.v-brand { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 900; color: white; line-height: 1.1; }
.v-model { color: var(--primary); font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 700; }
.v-color { color: var(--text-secondary); font-size: 0.85rem; }
.v-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); }

/* Timeline */
.timeline { position: relative; padding-left: 20px; border-left: 2px solid rgba(230,0,35,0.3); display: flex; flex-direction: column; gap: 2rem; }
.timeline-item { position: relative; }
.tl-dot { position: absolute; left: -27px; top: 15px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
.tl-content { padding: 1.5rem; }
.tl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.tl-date { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px; }
.status-badge { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
.pendiente { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
.completada { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
.cancelada { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.tl-service { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
.tl-details { color: var(--text-secondary); font-size: 0.9rem; }

/* Forms */
.form-container { padding: 2rem; max-width: 600px; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; color: var(--primary); letter-spacing: 2px; margin-bottom: 0.5rem; }
.form-group input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1rem; color: white; font-family: 'Outfit', sans-serif; border-radius: 4px; transition: border-color 0.3s; }
.form-group input:focus { border-color: var(--primary); outline: none; }
.form-divider { border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 2rem 0; }
.form-note { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem; }

/* Utilities */
.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-icon { font-size: 3rem; color: rgba(255,255,255,0.1); display: block; margin-bottom: 1rem; }
.empty-state h3 { font-family: 'Space Grotesk', sans-serif; color: white; margin-bottom: 0.5rem; font-size: 1.4rem; }
.empty-state p { color: var(--text-secondary); font-size: 0.9rem; }
.loading-state { text-align: center; padding: 5rem; color: var(--primary); font-family: 'Space Grotesk', sans-serif; letter-spacing: 2px; font-weight: 700; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(230,0,35,0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .perfil-layout { flex-direction: column; }
  .sidebar { flex: none; }
  .header-inner { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
}
</style>
