import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AgendarView from '../views/AgendarView.vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
vi.mock('vue-router', () => ({ useRoute: () => ({ query: {}, params: {} }), useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))
const response = data => ({ ok: true, json: async () => data })
let w, citas
async function setup() {
  const pinia = createPinia(); setActivePinia(pinia)
  const auth = useAuthStore(); auth.user = { id: 1, nombre: 'Cliente', name: 'Cliente', role: 'cliente', phone: '3000000000' }; auth.token = 'token'
  citas = useCitasStore(); citas.agregarCita = vi.fn().mockResolvedValue({ ok: true }); citas.loading = false
  fetch.mockResolvedValueOnce(response([{ id_mecanico: 4, nombre: 'Mario', especialidad: 'Mecánica General' }]))
    .mockResolvedValueOnce(response([{ id: 1, nombre: 'Cambio de Aceite', categoria: 'Mantenimiento', precio: 80000, duracion: '45 min', descripcion: 'Cambio de aceite' }]))
    .mockResolvedValueOnce(response({ vehiculos: [] }))
  w = mount(AgendarView, { global: { plugins: [pinia], stubs: { 'router-link': { template: '<a><slot /></a>' } } } })
  await flushPromises()
}
const next = () => w.find('.step-actions button.btn-primary').trigger('click')
async function chooseServiceAndVehicle() {
  await w.find('.service-opt-card').trigger('click')
  await next()
  await w.get('input[placeholder="Ej: Toyota, Ford"]').setValue('Toyota')
  await w.get('input[placeholder="Ej: Mustang, Corolla"]').setValue('Corolla')
  await w.get('input[placeholder="YYYY"]').setValue('2022')
  await w.get('input[placeholder="ABC-123"]').setValue('ABC123')
  await next()
}
async function completeSchedule() {
  await chooseServiceAndVehicle()
  fetch.mockResolvedValueOnce(response(['09:00', '10:00']))
  await w.get('input[type="date"]').setValue('2026-12-02')
  await flushPromises()
  await w.get('select').setValue('09:00')
  const name = w.find('input[placeholder="Nombre completo"]')
  if (name.exists()) await name.setValue('Cliente')
  await next()
}
beforeEach(() => {
  vi.restoreAllMocks(); vi.stubGlobal('fetch', vi.fn())
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
})
describe('RF07 - Agendar citas', () => {
  it('RF07-01 carga servicios y permite seleccionar uno', async () => {
    await setup()
    expect(w.text()).toContain('Cambio de Aceite')
    await w.find('.service-opt-card').trigger('click')
    expect(w.find('.service-opt-card.selected').exists()).toBe(true)
  })
  it('RF07-02 permite avanzar al formulario de vehículo', async () => {
    await setup(); await w.find('.service-opt-card').trigger('click'); await next(); await flushPromises()
    expect(w.text()).toContain('DATOS DEL VEHÍCULO')
    expect(w.text()).toContain('Nuevo Vehículo')
  })
  it('RF07-03 consulta horarios disponibles al seleccionar fecha', async () => {
    await setup(); await chooseServiceAndVehicle()
    fetch.mockResolvedValueOnce(response(['09:00', '10:00']))
    await w.get('input[type="date"]').setValue('2026-12-02'); await flushPromises()
    expect(fetch.mock.calls.some(([url]) => String(url).includes('/citas/disponibilidad?fecha=2026-12-02'))).toBe(true)
    expect(w.get('select').text()).toContain('09:00')
  })
  it('RF07-04 envía la solicitud de cita mediante el store', async () => {
    await setup(); await completeSchedule()
    const submit = w.find('.step-actions button.btn-confirm')
    expect(submit.exists()).toBe(true)
    await submit.trigger('click'); await flushPromises()
    expect(citas.agregarCita).toHaveBeenCalledWith(expect.objectContaining({ servicio: 'Cambio de Aceite', marca: 'Toyota', modelo: 'Corolla', placa: 'ABC123' }))
  })
  it('RF07-05 presenta confirmación cuando el store confirma el agendamiento', async () => {
    await setup(); await completeSchedule()
    await w.find('.step-actions button.btn-confirm').trigger('click'); await flushPromises()
    expect(w.text()).toContain('SECUENCIA COMPLETADA')
  })
})
