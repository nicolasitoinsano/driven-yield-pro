<template>
  <div class="login-root">

    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="left-grid"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>

      <div class="left-content">
        <div class="brand-badge">
          <span class="badge-dot"></span>
          Sistema Activo · v6.0
        </div>

        <div>
          <div class="brand-logo">DRIVEN<span>YIELD</span></div>
          <p class="brand-tagline">PRO SYSTEM</p>
          <p class="brand-desc">Plataforma de gestión automotriz premium. Agenda, controla y optimiza tu taller desde un solo lugar.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">500<span>+</span></div>
            <div class="stat-label">Clientes</div>
            <div class="stat-bar"><div class="stat-fill" style="width:85%"></div></div>
          </div>
          <div class="stat-card">
            <div class="stat-value">12<span>K</span></div>
            <div class="stat-label">Servicios</div>
            <div class="stat-bar"><div class="stat-fill" style="width:72%"></div></div>
          </div>
          <div class="stat-card">
            <div class="stat-value">98<span>%</span></div>
            <div class="stat-label">Satisfacción</div>
            <div class="stat-bar"><div class="stat-fill" style="width:98%"></div></div>
          </div>
        </div>

        <div class="trust-row">
          <div class="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Datos seguros
          </div>
          <div class="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Soporte 24/7
          </div>
          <div class="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Sin comisiones
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <div class="form-container">
        <transition name="fade-slide" mode="out-in">

          <!-- LOGIN -->
          <div v-if="panel === 'login'" key="login" class="form-box">
            <p class="form-eyebrow">Bienvenido de vuelta</p>
            <h1 class="form-title">Iniciar <span>Sesión</span></h1>
            <p class="form-subtitle">Ingresa tus credenciales para continuar</p>

            <div class="field-group">
              <span class="field-label">Usuario</span>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input v-model="loginForm.username" type="text" placeholder="Tu nombre de usuario" @keyup.enter="handleLogin" />
              </div>
            </div>

            <div class="field-group">
              <span class="field-label">Contraseña</span>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input v-model="loginForm.password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••" @keyup.enter="handleLogin" />
                <button class="eye-btn" @click="showPwd = !showPwd" type="button">
                  <svg v-if="!showPwd" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <button class="btn-primary" @click="handleLogin">
              Ingresar al sistema
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>

            <div class="divider"><span>o</span></div>

            <button class="btn-secondary" @click="panel = 'register'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Crear cuenta nueva
            </button>

            <button class="btn-secondary" @click="panel = 'admin'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Iniciar como administrador
            </button>

            <button class="forgot-link-bottom" @click="panel = 'forgot'" type="button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- REGISTER -->
          <div v-else-if="panel === 'register'" key="register" class="form-box">
            <p class="form-eyebrow">Únete a driven yield</p>
            <h1 class="form-title">Crear <span>Cuenta</span></h1>
            <p class="form-subtitle">Completa el formulario para comenzar</p>

            <div class="register-scroll">
              <div class="field-group">
                <span class="field-label">Nombre completo</span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="regForm.name" type="text" placeholder="Juan Pérez" />
                </div>
              </div>
              <div class="field-row">
                <div class="field-group">
                  <span class="field-label">Email</span>
                  <div class="input-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input v-model="regForm.email" type="email" placeholder="juan@email.com" />
                  </div>
                </div>
                <div class="field-group">
                  <span class="field-label">Teléfono</span>
                  <div class="input-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <input v-model="regForm.phone" type="tel" placeholder="+57 300 000" />
                  </div>
                </div>
              </div>
              <div class="field-group">
                <span class="field-label">Nombre de usuario</span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <input v-model="regForm.username" type="text" placeholder="juanperez" />
                </div>
              </div>
              <div class="field-row">
                <div class="field-group">
                  <span class="field-label">Contraseña</span>
                  <div class="input-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input v-model="regForm.password" type="password" placeholder="Mín. 6 caracteres" />
                  </div>
                </div>
                <div class="field-group">
                  <span class="field-label">Confirmar</span>
                  <div class="input-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input v-model="regForm.confirm" type="password" placeholder="Repetir" />
                  </div>
                </div>
              </div>

              <button class="btn-primary" @click="handleRegister">
                Crear mi cuenta
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <div class="divider"><span>o</span></div>
              <button class="btn-secondary" @click="panel = 'login'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Ya tengo cuenta
              </button>
            </div>
          </div>

          <!-- ADMIN LOGIN -->
          <div v-else-if="panel === 'admin'" key="admin" class="form-box">
            <button class="back-btn" @click="panel = 'login'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Volver al inicio de sesión
            </button>

            <p class="form-eyebrow" style="margin-top:1.5rem">Acceso administrativo</p>
            <h1 class="form-title">Iniciar como <span>Admin</span></h1>
            <p class="form-subtitle">Ingresa tus credenciales de administrador</p>

            <div class="field-group">
              <span class="field-label">Email</span>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input v-model="adminForm.email" type="email" placeholder="admin@email.com" @keyup.enter="handleAdminLogin" />
              </div>
            </div>

            <div class="field-group">
              <span class="field-label">Contraseña</span>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input v-model="adminForm.password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••" @keyup.enter="handleAdminLogin" />
                <button class="eye-btn" @click="showPwd = !showPwd" type="button">
                  <svg v-if="!showPwd" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <button class="btn-primary" @click="handleAdminLogin">
              Ingresar como admin
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <!-- FORGOT -->
          <div v-else key="forgot" class="form-box">
            <button class="back-btn" @click="panel = 'login'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Volver al inicio de sesión
            </button>

            <p class="form-eyebrow" style="margin-top:1.5rem">Recuperar acceso</p>
            <h1 class="form-title">¿Olvidaste tu <span>contraseña?</span></h1>
            <p class="form-subtitle">Te enviaremos un enlace de recuperación a tu correo registrado.</p>

            <div class="forgot-icon-wrap">
              <div class="forgot-ring">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#dc2626"/></svg>
              </div>
            </div>

            <div class="field-group">
              <span class="field-label">Email registrado</span>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input v-model="forgotEmail" type="email" placeholder="tu@email.com" @keyup.enter="handleForgot" />
              </div>
            </div>

            <button class="btn-primary" @click="handleForgot">
              Enviar instrucciones
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

        </transition>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../stores/toast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const panel = ref('login')
