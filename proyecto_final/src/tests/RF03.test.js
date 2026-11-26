import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('RF03 - Recuperación de contraseña', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('RF03-01 solicita recuperación enviando el correo indicado', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ mensaje: 'Solicitud recibida' }) })
    const result = await useAuthStore().forgotPassword('ana@test.com')
    expect(result.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/forgot-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'ana@test.com' })
      })
    )
  })

  it('RF03-02 devuelve un mensaje seguro tras una solicitud aceptada', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    const result = await useAuthStore().forgotPassword('no-existe@test.com')
    expect(result.ok).toBe(true)
    expect(result.message).toBeTruthy()
  })

  it('RF03-03 envía el token y la nueva contraseña al endpoint de restablecimiento', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ mensaje: 'Contraseña actualizada' }) })
    const result = await useAuthStore().resetPassword('reset-token', 'NuevaClave123')
    expect(result.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'reset-token', contrasena: 'NuevaClave123' })
      })
    )
  })

  it('RF03-04 informa errores cuando falla la solicitud de recuperación', async () => {
    fetch.mockRejectedValueOnce(new Error('Sin conexión'))
    const result = await useAuthStore().forgotPassword('ana@test.com')
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
