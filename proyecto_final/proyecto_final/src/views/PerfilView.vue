<template>
  <main class="perfil-root">

    <!-- Background effects -->
    <div class="bg-grid"></div>
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>

    <!-- Hero header -->
    <div class="perfil-hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">Panel de usuario</p>
        <h1 class="hero-title">Mi <span>Perfil</span></h1>
        <p class="hero-sub">Gestiona tu información personal y citas</p>
      </div>
      <div class="hero-deco">PROFILE</div>
    </div>

    <!-- Main layout -->
    <div class="perfil-layout">

      <!-- SIDEBAR -->
      <aside class="sidebar">

        <!-- Avatar card -->
        <div class="avatar-card">
          <div class="avatar-ring">
            <div class="avatar-glow"></div>
            <div class="avatar-circle">{{ user?.name?.charAt(0)?.toUpperCase() }}</div>
          </div>
          <div class="avatar-info">
            <h3 class="avatar-name">{{ user?.name }}</h3>
            <div class="avatar-role">
              <span class="role-dot"></span>
              {{ user?.role === 'admin' ? 'Administrador' : 'Cliente' }}
            </div>
          </div>
          <div class="avatar-stats">
            <div class="av-stat">
              <span class="av-stat-num">{{ misCitas.length }}</span>
              <span class="av-stat-label">Citas</span>
            </div>
            <div class="av-stat-div"></div>
            <div class="av-stat">
              <span class="av-stat-num">{{ citasCompletadas }}</span>
              <span class="av-stat-label">Completadas</span>
            </div>
            <div class="av-stat-div"></div>
            <div class="av-stat">
              <span class="av-stat-num">{{ citasPendientes }}</span>
              <span class="av-stat-label">Pendientes</span>
            </div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <button
            v-for="tab in tabs" :key="tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
            @click="switchTab(tab.id)"
          >
            <span class="nav-icon" v-html="tab.svg"></span>
            <span class="nav-label">{{ tab.label }}</span>
            <span v-if="tab.id === 'citas' && misCitas.length" class="nav-badge">{{ misCitas.length }}</span>
            <svg class="nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </nav>

      </aside>

      <!-- CONTENT -->
      <div class="content-area">
        <transition name="tab-fade" mode="out-in">

          <!-- INFO TAB -->
          <div v-if="activeTab === 'info'" key="info" class="tab-panel">

            <transition name="panel-slide" mode="out-in">

              <!-- VIEW MODE -->
              <div v-if="!editing" key="view">
                <div class="panel-header">
                  <div>
                    <p class="panel-eyebrow">Tus datos</p>
                    <h2 class="panel-title">Información <span>Personal</span></h2>
                  </div>
                  <button class="edit-btn" @click="startEdit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar
                  </button>
                </div>

                <div class="info-grid">
                  <div class="info-card" style="--delay:0.05s">
                    <div class="info-card-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <p class="info-label">Nombre completo</p>
                      <p class="info-value">{{ user?.name }}</p>
                    </div>
                  </div>
                  <div class="info-card" style="--delay:0.1s">
                    <div class="info-card-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                    <div>
                      <p class="info-label">Usuario</p>
                      <p class="info-value">{{ user?.username }}</p>
                    </div>
                  </div>
                  <div class="info-card" style="--delay:0.15s">
                    <div class="info-card-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <p class="info-label">Email</p>
                      <p class="info-value">{{ user?.email }}</p>
                    </div>
                  </div>
                  <div class="info-card" style="--delay:0.2s">
                    <div class="info-card-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p class="info-label">Teléfono</p>
                      <p class="info-value">{{ user?.phone || 'No registrado' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Role badge -->
                <div class="role-section">
                  <div :class="['role-pill', user?.role === 'admin' ? 'role-admin' : 'role-cliente']">
                    <svg v-if="user?.role === 'admin'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ user?.role === 'admin' ? 'Cuenta Administrador' : 'Cuenta Cliente' }}
                  </div>
                </div>
              </div>

              <!-- EDIT MODE -->
              <div v-else key="edit">
                <div class="panel-header">
                  <div>
                    <p class="panel-eyebrow">Modificar datos</p>
                    <h2 class="panel-title">Editar <span>Perfil</span></h2>
                  </div>
                </div>

                <div class="edit-form">
                  <div class="edit-row">
                    <div class="edit-field">
                      <label class="edit-label">Nombre completo <span class="req">*</span></label>
                      <div class="edit-input-wrap">
                        <svg class="edit-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <input v-model="editForm.name" type="text" placeholder="Tu nombre" />
                      </div>
                    </div>
                    <div class="edit-field">
                      <label class="edit-label">Email <span class="req">*</span></label>
                      <div class="edit-input-wrap">
                        <svg class="edit-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <input v-model="editForm.email" type="email" placeholder="tu@email.com" />
                      </div>
                    </div>
                  </div>
                  <div class="edit-field">
                    <label class="edit-label">Teléfono</label>
                    <div class="edit-input-wrap">
                      <svg class="edit-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <input v-model="editForm.phone" type="tel" placeholder="+57 300 000 0000" />
                    </div>
                  </div>
                  <div class="edit-actions">
                    <button class="btn-cancel" @click="editing = false">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Cancelar
                    </button>
                    <button class="btn-save" @click="saveProfile">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </div>

            </transition>
          </div>

          <!-- CITAS TAB -->
          <div v-else-if="activeTab === 'citas'" key="citas" class="tab-panel">
            <div class="panel-header">
              <div>
                <p class="panel-eyebrow">Historial</p>
                <h2 class="panel-title">Mis <span>Citas</span></h2>
              </div>
              <router-link to="/agendar" class="new-cita-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nueva cita
              </router-link>
            </div>

            <div v-if="misCitas.length" class="citas-list">
              <div
                v-for="(cita, i) in misCitas" :key="cita.id"
                class="cita-card"
                :style="`--i:${i}`"
              >
                <div class="cita-accent"></div>
                <div class="cita-body">
                  <div class="cita-top">
                    <div class="cita-main">
                      <h4 class="cita-servicio">{{ cita.servicio }}</h4>
                      <p class="cita-vehiculo">{{ cita.vehiculo }} · {{ cita.placa }}</p>
                    </div>
                    <span :class="['cita-badge', `badge-${cita.estado}`]">{{ cita.estado }}</span>
                  </div>
                  <div class="cita-meta">
                    <div class="cita-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ cita.fecha }}
                    </div>
                    <div class="cita-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ cita.hora }}
                    </div>
                    <div class="cita-meta-item cita-monto">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      ${{ cita.monto }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-ring">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220,38,38,0.5)" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 class="empty-title">Sin citas registradas</h3>
              <p class="empty-sub">Aún no tienes citas agendadas.</p>
              <router-link to="/agendar" class="btn-save" style="display:inline-flex;text-decoration:none;margin-top:1.5rem">
                Agendar ahora
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </router-link>
            </div>
          </div>

        </transition>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
import { useToast } from '../stores/toast'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const citasStore = useCitasStore()
onMounted(() => citasStore.fetchCitas())
const toast = useToast()
const { user } = storeToRefs(auth)
const activeTab = ref('info')
const editing = ref(false)

const tabs = [
  {
    id: 'info', label: 'Información',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
  {
    id: 'citas', label: 'Mis Citas',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
  },
]

const editForm = reactive({ name: '', email: '', phone: '' })

function switchTab(id) {
  activeTab.value = id
  editing.value = false
}

function startEdit() {
  editForm.name = user.value?.name || ''
  editForm.email = user.value?.email || ''
  editForm.phone = user.value?.phone || ''
  editing.value = true
}

function saveProfile() {
  if (!editForm.name || !editForm.email) { toast.error('Nombre y email son requeridos'); return }
  const res = auth.updateProfile({ name: editForm.name, email: editForm.email, phone: editForm.phone })
  if (res.error) { toast.error(res.error); return }
  toast.success('¡Perfil actualizado correctamente!')
  editing.value = false
}

const misCitas = computed(() => citasStore.citas)
const citasCompletadas = computed(() => misCitas.value.filter(c => c.estado === 'completada').length)
const citasPendientes = computed(() => misCitas.value.filter(c => c.estado === 'pendiente').length)
</script>

<style scoped>
/* ── ROOT ── */
.perfil-root {
  min-height: 100vh;
  background: #060606;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding-bottom: 4rem;
}

.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
.bg-orb {
  position: fixed; border-radius: 50%;
  filter: blur(90px); pointer-events: none; z-index: 0;
}
.bg-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%);
  top: -100px; right: -100px;
  animation: orbDrift 14s ease-in-out infinite;
}
.bg-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%);
  bottom: 0; left: -100px;
  animation: orbDrift 18s ease-in-out infinite reverse;
}
@keyframes orbDrift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(30px)} }

