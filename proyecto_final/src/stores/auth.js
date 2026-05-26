// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const API = 'http://localhost:8000/api'
export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const token   = ref(localStorage.getItem('driven yield_token') || null)
  const loading = ref(false)
  const error   = ref(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')
  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
    }
  }
  async function init() {
    if (!token.value) return
    try {
      const res = await fetch(`${API}/auth/me`, { headers: authHeaders() })
      if (res.ok) {
        user.value = await res.json()
      } else {
        _clear()
      }
    } catch {}
  }
  async function register(nombre, username, email, contrasena, telefono = '') {
    loading.value = true; error.value = null
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, username, email, contrasena, telefono })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error al registrar')
      _save(data.token, data.user)
      return { ok: true }
    } catch (e) {
      error.value = e.message
      return { ok: false, error: e.message }
    } finally { loading.value = false }
  }
  async function login(username, contrasena) {
    loading.value = true; error.value = null
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contrasena })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Credenciales incorrectas')
      _save(data.token, data.user)
      return { ok: true }
    } catch (e) {
      error.value = e.message
      return { ok: false, error: e.message }
    } finally { loading.value = false }
  }
  async function loginAdmin(email, contrasena) {
    loading.value = true; error.value = null
    try {
      const res  = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Credenciales incorrectas')
      _save(data.token, data.user)
      return { ok: true }
    } catch (e) {
      error.value = e.message
      return { ok: false, error: e.message }
    } finally { loading.value = false }
  }
  async function updateProfile(datos) {
    loading.value = true; error.value = null
    try {
      const res = await fetch(`${API}/perfil`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(datos)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar perfil')
      user.value = { ...user.value, ...datos }
      return { ok: true }
    } catch (e) {
      error.value = e.message
      return { ok: false, error: e.message }
    } finally { loading.value = false }
  }
  async function logout() {
    if (token.value) {
      try {
        await fetch(`${API}/auth/logout`, { method: 'POST', headers: authHeaders() })
      } catch {}
    }
    _clear()
  }
  function _save(t, u) {
    token.value = t
    user.value  = u
    localStorage.setItem('driven yield_token', t)
  }
  function _clear() {
    token.value = null
    user.value  = null
    localStorage.removeItem('driven yield_token')
  }
  return {
    user, token, loading, error,
    isLoggedIn, isAdmin,
    authHeaders, init,
    register, login, loginAdmin, logout, updateProfile
  }
})
