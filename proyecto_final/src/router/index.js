import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/servicios', name: 'Servicios', component: () => import('../views/ServiciosView.vue') },
  { path: '/agendar', name: 'Agendar', component: () => import('../views/AgendarView.vue'), meta: { requiresAuth: true } },
  { path: '/perfil', name: 'Perfil', component: () => import('../views/PerfilView.vue'), meta: { requiresAuth: true } },
  { path: '/calendario', name: 'Calendario', component: () => import('../views/CalendarioView.vue'), meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: () => import('../views/AdminView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) return { name: 'Login' }
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') return { name: 'Home' }
  if (to.name === 'Login' && auth.user) return auth.user.role === 'admin' ? { name: 'Admin' } : { name: 'Home' }
})

export default router