const showPwd = ref(false)
const forgotEmail = ref('')

const loginForm = reactive({ username: '', password: '' })
const regForm = reactive({ name: '', email: '', phone: '', username: '', password: '', confirm: '' })
const adminForm = reactive({ email: '', password: '' })

async function handleLogin() {
  if (!loginForm.username || !loginForm.password) { toast.error('Completa todos los campos'); return }
  const res = await auth.login(loginForm.username, loginForm.password)
  if (!res.ok) { toast.error(res.error); return }
  toast.success(`¡Bienvenido, ${auth.user.nombre}!`)
  router.push(auth.user.role === 'admin' ? '/admin' : '/')
}

async function handleAdminLogin() {
  if (!adminForm.email || !adminForm.password) { toast.error('Completa todos los campos'); return }
  const res = await auth.loginAdmin(adminForm.email, adminForm.password)
  if (!res.ok) { toast.error(res.error); return }
  toast.success(`¡Bienvenido, ${auth.user.nombre}!`)
  router.push('/admin')
}

async function handleRegister() {
  const { name, email, phone, username, password, confirm } = regForm
  if (!name || name.length < 2) { toast.error('El nombre es muy corto'); return }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Email inválido'); return }
  if (!phone || phone.length < 7) { toast.error('Teléfono inválido'); return }
  if (!username || username.length < 3) { toast.error('El usuario debe tener al menos 3 caracteres'); return }
  if (password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return }
  if (password !== confirm) { toast.error('Las contraseñas no coinciden'); return }
  const res = await auth.register(name, username, email, password, phone)
  if (!res.ok) { toast.error(res.error); return }
  toast.success('¡Cuenta creada! Iniciando sesión…')
  router.push('/')
}

