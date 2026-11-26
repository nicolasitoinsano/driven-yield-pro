import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PerfilView from '../views/PerfilView.vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: { tab: 'garage' }, params: {}, path: '/perfil' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() })
}))

const response = (data = {}, ok = true) => ({ ok, json: async () => data })
let wrapper

async function mountPerfil() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.user = { id: 2, name: 'Cliente', nombre: 'Cliente', email: 'cliente@test.com', role: 'cliente' }
  auth.token = 'token-test'
  const citas = useCitasStore()
  citas.fetchCitas = vi.fn().mockResolvedValue(undefined)
  fetch.mockResolvedValueOnce(response({ vehiculos: [] }))
  wrapper = mount(PerfilView, { global: { plugins: [pinia], stubs: { 'router-link': { template: '<a><slot /></a>' } } } })
  await flushPromises()
  return wrapper
}
const button = (w, text) => w.findAll('button').find(b => b.text().includes(text))

beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubGlobal('fetch', vi.fn())
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
})

describe('RF05 - Registro de vehículos', () => {
  it('RF05-01 muestra el formulario para registrar un vehículo', async () => {
    const w = await mountPerfil()
    await button(w, 'AGREGAR VEHÍCULO').trigger('click')
    expect(w.text()).toContain('Registrar Vehículo')
    expect(w.find('input[placeholder="AAA-123"]').exists()).toBe(true)
  })

  it('RF05-02 no envía el registro si faltan campos obligatorios', async () => {
    const w = await mountPerfil()
    await button(w, 'AGREGAR VEHÍCULO').trigger('click')
    await button(w, 'GUARDAR VEHÍCULO').trigger('click')
    expect(fetch.mock.calls.some(([url, options]) => String(url).includes('/perfil/vehiculos') && options?.method === 'POST')).toBe(false)
  })

  it('RF05-03 envía placa, año, marca, modelo y color al backend', async () => {
    const w = await mountPerfil()
    fetch.mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({ vehiculos: [] }))
    await button(w, 'AGREGAR VEHÍCULO').trigger('click')
    const values = { 'AAA-123': 'ABC-123', '2022': '2022', Toyota: 'Toyota', Corolla: 'Corolla', Blanco: 'Blanco' }
    for (const [placeholder, value] of Object.entries(values)) await w.get(`input[placeholder="${placeholder}"]`).setValue(value)
    await button(w, 'GUARDAR VEHÍCULO').trigger('click')
    await flushPromises()
    const call = fetch.mock.calls.find(([url, options]) => String(url).includes('/perfil/vehiculos') && options?.method === 'POST')
    expect(call).toBeTruthy()
    expect(JSON.parse(call[1].body)).toMatchObject({ numero_de_placa: 'ABC-123', año: 2022, marca: 'Toyota', modelo: 'Corolla', color: 'Blanco' })
  })

  it('RF05-04 conserva el formulario si el backend rechaza el registro', async () => {
    const w = await mountPerfil()
    fetch.mockResolvedValueOnce(response({ detail: 'Placa duplicada' }, false))
    await button(w, 'AGREGAR VEHÍCULO').trigger('click')
    for (const [placeholder, value] of Object.entries({ 'AAA-123': 'ABC-123', '2022': '2022', Toyota: 'Toyota', Corolla: 'Corolla' })) {
      await w.get(`input[placeholder="${placeholder}"]`).setValue(value)
    }
    await button(w, 'GUARDAR VEHÍCULO').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Registrar Vehículo')
  })
})
