import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PerfilView from '../views/PerfilView.vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
vi.mock('vue-router', () => ({ useRoute: () => ({ query: { tab: 'garage' }, params: {}, path: '/perfil' }), useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))
const response = (data = {}, ok = true) => ({ ok, json: async () => data })
let w, citas
async function setupPerfil(citasData = []) {
  const pinia = createPinia(); setActivePinia(pinia)
  const auth = useAuthStore(); auth.user = { id: 1, name: 'Cliente', nombre: 'Cliente', email: 'cliente@test.com', role: 'cliente' }; auth.token = 'token'
  citas = useCitasStore(); citas.citas = citasData; citas.fetchCitas = vi.fn().mockResolvedValue(undefined)
  fetch.mockResolvedValueOnce(response({ vehiculos: [] }))
  w = mount(PerfilView, { global: { plugins: [pinia], stubs: { 'router-link': { template: '<a><slot /></a>' } } } })
  await flushPromises()
  return w
}
const button = (wrapper, label) => wrapper.findAll('button').find(b => b.text().includes(label))
async function openHistory() { await button(w, 'HISTORIAL DE SERVICIOS').trigger('click'); await flushPromises() }
beforeEach(() => {
  vi.restoreAllMocks(); vi.stubGlobal('fetch', vi.fn())
  vi.stubGlobal('confirm', vi.fn(() => true))
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
})

describe('RF08 - Modificar citas', () => {
  const cita = { id: 22, estado: 'pendiente', fecha: '2026-12-01', hora: '10:00', servicio: 'Mantenimiento', vehiculo: 'Toyota Corolla', placa: 'AAA-123', monto: 100000 }
  it('RF08-01 carga la información de la cita seleccionada en el formulario', async () => {
    await setupPerfil([cita]); await openHistory(); await button(w, 'EDITAR ORDEN').trigger('click')
    expect(w.text()).toContain('MODIFICAR ORDEN')
    expect(w.get('input[type="date"]').element.value).toBe('2026-12-01')
    expect(w.get('input[type="time"]').element.value).toBe('10:00')
  })
  it('RF08-02 envía la nueva fecha y hora al backend', async () => {
    await setupPerfil([cita]); await openHistory(); fetch.mockResolvedValueOnce(response({}))
    await button(w, 'EDITAR ORDEN').trigger('click')
    await w.get('input[type="date"]').setValue('2026-12-03'); await w.get('input[type="time"]').setValue('11:30')
    await button(w, 'GUARDAR CAMBIOS').trigger('click'); await flushPromises()
    const call = fetch.mock.calls.find(([url, options]) => String(url).includes('/citas/22') && options?.method === 'PUT')
    expect(call).toBeTruthy()
    expect(JSON.parse(call[1].body)).toMatchObject({ fecha: '2026-12-03', hora: '11:30', servicio: 'Mantenimiento' })
  })
  it('RF08-03 impide guardar si falta fecha u hora', async () => {
    await setupPerfil([cita]); await openHistory(); await button(w, 'EDITAR ORDEN').trigger('click')
    await w.get('input[type="date"]').setValue('')
    await button(w, 'GUARDAR CAMBIOS').trigger('click'); await flushPromises()
    expect(fetch.mock.calls.some(([url, options]) => String(url).includes('/citas/22') && options?.method === 'PUT')).toBe(false)
  })
  it('RF08-04 conserva el formulario si el backend rechaza la modificación', async () => {
    await setupPerfil([cita]); await openHistory()
    fetch.mockResolvedValueOnce(response({ detail: 'No se puede modificar' }, false))
    await button(w, 'EDITAR ORDEN').trigger('click'); await w.get('input[type="date"]').setValue('2026-12-03')
    await button(w, 'GUARDAR CAMBIOS').trigger('click'); await flushPromises()
    expect(w.text()).toContain('MODIFICAR ORDEN')
  })
})