/* ── HERO ── */
.perfil-hero {
  position: relative; z-index: 1;
  padding: calc(var(--nav-height) + 3rem) 4rem 2.5rem;
  display: flex; align-items: flex-end; justify-content: space-between;
  overflow: hidden;
  animation: heroIn 0.6s ease both;
}
@keyframes heroIn { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }

.hero-eyebrow {
  font-size: 0.62rem; font-weight: 700;
  color: rgba(220,38,38,0.7);
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900; color: white; line-height: 1;
  letter-spacing: -1px;
}
.hero-title span { color: #dc2626; }
.hero-sub {
  font-size: 0.9rem; color: rgba(255,255,255,0.35);
  margin-top: 0.6rem;
}
.hero-deco {
  font-family: 'Montserrat', sans-serif;
  font-size: 7rem; font-weight: 900;
  color: rgba(220,38,38,0.04);
  line-height: 1; letter-spacing: -2px;
  user-select: none; pointer-events: none;
}

/* ── LAYOUT ── */
.perfil-layout {
  position: relative; z-index: 1;
  display: flex; gap: 1.8rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

/* ── SIDEBAR ── */
.sidebar {
  flex: 0 0 280px;
  display: flex; flex-direction: column; gap: 1rem;
  animation: sidebarIn 0.5s ease 0.1s both;
}
@keyframes sidebarIn { from { opacity:0; transform:translateX(-20px) } to { opacity:1; transform:translateX(0) } }

/* Avatar card */
.avatar-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 1.8rem 1.5rem;
  text-align: center;
  position: relative; overflow: hidden;
  transition: border-color 0.3s;
}
.avatar-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}
.avatar-card:hover { border-color: rgba(220,38,38,0.2); }

