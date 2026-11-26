import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCitasStore } from '../stores/citas'
import { useAuthStore } from '../stores/auth'

describe('RF12 - Actualización de estados', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    useAuthStore().token = 'token-prueba'
  })

  it('RF12-01 actualiza el estado de una cita y vuelve a consultar la lista', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mensaje: 'Estado actualizado' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 10, estado: 'confirmada' }]
      })

    const store = useCitasStore()
    const resultado = await store.actualizarEstado(10, 'confirmada')

    expect(resultado).toEqual({ ok: true })
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/citas/10/estado'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ estado: 'confirmada' })
      })
    )
    expect(store.citas).toEqual([{ id: 10, estado: 'confirmada' }])
  })

  it('RF12-02 informa el error cuando el servidor rechaza el cambio de estado', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Estado no permitido' })
    })

    const store = useCitasStore()
    const resultado = await store.actualizarEstado(10, 'estado-invalido')

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toContain('Estado no permitido')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
