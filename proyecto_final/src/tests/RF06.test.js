import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ServiciosView from '../views/ServiciosView.vue'
const response = data => ({ ok: true, json: async () => data })
const dataset = [
  { id: 1, nombre: 'Cambio de Aceite', categoria: 'Mantenimiento', precio: 80000, duracion: '45 min', descripcion: 'Aceite motor' },
  { id: 2, nombre: 'Frenos', categoria: 'Frenos', precio: 90000, duracion: '60 min', descripcion: 'Pastillas de freno' }
]
beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubGlobal('fetch', vi.fn())
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
})
async function mountServicios(data = dataset) {
  fetch.mockResolvedValueOnce(response(data))
  const w = mount(ServiciosView, { global: { stubs: { 'router-link': { template: '<a><slot /></a>' } } } })
  await flushPromises()
  return w
}
describe('RF06 - Consulta de servicios', () => {
  it('RF06-01 carga el catálogo desde el backend', async () => {
    const w = await mountServicios()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/servicios'))
    expect(w.findAll('.srv-card')).toHaveLength(2)
    expect(w.text()).toContain('Cambio de Aceite')
  })
  it('RF06-02 filtra las tarjetas de servicios por texto', async () => {
    const w = await mountServicios()
    await w.get('input[placeholder="Ingresar parámetro de búsqueda..."]').setValue('aceite')
    expect(w.findAll('.srv-card')).toHaveLength(1)
    expect(w.find('.srv-card').text()).toContain('Cambio de Aceite')
    expect(w.find('.srv-card').text()).not.toContain('Pastillas de freno')
  })
  it('RF06-03 filtra las tarjetas por categoría', async () => {
    const w = await mountServicios()
    const category = w.findAll('.fpill').find(b => b.text().trim() === 'Frenos')
    expect(category).toBeTruthy()
    await category.trigger('click')
    expect(w.findAll('.srv-card')).toHaveLength(1)
    expect(w.find('.srv-card').text()).toContain('Frenos')
    expect(w.find('.srv-card').text()).not.toContain('Cambio de Aceite')
  })
  it('RF06-04 presenta el estado vacío cuando no hay coincidencias', async () => {
    const w = await mountServicios([{ id: 1, nombre: 'Cambio de Aceite', categoria: 'Mantenimiento', precio: 80000, duracion: '45 min', descripcion: 'Aceite' }])
    await w.get('input[placeholder="Ingresar parámetro de búsqueda..."]').setValue('servicio inexistente')
    expect(w.find('.no-results').exists()).toBe(true)
    expect(w.text()).toContain('Parámetro No Encontrado')
  })
})