.avatar-ring {
  position: relative; width: 88px; height: 88px;
  margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;
}
.avatar-glow {
  position: absolute; inset: -4px; border-radius: 50%;
  background: conic-gradient(from 0deg, #dc2626, transparent, #dc2626);
  animation: spin 4s linear infinite;
  opacity: 0.5;
}
@keyframes spin { to { transform: rotate(360deg) } }
.avatar-circle {
  position: relative; z-index: 1;
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: white;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 8px 32px rgba(220,38,38,0.3);
}

.avatar-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem; font-weight: 800; color: white;
  margin-bottom: 0.4rem;
}
.avatar-role {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.72rem; color: rgba(255,255,255,0.4);
  margin-bottom: 1.2rem;
}
.role-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #dc2626;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.avatar-stats {
  display: flex; align-items: center; justify-content: center; gap: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.av-stat { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
.av-stat-num {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.3rem; font-weight: 900; color: #dc2626; line-height: 1;
}
.av-stat-label { font-size: 0.58rem; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
.av-stat-div { width: 1px; height: 28px; background: rgba(255,255,255,0.07); }

/* Sidebar nav */
.sidebar-nav {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 0.5rem;
  display: flex; flex-direction: column; gap: 0.3rem;
}
.nav-btn {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.75rem 1rem;
  border: none; border-radius: 9px;
  background: transparent; color: rgba(255,255,255,0.4);
  font-family: inherit; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s ease;
  position: relative;
  text-align: left; width: 100%;
}
.nav-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
.nav-btn.active {
  color: white; background: rgba(220,38,38,0.12);
  border: 1px solid rgba(220,38,38,0.2);
}
.nav-btn.active .nav-icon { color: #dc2626; }
.nav-icon { display: flex; flex-shrink: 0; transition: color 0.25s; }
.nav-label { flex: 1; }
.nav-badge {
  background: #dc2626; color: white;
  font-size: 0.6rem; font-weight: 800;
  padding: 0.15rem 0.45rem; border-radius: 30px;
  min-width: 18px; text-align: center;
}
.nav-arrow {
  color: rgba(255,255,255,0.2);
  transition: transform 0.25s, color 0.25s;
}
.nav-btn.active .nav-arrow { color: rgba(220,38,38,0.5); transform: translateX(2px); }

/* ── CONTENT ── */
.content-area {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 2rem;
  position: relative; overflow: hidden;
  animation: contentIn 0.5s ease 0.15s both;
}
@keyframes contentIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
.content-area::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent);
}

.tab-panel { width: 100%; }

/* Panel header */
.panel-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 2rem; gap: 1rem;
}
.panel-eyebrow {
  font-size: 0.62rem; font-weight: 700;
  color: rgba(220,38,38,0.7);
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 0.3rem;
}
.panel-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6rem; font-weight: 900; color: white; line-height: 1.1;
}
.panel-title span { color: #dc2626; }

.edit-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 8px;
  color: rgba(220,38,38,0.8); font-family: inherit;
  font-size: 0.8rem; font-weight: 700;
  cursor: pointer; transition: all 0.25s; white-space: nowrap;
  flex-shrink: 0;
}
.edit-btn:hover { background: rgba(220,38,38,0.15); color: #dc2626; border-color: rgba(220,38,38,0.4); }

/* Info grid */
.info-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1rem; margin-bottom: 1.5rem;
}
.info-card {
  display: flex; align-items: flex-start; gap: 0.9rem;
  padding: 1.1rem 1.2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  transition: border-color 0.3s, transform 0.3s;
  animation: cardIn 0.4s ease var(--delay, 0s) both;
}
@keyframes cardIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
.info-card:hover { border-color: rgba(220,38,38,0.2); transform: translateY(-2px); }

