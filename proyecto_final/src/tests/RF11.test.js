import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AgendarView from '../views/AgendarView.vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
vi.mock('vue-router', () => ({ useRoute: () => ({ query: {}, params: {} }), useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))
const response = data => ({ ok: true, json: async () => data })
let w, citas
async function setup(mechanics = [
  { id_mecanico: 4, nombre: 'Mario', especialidad: 'Mecánica General' },
  { id_mecanico: 5, nombre: 'Laura', especialidad: 'Electrónica Automotriz' }
]) {
  const pinia = createPinia(); setActivePinia(pinia)
  const auth = useAuthStore(); auth.user = { id: 1, nombre: 'Cliente', name: 'Cliente', role: 'cliente' }; auth.token = 'token'
  citas = useCitasStore(); citas.agregarCita = vi.fn().mockResolvedValue({ ok: true })
  fetch.mockResolvedValueOnce(response(mechanics))
    .mockResolvedValueOnce(response([{ id: 1, nombre: 'Diagnóstico eléctrico', categoria: 'Diagnóstico', precio: 50000, duracion: '60 min', descripcion: 'Prueba' }]))
    .mockResolvedValueOnce(response({ vehiculos: [] }))
  w = mount(AgendarView, { global: { plugins: [pinia] } }); await flushPromises()
}
async function goToSchedule() {
  await w.find('.service-opt-card').trigger('click')
  await w.find('.step-actions button.btn-primary').trigger('click')
  await w.get('input[placeholder="Ej: Toyota, Ford"]').setValue('Toyota')
  await w.get('input[placeholder="Ej: Mustang, Corolla"]').setValue('Corolla')
  await w.get('input[placeholder="YYYY"]').setValue('2022')
  await w.get('input[placeholder="ABC-123"]').setValue('ABC123')
  await w.find('.step-actions button.btn-primary').trigger('click')
}
beforeEach(() => { vi.restoreAllMocks(); vi.stubGlobal('fetch', vi.fn()); vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} }) })
describe('RF11 - Asignación de mecánicos', () => {
  it('RF11-01 consulta la lista de mecánicos disponibles', async () => {
    await setup()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/citas/mecanicos'))
    expect(w.text()).toContain('Diagnóstico eléctrico')
  })
  it('RF11-02 permite seleccionar un mecánico en el paso de cronograma', async () => {
    await setup(); await goToSchedule()
    const mechanicSelect = w.findAll('select').find(s => s.text().includes('Asignación Automática'))
    expect(mechanicSelect).toBeTruthy()
    expect(mechanicSelect.text()).toContain('Mario')
  })
  it('RF11-03 conserva el identificador del mecánico seleccionado', async () => {
    await setup(); await goToSchedule()
    const mechanicSelect = w.findAll('select').find(s => s.text().includes('Asignación Automática'))
    await mechanicSelect.setValue('5')
    expect(mechanicSelect.element.value).toBe('5')
  })
  it('RF11-04 conserva la asignación automática cuando no hay mecánicos disponibles', async () => {
    await setup([]); await goToSchedule()
    const mechanicSelect = w.findAll('select').find(s => s.text().includes('Asignación Automática'))
    expect(mechanicSelect).toBeTruthy()
    expect(mechanicSelect.text()).toContain('Asignación Automática')
  })
})
