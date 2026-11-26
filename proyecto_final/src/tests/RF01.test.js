import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('RF01 - Registro de usuarios', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    sessionStorage.clear()
  })

  it('RF01-01 envía los datos requeridos al endpoint de registro', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token-test', user: { id: 1, nombre: 'Ana', role: 'cliente' } })
    })
    const auth = useAuthStore()
    const result = await auth.register('Ana Pérez', 'ana01', 'ana@test.com', 'Clave123', '3001234567')
    expect(result.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          nombre: 'Ana Pérez', username: 'ana01', email: 'ana@test.com',
          contrasena: 'Clave123', telefono: '3001234567'
        })
      })
    )
  })

  it('RF01-02 guarda el token y el usuario cuando el registro es exitoso', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token-test', user: { id: 1, nombre: 'Ana', role: 'cliente' } })
    })
    const auth = useAuthStore()
    await auth.register('Ana', 'ana01', 'ana@test.com', 'Clave123')
    expect(auth.token).toBe('token-test')
    expect(auth.user.nombre).toBe('Ana')
    expect(sessionStorage.getItem('driven_yield_token')).toBe('token-test')
  })

  it('RF01-03 devuelve error cuando el servidor rechaza el registro', async () => {
    fetch.mockResolvedValueOnce({
      ok: false, status: 409,
      json: async () => ({ detail: 'El usuario ya existe' })
    })
    const result = await useAuthStore().register('Ana', 'ana01', 'ana@test.com', 'Clave123')
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