function handleForgot() {
  if (!forgotEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
    toast.error('Ingresa un email válido'); return
  }
  toast.success('Instrucciones enviadas a tu correo.')
  panel.value = 'login'
}
</script>

<style scoped>
.login-root {
  display: flex;
  min-height: 100vh;
  background: #060606;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* LEFT */
.left-panel {
  width: 400px;
  flex-shrink: 0;
  position: relative;
  background: #0a0a0a;
  border-right: 1px solid rgba(220,38,38,0.12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  min-height: 100vh;
}
.left-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none;
}
.orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
.orb-1 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(220,38,38,0.14) 0%, transparent 70%);
  top: -50px; left: -50px;
  animation: orbFloat 9s ease-in-out infinite;
}
.orb-2 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%);
  bottom: 50px; right: -30px;
  animation: orbFloat 12s ease-in-out infinite reverse;
}
@keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(16px)} }

.left-content {
  position: relative; z-index: 2;
  padding: 2.5rem 2.5rem;
  display: flex; flex-direction: column; gap: 1.6rem;
}

.brand-badge {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.25rem 0.8rem;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 30px;
  font-size: 0.62rem; color: rgba(220,38,38,0.85);
  letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
  width: fit-content;
}
.badge-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #dc2626;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

.brand-logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 3.2rem; font-weight: 900;
  line-height: 1; letter-spacing: -1px; color: #fff;
}
.brand-logo span { color: #dc2626; }

.brand-tagline {
  font-size: 0.58rem; color: rgba(255,255,255,0.18);
  letter-spacing: 4px; text-transform: uppercase;
  margin-top: 0.15rem; margin-bottom: 0.7rem;
}
.brand-desc {
  font-size: 0.82rem; color: rgba(255,255,255,0.38);
  line-height: 1.72;
}

.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.6rem; }
.stat-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; padding: 0.85rem 0.65rem;
  transition: border-color 0.3s;
}
.stat-card:hover { border-color: rgba(220,38,38,0.25); }
.stat-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6rem; font-weight: 900; color: #dc2626; line-height: 1;
}
.stat-value span { font-size: 1rem; }
.stat-label {
  font-size: 0.6rem; color: rgba(255,255,255,0.28);
  text-transform: uppercase; letter-spacing: 1px;
  margin: 0.2rem 0 0.55rem;
}
.stat-bar { height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow:hidden; }
.stat-fill {
  height: 100%;
  background: linear-gradient(90deg,#dc2626,#ef4444);
  animation: fillAnim 1.4s ease-out forwards;
}
@keyframes fillAnim { from { width:0!important } }

.trust-row { display: flex; flex-direction: column; gap: 0.4rem; }
.trust-item {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.72rem; color: rgba(255,255,255,0.28);
}
.trust-item svg { color: #dc2626; flex-shrink:0; }

/* RIGHT */
.right-panel {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 2.5rem 4rem;
  background: #060606;
  position: relative;
}
.right-panel::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse at 25% 50%, rgba(220,38,38,0.05) 0%, transparent 60%);
  pointer-events:none;
}

.form-container {
  width: 100%; max-width: 400px;
  position: relative; z-index: 1;
}

.form-box { width: 100%; }

