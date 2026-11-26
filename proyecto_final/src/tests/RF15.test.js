import { describe, it, expect, vi } from 'vitest'
import { obtenerEstadisticasDashboard } from '../utils/dashboard'

describe('RF15 - Dashboard administrativo', () => {
  const apiBaseUrl = 'http://localhost:8000'
  const headers = { Authorization: 'Bearer token-prueba' }

  it('RF15-01 consulta las estadísticas del dashboard', async () => {
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ingresos: 1500000,
        citas_completadas: 8,
        citas_pendientes: 4,
        usuarios: 12
      })
    })

    const resultado = await obtenerEstadisticasDashboard(apiBaseUrl, headers, request)

    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith(`${apiBaseUrl}/admin/stats`, { headers })
    expect(resultado.ingresos).toBe(1500000)
    expect(resultado.citas_completadas).toBe(8)
    expect(resultado.citas_pendientes).toBe(4)
    expect(resultado.usuarios).toBe(12)
  })

  it('RF15-02 conserva los datos recibidos del servidor', async () => {
    const datos = {
      ingresos: 2500000,
      citas_completadas: 15,
      citas_pendientes: 3,
      usuarios: 20
    }
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => datos
    })

    await expect(
      obtenerEstadisticasDashboard(apiBaseUrl, headers, request)
    ).resolves.toEqual(datos)
  })

  it('RF15-03 genera un error cuando el servidor responde incorrectamente', async () => {
    const request = vi.fn().mockResolvedValue({ ok: false, status: 500 })

    await expect(
      obtenerEstadisticasDashboard(apiBaseUrl, headers, request)
    ).rejects.toThrow('No se pudieron cargar las estadísticas')
  })

  it('RF15-04 propaga los errores de conexión', async () => {
    const request = vi.fn().mockRejectedValue(new Error('Error de conexión'))

    await expect(
      obtenerEstadisticasDashboard(apiBaseUrl, headers, request)
    ).rejects.toThrow('Error de conexión')
  })
})
