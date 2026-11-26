import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('RF02 - Inicio de sesión', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    sessionStorage.clear()
  })

  it('RF02-01 inicia sesión con credenciales válidas', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc', user: { id: 4, nombre: 'Luis', role: 'cliente' } })
    })
    const auth = useAuthStore()
    const result = await auth.login('luis01', 'Clave123')
    expect(result.ok).toBe(true)
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user.nombre).toBe('Luis')
  })

  it('RF02-02 envía usuario y contraseña al endpoint de autenticación', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc', user: { id: 4, role: 'cliente' } })
    })
    await useAuthStore().login('luis01', 'Clave123')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'luis01', contrasena: 'Clave123' })
      })
    )
  })

  it('RF02-03 rechaza credenciales incorrectas', async () => {
    fetch.mockResolvedValueOnce({
      ok: false, status: 401,
      json: async () => ({ detail: 'Credenciales incorrectas' })
    })
    const result = await useAuthStore().login('luis01', 'incorrecta')
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('RF02-04 identifica el rol administrador del usuario autenticado', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'admin-token', user: { id: 1, role: 'admin' } })
    })
    const auth = useAuthStore()
    await auth.login('admin', 'Clave123')
    expect(auth.isAdmin).toBe(true)
  })
})