.form-eyebrow {
  font-size: 0.63rem; font-weight: 700;
  color: rgba(220,38,38,0.8);
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 0.35rem;
}
.form-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.9rem; font-weight: 900;
  color: #fff; line-height: 1.15;
  margin-bottom: 0.35rem; letter-spacing: -0.5px;
}
.form-title span { color: #dc2626; }
.form-subtitle {
  font-size: 0.8rem; color: rgba(255,255,255,0.32);
  margin-bottom: 1.5rem;
}


.field-group { margin-bottom: 0.85rem; }
.field-label {
  display: block;
  font-size: 0.63rem; font-weight: 700;
  color: rgba(255,255,255,0.35);
  letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 0.38rem;
}

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon {
  position: absolute; left: 0.9rem;
  color: rgba(255,255,255,0.2); pointer-events: none;
}
.input-wrap input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  color: #fff; font-size: 0.88rem; font-family: inherit;
  outline: none; transition: all 0.22s;
}
.input-wrap input::placeholder { color: rgba(255,255,255,0.18); }
.input-wrap input:focus {
  border-color: rgba(220,38,38,0.5);
  background: rgba(220,38,38,0.04);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}

.eye-btn {
  position: absolute; right: 0.85rem;
  background: none; border: none;
  color: rgba(255,255,255,0.22); cursor: pointer;
  display: flex; align-items: center; padding: 0;
  transition: color 0.2s;
}
.eye-btn:hover { color: rgba(255,255,255,0.55); }


.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }

.btn-primary {
  width: 100%; margin-top: 0.2rem;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  background: #dc2626; border: none; border-radius: 8px;
  color: white; font-family: inherit;
  font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.28s ease;
  box-shadow: 0 4px 18px rgba(220,38,38,0.28);
  letter-spacing: 0.2px;
}
.btn-primary:hover {
  background: #b91c1c; transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(220,38,38,0.38);
}
.btn-primary:active { transform: translateY(0); }

.divider {
  display: flex; align-items: center; gap: 0.8rem;
  margin: 0.85rem 0;
}
.divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }
.divider span { font-size: 0.62rem; color: rgba(255,255,255,0.18); }

.btn-secondary {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.78rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  color: rgba(255,255,255,0.42); font-family: inherit;
  font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.22s;
}
.btn-secondary:hover {
  border-color: rgba(220,38,38,0.3); color: white;
  background: rgba(220,38,38,0.05);
}

.forgot-link-bottom {
  width: 100%; margin-top: 0.65rem;
  background: none; border: none; cursor: pointer;
  color: rgba(220,38,38,0.6); font-family: inherit;
  font-size: 0.8rem; font-weight: 600; padding: 0.4rem 0;
  transition: color 0.2s; text-align: center;
  letter-spacing: 0.2px;
}
.forgot-link-bottom:hover { color: #dc2626; }

.register-scroll {
  max-height: 72vh; overflow-y: auto; padding-right: 3px;
  scrollbar-width: thin; scrollbar-color: rgba(220,38,38,0.3) transparent;
}

/* Forgot */
.back-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.28); font-family: inherit;
  font-size: 0.78rem; padding: 0; transition: color 0.2s;
}
.back-btn:hover { color: rgba(255,255,255,0.65); }

.forgot-icon-wrap { display: flex; justify-content: center; margin: 1.4rem 0; }
.forgot-ring {
  width: 68px; height: 68px; border-radius: 50%;
  background: rgba(220,38,38,0.07);
  border: 1px solid rgba(220,38,38,0.2);
  display: flex; align-items: center; justify-content: center;
}

/* Transitions */
.fade-slide-enter-active,.fade-slide-leave-active { transition: all 0.26s ease; }
.fade-slide-enter-from { opacity:0; transform:translateX(14px); }
.fade-slide-leave-to   { opacity:0; transform:translateX(-14px); }

/* Responsive */
@media (max-width: 960px) {
  .left-panel { width: 320px; }
  .brand-logo { font-size: 2.5rem; }
  .right-panel { padding: 2rem 2.5rem; }
}
@media (max-width: 680px) {
  .left-panel { display: none; }
  .right-panel { padding: 3rem 1.5rem; align-items: flex-start; }
  .field-row { grid-template-columns: 1fr; }
}
</style>