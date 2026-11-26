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

describe('RF09 - Cancelar citas', () => {
  const cita = { id: 22, estado: 'pendiente', fecha: '2026-12-01', hora: '10:00', servicio: 'Mantenimiento', monto: 100000 }
  it('RF09-01 solicita confirmación antes de cancelar', async () => {
    await setupPerfil([cita]); await openHistory(); await button(w, 'CANCELAR ORDEN').trigger('click')
    expect(confirm).toHaveBeenCalled()
  })
  it('RF09-02 solicita al store cambiar el estado a cancelada', async () => {
    await setupPerfil([cita]); citas.actualizarEstado = vi.fn().mockResolvedValue({ ok: true })
    await openHistory(); await button(w, 'CANCELAR ORDEN').trigger('click')
    expect(citas.actualizarEstado).toHaveBeenCalledWith(22, 'cancelada')
  })
  it('RF09-03 no cancela si el usuario no confirma', async () => {
    confirm.mockReturnValue(false)
    await setupPerfil([cita]); citas.actualizarEstado = vi.fn().mockResolvedValue({ ok: true })
    await openHistory(); await button(w, 'CANCELAR ORDEN').trigger('click')
    expect(citas.actualizarEstado).not.toHaveBeenCalled()
  })
  it('RF09-04 no ejecuta otra acción cuando el store rechaza la cancelación', async () => {
    await setupPerfil([cita]); citas.actualizarEstado = vi.fn().mockResolvedValue({ ok: false, error: 'Error' })
    await openHistory(); await button(w, 'CANCELAR ORDEN').trigger('click')
    expect(citas.actualizarEstado).toHaveBeenCalledTimes(1)
    expect(citas.actualizarEstado).toHaveBeenCalledWith(22, 'cancelada')
  })
})
