<template>
  <nav class="nav" :class="{ scrolled }">
    <router-link to="/" class="nav-logo">
      <div class="logo-brand">DRIVEN<span>YIELD</span></div>
      <div class="logo-sub">PRO SYSTEM</div>
    </router-link>

    <ul class="nav-links">
      <li><router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Inicio</router-link></li>
      <li><router-link to="/servicios" class="nav-link" :class="{ active: $route.path === '/servicios' }">Servicios</router-link></li>
      <li><router-link to="/agendar" class="nav-link" :class="{ active: $route.path === '/agendar' }">Agendar</router-link></li>
      <li v-if="user"><router-link to="/calendario" class="nav-link" :class="{ active: $route.path === '/calendario' }">Calendario</router-link></li>
      <li v-if="user?.role === 'admin'">
        <router-link to="/admin" class="nav-link" :class="{ active: $route.path === '/admin' }">Admin</router-link>
      </li>
    </ul>

    <div class="nav-actions">
      <template v-if="!user">
        <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
      </template>
      <template v-else>
        <div class="user-menu" ref="menuRef">

          <!-- Avatar trigger -->
          <button class="user-avatar" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
            <span class="avatar-letter">{{ user.nombre.charAt(0).toUpperCase() }}</span>
            <span class="avatar-ring"></span>
          </button>

          <!-- Dropdown -->
          <transition name="dropdown-anim">
            <div v-if="menuOpen" class="user-dropdown">

              <!-- Header -->
              <div class="dropdown-header">
                <div class="dh-avatar">{{ user.nombre.charAt(0).toUpperCase() }}</div>
                <div class="dh-info">
                  <span class="dh-name">{{ user.nombre }}</span>
                  <span class="dh-role">
                    <span class="dh-dot"></span>
                    {{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Items -->
              <div class="dropdown-body">
                <button class="dropdown-item" @click="goTo('/perfil')">
                  <span class="item-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <span class="item-text">Mi Perfil</span>
                  <svg class="item-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <button v-if="user.role === 'cliente'" class="dropdown-item" @click="goTo('/agendar')">
                  <span class="item-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </span>
                  <span class="item-text">Agendar Cita</span>
                  <svg class="item-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <button v-if="user.role === 'admin'" class="dropdown-item item-admin" @click="goTo('/admin')">
                  <span class="item-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </span>
                  <span class="item-text">Panel Admin</span>
                  <svg class="item-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Logout -->
              <button class="dropdown-item item-logout" @click="handleLogout">
                <span class="item-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <span class="item-text">Cerrar Sesión</span>
              </button>

            </div>
          </transition>
        </div>
      </template>

      <button class="nav-toggle" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile menu -->
  <transition name="mobile-anim">
    <div v-if="mobileOpen" class="nav-mobile-menu">
      <router-link to="/" class="mob-link" @click="mobileOpen = false">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Inicio
      </router-link>
      <router-link to="/servicios" class="mob-link" @click="mobileOpen = false">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        Servicios
      </router-link>
      <router-link to="/agendar" class="mob-link" @click="mobileOpen = false">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Agendar
      </router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin" class="mob-link" @click="mobileOpen = false">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Admin
      </router-link>
      <div class="mob-actions">
        <router-link v-if="!user" to="/login" class="btn btn-primary" @click="mobileOpen = false">Iniciar Sesión</router-link>
        <button v-else class="mob-logout" @click="handleLogout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()
const scrolled = ref(false)
const menuOpen = ref(false)
const mobileOpen = ref(false)
const menuRef = ref(null)

function goTo(path) { menuOpen.value = false; router.push(path) }
function handleLogout() { menuOpen.value = false; mobileOpen.value = false; auth.logout(); router.push('/') }
function onScroll() { scrolled.value = window.scrollY > 20 }
function onClickOutside(e) { if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000; height: var(--nav-height);
  padding: 0 4rem;
  background: rgba(5,5,5,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(220,38,38,0.1);
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.3s ease;
}
.nav.scrolled {
  background: rgba(3,3,3,0.97);
  border-bottom-color: rgba(220,38,38,0.2);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4), 0 1px 0 rgba(220,38,38,0.1);
}

/* Logo */
.nav-logo { display: flex; flex-direction: column; text-decoration: none; line-height: 1; }
.logo-brand {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem; font-weight: 900;
  color: white; letter-spacing: 1px; line-height: 1;
}
.logo-brand span { color: #dc2626; }
.logo-sub {
  font-size: 0.55rem; letter-spacing: 3.5px;
  color: rgba(220,38,38,0.6); text-transform: uppercase;
  margin-top: 1px;
}

/* Links */
.nav-links { display: flex; gap: 0.2rem; list-style: none; margin: 0; padding: 0; }
.nav-link {
  padding: 0.45rem 0.95rem;
  color: rgba(255,255,255,0.5);
  font-weight: 600; font-size: 0.84rem;
  border-radius: 7px; transition: all 0.25s ease;
  position: relative;
}
.nav-link:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-link.active { color: white; background: #dc2626; box-shadow: 0 3px 14px rgba(220,38,38,0.3); }

/* Actions */
.nav-actions { display: flex; align-items: center; gap: 0.8rem; }

/* Avatar */
.user-menu { position: relative; }
.user-avatar {
  position: relative;
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 0 rgba(220,38,38,0.4);
  transition: all 0.3s ease;
  overflow: visible;
}
.user-avatar:hover { transform: scale(1.08); box-shadow: 0 0 0 3px rgba(220,38,38,0.25); }
.user-avatar.open { box-shadow: 0 0 0 3px rgba(220,38,38,0.4); }
.avatar-letter {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem; font-weight: 900; color: white;
  position: relative; z-index: 1;
}
.avatar-ring {
  position: absolute; inset: -3px; border-radius: 50%;
  background: conic-gradient(from 0deg, #dc2626 0%, transparent 60%, #dc2626 100%);
  animation: spin 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
}
.user-avatar.open .avatar-ring,
.user-avatar:hover .avatar-ring { opacity: 0.6; }
@keyframes spin { to { transform: rotate(360deg) } }

/* Dropdown */
.user-dropdown {
  position: absolute; top: calc(100% + 12px); right: 0;
  width: 240px;
  background: #0f0f0f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  z-index: 10000;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.1);
}
.user-dropdown::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}

/* Dropdown header */
.dropdown-header {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 1.1rem 1.1rem 1rem;
}
.dh-avatar {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem; font-weight: 900; color: white;
}
.dh-info { display: flex; flex-direction: column; gap: 0.2rem; overflow: hidden; }
.dh-name {
  font-size: 0.88rem; font-weight: 700; color: white;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dh-role {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.68rem; color: rgba(255,255,255,0.35);
}
.dh-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #dc2626;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 0.7rem; }

/* Dropdown items */
.dropdown-body { padding: 0.4rem 0.5rem; }
.dropdown-item {
  width: 100%; padding: 0.65rem 0.7rem;
  display: flex; align-items: center; gap: 0.7rem;
  background: transparent; border: none; border-radius: 8px;
  color: rgba(255,255,255,0.5);
  font-family: inherit; font-size: 0.83rem; font-weight: 600;
  cursor: pointer; text-align: left;
  transition: all 0.2s ease;
}
.dropdown-item:hover {
  color: white; background: rgba(255,255,255,0.06);
}
.item-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.2s;
}
.dropdown-item:hover .item-icon { background: rgba(220,38,38,0.12); color: #dc2626; }
.item-text { flex: 1; }
.item-arrow {
  color: rgba(255,255,255,0.15);
  transition: transform 0.2s, color 0.2s;
}
.dropdown-item:hover .item-arrow { transform: translateX(2px); color: rgba(255,255,255,0.4); }

.item-admin:hover { color: white; }
.item-admin:hover .item-icon { background: rgba(220,38,38,0.15); color: #dc2626; }

.item-logout {
  margin: 0.4rem 0.5rem 0.5rem;
  width: calc(100% - 1rem);
  border-radius: 8px;
  color: rgba(239,68,68,0.7);
}
.item-logout:hover {
  color: #ef4444; background: rgba(239,68,68,0.08);
}
.item-logout:hover .item-icon { background: rgba(239,68,68,0.12); color: #ef4444; }

/* Dropdown animation */
.dropdown-anim-enter-active { animation: dropIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-anim-leave-active { animation: dropOut 0.16s ease; }
@keyframes dropIn {
  from { opacity:0; transform: translateY(-8px) scale(0.97); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}
@keyframes dropOut {
  from { opacity:1; transform: translateY(0) scale(1); }
  to   { opacity:0; transform: translateY(-6px) scale(0.97); }
}

/* Toggle */
.nav-toggle {
  display: none; flex-direction: column; gap: 5px;
  background: transparent; border: none; padding: 8px; cursor: pointer;
}
.nav-toggle span {
  display: block; width: 22px; height: 2px;
  background: rgba(255,255,255,0.7); border-radius: 2px;
  transition: all 0.3s ease;
}
.nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: white; }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: white; }

/* Mobile menu */
.nav-mobile-menu {
  position: fixed; top: var(--nav-height); left: 0; right: 0;
  background: rgba(6,6,6,0.98);
  border-bottom: 1px solid rgba(220,38,38,0.15);
  padding: 1rem;
  z-index: 999;
  display: flex; flex-direction: column; gap: 0.2rem;
  backdrop-filter: blur(16px);
}
.mob-link {
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.72rem 0.9rem;
  color: rgba(255,255,255,0.5); font-weight: 600; font-size: 0.88rem;
  border-radius: 9px; text-decoration: none;
  transition: all 0.22s;
}
.mob-link:hover { color: white; background: rgba(255,255,255,0.05); }
.mob-actions {
  margin-top: 0.5rem; padding-top: 0.8rem;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.mob-logout {
  width: 100%; padding: 0.75rem;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 9px; color: rgba(239,68,68,0.8);
  font-family: inherit; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.22s;
}
.mob-logout:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

/* Mobile animation */
.mobile-anim-enter-active { animation: mobileIn 0.25s ease; }
.mobile-anim-leave-active { animation: mobileOut 0.2s ease; }
@keyframes mobileIn { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
@keyframes mobileOut { from { opacity:1; transform:translateY(0) } to { opacity:0; transform:translateY(-10px) } }

@media (max-width: 768px) {
  .nav { padding: 0 1.2rem; }
  .nav-links { display: none; }
  .nav-actions .btn { display: none; }
  .nav-toggle { display: flex; }
}
</style>
