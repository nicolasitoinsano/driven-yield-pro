import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useNotificacionesStore } from '../stores/notificaciones'

describe('RF14 - Notificaciones', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    const auth = useAuthStore()
    auth.token = 'token-notificaciones'
    auth.user = { id: 3, role: 'cliente' }
  })

  it('RF14-01 consulta las notificaciones del usuario autenticado', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notificaciones: [{ id: 1, leida: false }], no_leidas: 1 })
    })
    const store = useNotificacionesStore()
    await store.fetchNotificaciones()
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/notificaciones'),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token-notificaciones' }) })
    )
    expect(store.notificaciones).toHaveLength(1)
    expect(store.noLeidas).toBe(1)
  })

  it('RF14-02 marca una notificación individual como leída', async () => {
    const store = useNotificacionesStore()
    store.notificaciones = [{ id: 8, leida: false }]
    store.noLeidas = 1
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await store.marcarLeida(8)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/notificaciones/8/leer'),
      expect.objectContaining({ method: 'PUT' })
    )
    expect(store.notificaciones[0].leida).toBe(true)
    expect(store.noLeidas).toBe(0)
  })

  it('RF14-03 marca todas las notificaciones como leídas', async () => {
    const store = useNotificacionesStore()
    store.notificaciones = [{ id: 1, leida: false }, { id: 2, leida: false }]
    store.noLeidas = 2
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await store.marcarTodasLeidas()
    expect(store.notificaciones.every(n => n.leida)).toBe(true)
    expect(store.noLeidas).toBe(0)
  })

  it('RF14-04 elimina una notificación y actualiza el contador', async () => {
    const store = useNotificacionesStore()
    store.notificaciones = [{ id: 9, leida: false }]
    store.noLeidas = 1
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await store.eliminarNotificacion(9)
    expect(store.notificaciones).toHaveLength(0)
    expect(store.noLeidas).toBe(0)
  })
})