.info-card-icon {
  width: 34px; height: 34px; border-radius: 8px;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #dc2626; flex-shrink: 0;
}
.info-label {
  font-size: 0.6rem; font-weight: 700;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase; letter-spacing: 1.5px;
  margin-bottom: 0.3rem;
}
.info-value {
  font-size: 0.9rem; color: white; font-weight: 500;
}

.role-section { margin-top: 0.5rem; }
.role-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 30px;
  font-size: 0.75rem; font-weight: 700;
}
.role-admin {
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.25);
  color: rgba(220,38,38,0.9);
}
.role-cliente {
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.25);
  color: rgba(99,163,255,0.9);
}

/* Edit form */
.edit-form { display: flex; flex-direction: column; gap: 1rem; }
.edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.edit-field { display: flex; flex-direction: column; gap: 0.4rem; }
.edit-label {
  font-size: 0.63rem; font-weight: 700;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase; letter-spacing: 1.5px;
}
.req { color: #dc2626; }
.edit-input-wrap { position: relative; display: flex; align-items: center; }
.edit-icon {
  position: absolute; left: 0.9rem;
  color: rgba(255,255,255,0.2); pointer-events: none;
}
.edit-input-wrap input {
  width: 100%;
  padding: 0.78rem 1rem 0.78rem 2.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px;
  color: white; font-size: 0.88rem; font-family: inherit;
  outline: none; transition: all 0.22s;
}
.edit-input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
.edit-input-wrap input:focus {
  border-color: rgba(220,38,38,0.5);
  background: rgba(220,38,38,0.04);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}
.edit-actions {
  display: flex; gap: 0.8rem; margin-top: 0.5rem;
}
.btn-cancel {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.78rem 1.4rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px;
  color: rgba(255,255,255,0.45); font-family: inherit;
  font-size: 0.87rem; font-weight: 600; cursor: pointer;
  transition: all 0.22s;
}
.btn-cancel:hover { color: white; border-color: rgba(255,255,255,0.2); }
.btn-save {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.78rem 1.6rem;
  background: #dc2626; border: none; border-radius: 9px;
  color: white; font-family: inherit;
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
  transition: all 0.28s;
  box-shadow: 0 4px 18px rgba(220,38,38,0.28);
}
.btn-save:hover { background: #b91c1c; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(220,38,38,0.38); }

/* Citas */
.new-cita-btn {
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  background: #dc2626; border-radius: 8px;
  color: white; font-size: 0.8rem; font-weight: 700;
  text-decoration: none; flex-shrink: 0;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(220,38,38,0.25);
}
.new-cita-btn:hover { background: #b91c1c; transform: translateY(-1px); }

.citas-list { display: flex; flex-direction: column; gap: 0.9rem; }
.cita-card {
  display: flex;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
  animation: cardIn 0.4s ease calc(var(--i, 0) * 0.07s) both;
}
.cita-card:hover { border-color: rgba(220,38,38,0.25); transform: translateX(4px); }

.cita-accent {
  width: 3px; flex-shrink: 0;
  background: linear-gradient(180deg, #dc2626, #7f1d1d);
}
.cita-body { flex: 1; padding: 1.1rem 1.3rem; }
.cita-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 1rem;
  margin-bottom: 0.8rem;
}
.cita-servicio {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem; font-weight: 800; color: white;
  margin-bottom: 0.2rem;
}
.cita-vehiculo { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.cita-badge {
  display: inline-flex; align-items: center;
  padding: 0.28rem 0.75rem; border-radius: 30px;
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; white-space: nowrap; flex-shrink: 0;
}
.badge-pendiente  { background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid rgba(245,158,11,0.25); }
.badge-confirmada { background:rgba(59,130,246,0.1); color:#60a5fa; border:1px solid rgba(59,130,246,0.25); }
.badge-completada { background:rgba(16,185,129,0.1); color:#34d399; border:1px solid rgba(16,185,129,0.25); }
.badge-cancelada  { background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.25); }

.cita-meta {
  display: flex; gap: 1.4rem;
  flex-wrap: wrap;
}
.cita-meta-item {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.78rem; color: rgba(255,255,255,0.35);
}
.cita-monto { color: #dc2626; font-weight: 700; }

/* Empty state */
.empty-state { text-align: center; padding: 3.5rem 2rem; }
.empty-ring {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.15);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
}
.empty-title { font-family: 'Montserrat', sans-serif; font-size: 1.1rem; font-weight: 800; color: rgba(255,255,255,0.4); margin-bottom: 0.4rem; }
.empty-sub { font-size: 0.82rem; color: rgba(255,255,255,0.2); }

/* Transitions */
.tab-fade-enter-active,.tab-fade-leave-active { transition: all 0.28s ease; }
.tab-fade-enter-from { opacity:0; transform:translateY(10px); }
.tab-fade-leave-to   { opacity:0; transform:translateY(-10px); }

.panel-slide-enter-active,.panel-slide-leave-active { transition: all 0.25s ease; }
.panel-slide-enter-from { opacity:0; transform:translateX(12px); }
.panel-slide-leave-to   { opacity:0; transform:translateX(-12px); }

/* Responsive */
@media (max-width: 900px) {
  .perfil-layout { flex-direction: column; padding: 0 1.5rem; }
  .sidebar { flex: none; }
  .perfil-hero { padding: calc(var(--nav-height) + 2rem) 1.5rem 1.5rem; }
  .hero-deco { display: none; }
  .info-grid { grid-template-columns: 1fr; }
  .edit-row { grid-template-columns: 1fr; }
}
</style>
