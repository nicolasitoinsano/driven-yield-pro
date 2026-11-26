import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('RF04 - Gestión de perfil', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    sessionStorage.clear()
  })

  it('RF04-01 actualiza el perfil mediante el endpoint protegido', async () => {
    const auth = useAuthStore()
    auth.token = 'token-perfil'
    auth.user = { id: 7, nombre: 'Ana', email: 'ana@test.com', role: 'cliente' }
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ mensaje: 'Actualizado' }) })

    const result = await auth.updateProfile({
      nombre: 'Ana María', email: 'ana.maria@test.com', telefono: '3001112233'
    })

    expect(result.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/perfil'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          nombre: 'Ana María', email: 'ana.maria@test.com', telefono: '3001112233'
        })
      })
    )
  })

  it('RF04-02 refleja los datos nuevos en el usuario local', async () => {
    const auth = useAuthStore()
    auth.user = { id: 7, nombre: 'Ana', email: 'ana@test.com', role: 'cliente' }
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await auth.updateProfile({ nombre: 'Ana María', email: 'ana@test.com', telefono: '3000000000' })
    expect(auth.user.nombre).toBe('Ana María')
    expect(auth.user.telefono).toBe('3000000000')
  })

  it('RF04-03 incluye el encabezado de autorización al actualizar el perfil', async () => {
    const auth = useAuthStore()
    auth.token = 'token-perfil'
    auth.user = { id: 7, nombre: 'Ana', role: 'cliente' }
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await auth.updateProfile({ nombre: 'Ana', email: 'ana@test.com', telefono: '3000000000' })
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer token-perfil')
  })

  it('RF04-04 informa errores cuando el servidor no permite actualizar el perfil', async () => {
    const auth = useAuthStore()
    auth.user = { id: 7, nombre: 'Ana', role: 'cliente' }
    fetch.mockResolvedValueOnce({
      ok: false, status: 400, json: async () => ({ detail: 'Datos inválidos' })
    })
    const result = await auth.updateProfile({ nombre: '', email: 'mal', telefono: '' })
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
