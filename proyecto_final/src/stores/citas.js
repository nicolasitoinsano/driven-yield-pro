// src/stores/citas.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API = 'http://localhost:8000/api'

export const useCitasStore = defineStore('citas', () => {
  const citas   = ref([])
  const loading = ref(false)
  const error   = ref(null)

  function headers() {
    const auth = useAuthStore()
    return {
      'Content-Type': 'application/json',
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {})
    }
  }

  // URL según rol: admin ve todas, usuario ve las suyas
  function citasUrl() {
    const auth = useAuthStore()
    return auth.isAdmin ? `${API}/admin/citas` : `${API}/citas`
  }

  async function fetchCitas() {
    loading.value = true; error.value = null
    try {
      const res = await fetch(citasUrl(), { headers: headers() })
      if (!res.ok) throw new Error('Error al cargar citas')
      citas.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally { loading.value = false }
  }

  async function agregarCita(datos) {
    loading.value = true; error.value = null
    try {
      const res  = await fetch(`${API}/citas`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          cliente:  datos.cliente,
          vehiculo: datos.vehiculo,
          placa:    datos.placa    || '',
          marca:    datos.marca    || '',
          modelo:   datos.modelo   || '',
          anio:     datos.anio ? String(datos.anio) : '',
          color:    datos.color ? String(datos.color) : '',
          servicio: datos.servicio,
          fecha:    datos.fecha,
          hora:     datos.hora,
          notas:    datos.notas    || '',
          monto:    datos.monto    || 0,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error al crear cita')
      citas.value.unshift(data.cita)
      return { ok: true, cita: data.cita }
    } catch (e) {
      error.value = e.message
      return { ok: false, error: e.message }
    } finally { loading.value = false }
  }

  async function actualizarEstado(citaId, estado) {
    try {
      const res = await fetch(`${API}/citas/${citaId}/estado`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ estado })
      })
      if (!res.ok) throw new Error('Error al actualizar estado')
      const cita = citas.value.find(c => c.id === citaId)
      if (cita) cita.estado = estado
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function eliminarCita(citaId) {
    try {
      const res = await fetch(`${API}/citas/${citaId}`, {
        method: 'DELETE',
        headers: headers()
      })
      if (!res.ok) throw new Error('Error al eliminar cita')
      citas.value = citas.value.filter(c => c.id !== citaId)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function init() {
    const auth = useAuthStore()
    if (auth.isLoggedIn) await fetchCitas()
  }

  return {
    citas, loading, error,
    fetchCitas, agregarCita, actualizarEstado, eliminarCita, init
  }
})
