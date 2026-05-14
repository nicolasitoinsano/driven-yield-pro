<template>
  <main class="agendar-root">
    <div class="bg-grid"></div>
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>

    <!-- Hero -->
    <div class="agendar-hero">
      <p class="hero-eyebrow">Reserva tu servicio</p>
      <h1 class="hero-title">Agendar <span>Cita</span></h1>
      <p class="hero-sub">Completa el formulario para reservar tu servicio</p>
    </div>

    <div class="agendar-wrapper">
    <div class="agendar-layout">

      <!-- Steps sidebar -->
      <div class="steps-sidebar">
        <div class="steps-track">
          <div
            v-for="(step, idx) in steps" :key="idx"
            :class="['step-node', {
              active: currentStep === idx + 1,
              completed: currentStep > idx + 1
            }]"
          >
            <div class="step-bubble">
              <transition name="bubble-swap" mode="out-in">
                <svg v-if="currentStep > idx + 1" key="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-else key="num">{{ idx + 1 }}</span>
              </transition>
            </div>
            <div class="step-info">
              <span class="step-name">{{ step.label }}</span>
              <span class="step-desc">{{ step.desc }}</span>
            </div>
            <div v-if="idx < steps.length - 1" class="step-connector">
              <div class="connector-fill" :class="{ filled: currentStep > idx + 1 }"></div>
            </div>
          </div>
        </div>

        <!-- Price preview -->
        <div v-if="selectedService" class="price-preview">
          <p class="pp-label">Precio estimado</p>
          <p class="pp-value">${{ selectedService.precio }}</p>
          <p class="pp-service">{{ selectedService.name }}</p>
        </div>
      </div>

      <!-- Form area -->
      <div class="form-area">

        <!-- Progress bar -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: ((currentStep - 1) / (steps.length - 1) * 100) + '%' }"></div>
          <span class="progress-label">Paso {{ currentStep }} de {{ steps.length }}</span>
        </div>

        <transition name="step-slide" mode="out-in">

          <!-- STEP 1: Servicio -->
          <div v-if="currentStep === 1" key="s1" class="step-panel">
            <div class="step-panel-header">
              <div class="sph-num">01</div>
              <div>
                <h2 class="sph-title">Selecciona el <span>Servicio</span></h2>
                <p class="sph-sub">Elige el servicio que necesitas para tu vehículo</p>
              </div>
            </div>

            <!-- Service cards grid -->
            <div class="services-grid">
              <button
                v-for="(s, i) in serviciosData" :key="s.name"
                :class="['service-card', { selected: form.servicio === s.name }]"
                :style="`--i:${i}`"
                @click="form.servicio = s.name"
              >
                <div class="sc-icon">{{ s.icon }}</div>
                <div class="sc-info">
                  <span class="sc-name">{{ s.name }}</span>
                  <span class="sc-desc">{{ s.desc }}</span>
                </div>
                <span class="sc-price">${{ s.precio }}</span>
                <div class="sc-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </button>
            </div>

            <div class="field-group" style="margin-top:1.2rem">
              <span class="field-label">Notas adicionales</span>
              <div class="textarea-wrap">
                <textarea v-model="form.notas" rows="3" placeholder="Describe el problema o solicitud especial..."></textarea>
              </div>
            </div>
          </div>

          <!-- STEP 2: Vehículo -->
          <div v-else-if="currentStep === 2" key="s2" class="step-panel">
            <div class="step-panel-header">
              <div class="sph-num">02</div>
              <div>
                <h2 class="sph-title">Datos del <span>Vehículo</span></h2>
                <p class="sph-sub">Ingresa la información de tu vehículo</p>
              </div>
            </div>

            <div class="fields-grid">
              <div class="field-group">
                <span class="field-label">Marca <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <input v-model="form.marca" type="text" placeholder="Toyota, Chevrolet..." />
                </div>
              </div>
              <div class="field-group">
                <span class="field-label">Modelo <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <input v-model="form.modelo" type="text" placeholder="Corolla, Spark..." />
                </div>
              </div>
              <div class="field-group">
                <span class="field-label">Año <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input v-model="form.anio" type="number" placeholder="2020" min="1990" :max="new Date().getFullYear() + 1" />
                </div>
              </div>
              <div class="field-group">
                <span class="field-label">Placa <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <input v-model="form.placa" type="text" placeholder="ABC-123" style="text-transform:uppercase" />
                </div>
              </div>
              <div class="field-group fields-span">
                <span class="field-label">Color del vehículo</span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                  <input v-model="form.color" type="text" placeholder="Blanco, Negro, Rojo..." />
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 3: Fecha -->
          <div v-else-if="currentStep === 3" key="s3" class="step-panel">
            <div class="step-panel-header">
              <div class="sph-num">03</div>
              <div>
                <h2 class="sph-title">Fecha y <span>Horario</span></h2>
                <p class="sph-sub">Selecciona cuándo quieres tu cita</p>
              </div>
            </div>

            <div class="fields-grid">
              <div class="field-group">
                <span class="field-label">Fecha <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input v-model="form.fecha" type="date" :min="minDate" />
                </div>
              </div>
              <div class="field-group">
                <span class="field-label">Hora <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <select v-model="form.hora">
                    <option value="">Seleccionar hora...</option>
                    <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>
              </div>

              <!-- Time slots visual -->
              <div class="field-group fields-span">
                <span class="field-label">Horarios disponibles</span>
                <div class="time-slots">
                  <button
                    v-for="h in horas" :key="h"
                    :class="['time-slot', { selected: form.hora === h }]"
                    @click="form.hora = h"
                  >{{ h }}</button>
                </div>
              </div>

              <div class="field-group fields-span">
                <span class="field-label">Nombre del cliente <span class="req">*</span></span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="form.cliente" type="text" placeholder="Tu nombre completo" />
                </div>
              </div>
              <div class="field-group fields-span">
                <span class="field-label">Teléfono de contacto</span>
                <div class="input-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input v-model="form.telefono" type="tel" placeholder="+57 300 000 0000" />
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 4: Confirmar -->
          <div v-else-if="currentStep === 4" key="s4" class="step-panel">
            <div class="step-panel-header">
              <div class="sph-num">04</div>
              <div>
                <h2 class="sph-title">Confirmar <span>Cita</span></h2>
                <p class="sph-sub">Revisa los detalles antes de confirmar</p>
              </div>
            </div>

            <div class="summary-grid">
              <div class="summary-section">
                <p class="ss-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                  Servicio
                </p>
                <div class="ss-row">
                  <span>Tipo</span><strong>{{ form.servicio }}</strong>
                </div>
                <div class="ss-row" v-if="form.notas">
                  <span>Notas</span><strong>{{ form.notas }}</strong>
                </div>
              </div>

              <div class="summary-section">
                <p class="ss-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Vehículo
                </p>
                <div class="ss-row"><span>Vehículo</span><strong>{{ form.marca }} {{ form.modelo }} {{ form.anio }}</strong></div>
                <div class="ss-row"><span>Placa</span><strong>{{ form.placa }}</strong></div>
                <div class="ss-row" v-if="form.color"><span>Color</span><strong>{{ form.color }}</strong></div>
              </div>

              <div class="summary-section">
                <p class="ss-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Fecha & Contacto
                </p>
                <div class="ss-row"><span>Fecha</span><strong>{{ form.fecha }}</strong></div>
                <div class="ss-row"><span>Hora</span><strong>{{ form.hora }}</strong></div>
                <div class="ss-row"><span>Cliente</span><strong>{{ form.cliente }}</strong></div>
              </div>
            </div>

            <div class="total-box">
              <div class="total-left">
                <span class="total-label">Precio estimado del servicio</span>
                <span class="total-note">* El precio final puede variar según evaluación</span>
              </div>
              <div class="total-price">${{ selectedService?.precio || '—' }}</div>
            </div>
          </div>

        </transition>

        <!-- Actions -->
        <div class="step-actions">
          <button class="btn-prev" @click="currentStep--" :disabled="currentStep === 1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Anterior
          </button>
          <button v-if="currentStep < 4" class="btn-next" @click="nextStep">
            Siguiente
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button v-else class="btn-confirm" @click="submitForm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Confirmar Cita
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Success Modal -->
    <transition name="modal-anim">
      <div v-if="showSuccess" class="success-overlay" @click.self="showSuccess = false">
        <div class="success-modal">
          <div class="success-ring">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 class="sm-title">¡Cita <span>Agendada!</span></h2>
          <p class="sm-sub">Tu cita ha sido registrada exitosamente.</p>
          <div class="sm-details">
            <div class="sm-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>
              <span>{{ form.servicio }}</span>
            </div>
            <div class="sm-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{{ form.fecha }} · {{ form.hora }}</span>
            </div>
            <div class="sm-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span>{{ form.marca }} {{ form.modelo }}</span>
            </div>
          </div>
          <div class="sm-actions">
            <router-link to="/" class="btn-sm-ghost">Ir al inicio</router-link>
            <router-link to="/perfil" class="btn-sm-primary">Ver mis citas</router-link>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCitasStore } from '../stores/citas'
import { useToast } from '../stores/toast'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const citasStore = useCitasStore()
const toast = useToast()
const { user } = storeToRefs(auth)

const currentStep = ref(1)
const showSuccess = ref(false)

const steps = [
  { label: 'Servicio',  desc: 'Tipo de servicio' },
  { label: 'Vehículo', desc: 'Datos del auto' },
  { label: 'Fecha',    desc: 'Horario' },
  { label: 'Confirmar', desc: 'Revisar y enviar' },
]

const form = reactive({
  servicio: '', notas: '',
  marca: '', modelo: '', anio: '', placa: '', color: '',
  fecha: '', hora: '', cliente: user.value?.name || '', telefono: user.value?.phone || '',
})

const serviciosData = [
  { icon:'🛢️', name:'Cambio de Aceite',         precio:45,  desc:'Aceite y filtro de primera calidad.' },
  { icon:'⚙️', name:'Alineación y Balanceo',    precio:60,  desc:'Computarizada en las 4 ruedas.' },
  { icon:'🔴', name:'Frenos Completos',          precio:180, desc:'Pastillas, discos y revisión.' },
  { icon:'💻', name:'Diagnóstico Computarizado', precio:50,  desc:'Escaneo del sistema electrónico.' },
  { icon:'🔋', name:'Sistema Eléctrico',         precio:80,  desc:'Diagnóstico y reparación.' },
  { icon:'🔧', name:'Mantenimiento General',     precio:120, desc:'Revisión completa, 40 puntos.' },
]

const servicios = serviciosData.map(s => s.name)
const selectedService = computed(() => serviciosData.find(s => s.name === form.servicio))
const horas = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00']
const minDate = new Date().toISOString().split('T')[0]

function nextStep() {
  if (currentStep.value === 1 && !form.servicio) { toast.error('Selecciona un servicio'); return }
  if (currentStep.value === 2 && (!form.marca || !form.modelo || !form.anio || !form.placa)) { toast.error('Completa los datos del vehículo'); return }
  if (currentStep.value === 3 && (!form.fecha || !form.hora || !form.cliente)) { toast.error('Completa la fecha, hora y nombre'); return }
  currentStep.value++
}

async function submitForm() {
  const result = await citasStore.agregarCita({
    cliente:  form.cliente,
    vehiculo: `${form.marca} ${form.modelo} ${form.anio}`,
    marca:    form.marca,
    modelo:   form.modelo,
    anio:     form.anio,
    color:    form.color,
    placa:    form.placa,
    servicio: form.servicio,
    fecha:    form.fecha,
    hora:     form.hora,
    notas:    form.notas,
    monto:    selectedService.value?.precio || 0,
  })
  if (result.ok) {
    showSuccess.value = true
  } else {
    toast.error(result.error || 'Error al agendar cita')
  }
}
</script>

<style scoped>
.agendar-root {
  min-height: 100vh;
  background: #060606;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding-bottom: 5rem;
}
.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px);
  background-size: 44px 44px; pointer-events: none;
}
.bg-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.bg-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%); top: -100px; right: -100px; animation: drift 15s ease-in-out infinite; }
.bg-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%); bottom: 0; left: -100px; animation: drift 20s ease-in-out infinite reverse; }
@keyframes drift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(30px)} }

/* Hero */
.agendar-hero {
  position: relative; z-index: 1;
  max-width: 1140px; margin: 0 auto;
  padding: calc(var(--nav-height) + 2.5rem) 2rem 1.5rem;
  animation: heroIn 0.5s ease both;
}
@keyframes heroIn { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
.hero-eyebrow { font-size: 0.62rem; font-weight: 700; color: rgba(220,38,38,0.7); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 0.4rem; }
.hero-title { font-family: 'Montserrat', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; line-height: 1; letter-spacing: -1px; margin-bottom: 0.5rem; }
.hero-title span { color: #dc2626; }
.hero-sub { font-size: 0.85rem; color: rgba(255,255,255,0.35); }

/* Wrapper — the main card that grounds everything */
.agendar-wrapper {
  position: relative; z-index: 1;
  max-width: 1140px; margin: 0 auto;
  padding: 0 2rem 4rem;
  animation: layoutIn 0.5s ease 0.1s both;
}

/* Layout */
.agendar-layout {
  display: flex; gap: 0;
  background: rgba(12,12,12,0.9);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(220,38,38,0.06);
}
@keyframes layoutIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

/* Steps sidebar */
.steps-sidebar {
  flex: 0 0 240px;
  display: flex; flex-direction: column; gap: 0;
  background: rgba(6,6,6,0.8);
  border-right: 1px solid rgba(255,255,255,0.06);
  padding: 2rem 1.5rem;
}
.steps-track {
  display: flex; flex-direction: column; gap: 0;
  flex: 1;
}

.step-node { display: flex; align-items: flex-start; gap: 0.8rem; position: relative; padding-bottom: 1.6rem; }
.step-node:last-child { padding-bottom: 0; }

.step-bubble {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; font-weight: 800;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.35);
  transition: all 0.35s ease;
  font-family: 'Montserrat', sans-serif;
}
.step-node.active .step-bubble { background: #dc2626; border-color: transparent; color: white; box-shadow: 0 4px 16px rgba(220,38,38,0.4); }
.step-node.completed .step-bubble { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: #34d399; }

.step-info { display: flex; flex-direction: column; gap: 0.1rem; padding-top: 0.3rem; }
.step-name { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.35); transition: color 0.3s; }
.step-node.active .step-name { color: white; }
.step-node.completed .step-name { color: rgba(255,255,255,0.5); }
.step-desc { font-size: 0.65rem; color: rgba(255,255,255,0.2); }

.step-connector { position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background: rgba(255,255,255,0.06); }
.connector-fill { height: 0; width: 100%; background: linear-gradient(180deg, #dc2626, rgba(220,38,38,0.3)); transition: height 0.5s ease; }
.connector-fill.filled { height: 100%; }

/* Bubble swap transition */
.bubble-swap-enter-active,.bubble-swap-leave-active { transition: all 0.2s ease; }
.bubble-swap-enter-from { opacity:0; transform:scale(0.5); }
.bubble-swap-leave-to   { opacity:0; transform:scale(1.5); }

/* Price preview */
.price-preview {
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 12px; padding: 1.2rem;
  text-align: center;
  margin-top: 1.5rem;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.pp-label { font-size: 0.62rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.4rem; }
.pp-value { font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 900; color: #dc2626; line-height: 1; margin-bottom: 0.3rem; }
.pp-service { font-size: 0.75rem; color: rgba(255,255,255,0.4); }

/* Form area */
.form-area {
  flex: 1; display: flex; flex-direction: column; gap: 1.2rem;
  padding: 2rem;
  min-width: 0;
}

.progress-bar {
  height: 3px; background: rgba(255,255,255,0.05); border-radius: 4px;
  position: relative; overflow: hidden;
}
.progress-fill { height: 100%; background: linear-gradient(90deg, #dc2626, #ef4444); border-radius: 4px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.progress-label { position: absolute; right: 0; top: 8px; font-size: 0.62rem; color: rgba(255,255,255,0.3); }

/* Step panel */
.step-panel {
  background: transparent;
  border: none;
  border-radius: 0; padding: 0;
  position: relative; overflow: hidden;
  flex: 1;
}
.step-panel::before { display: none; }

.step-panel-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.8rem; }
.sph-num {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem; font-weight: 900;
  color: rgba(220,38,38,0.12); line-height: 1;
  flex-shrink: 0;
}
.sph-title { font-family: 'Montserrat', sans-serif; font-size: 1.4rem; font-weight: 900; color: white; line-height: 1.1; margin-bottom: 0.2rem; }
.sph-title span { color: #dc2626; }
.sph-sub { font-size: 0.78rem; color: rgba(255,255,255,0.3); }

/* Service cards grid */
.services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.service-card {
  display: flex; align-items: center; gap: 0.8rem;
  padding: 0.9rem 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  cursor: pointer; text-align: left; width: 100%;
  transition: all 0.25s ease;
  position: relative; overflow: hidden;
  animation: cardIn 0.35s ease calc(var(--i,0) * 0.05s) both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.service-card:hover { border-color: rgba(220,38,38,0.25); background: rgba(220,38,38,0.04); transform: translateY(-1px); }
.service-card.selected { border-color: rgba(220,38,38,0.5); background: rgba(220,38,38,0.08); }

.sc-icon { font-size: 1.5rem; flex-shrink: 0; }
.sc-info { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
.sc-name { font-size: 0.82rem; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-desc { font-size: 0.68rem; color: rgba(255,255,255,0.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-price { font-family: 'Montserrat', sans-serif; font-size: 0.95rem; font-weight: 900; color: #dc2626; flex-shrink: 0; }
.sc-check {
  position: absolute; top: 0.5rem; right: 0.5rem;
  width: 18px; height: 18px; border-radius: 50%;
  background: #dc2626;
  display: flex; align-items: center; justify-content: center;
  color: white;
  opacity: 0; transform: scale(0.5);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.service-card.selected .sc-check { opacity: 1; transform: scale(1); }

/* Fields */
.fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
.fields-span { grid-column: 1 / -1; }
.field-group { display: flex; flex-direction: column; gap: 0.38rem; }
.field-label { font-size: 0.63rem; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1.5px; }
.req { color: #dc2626; }

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 0.9rem; color: rgba(255,255,255,0.2); pointer-events: none; }
.input-wrap input,
.input-wrap select,
.textarea-wrap textarea {
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px;
  color: white; font-size: 0.88rem; font-family: inherit;
  outline: none; transition: all 0.22s;
}
.input-wrap input::placeholder,
.input-wrap select::placeholder { color: rgba(255,255,255,0.2); }
.input-wrap input:focus,
.input-wrap select:focus,
.textarea-wrap textarea:focus {
  border-color: rgba(220,38,38,0.5);
  background: rgba(220,38,38,0.04);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}
.input-wrap select option { background: #1a1a1a; }

.textarea-wrap textarea { padding: 0.75rem 1rem; resize: vertical; }

/* Time slots */
.time-slots { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.time-slot {
  padding: 0.45rem 0.9rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px;
  color: rgba(255,255,255,0.45); font-family: inherit;
  font-size: 0.8rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.time-slot:hover { border-color: rgba(220,38,38,0.3); color: white; }
.time-slot.selected { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.5); color: white; }

/* Summary */
.summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem; }
.summary-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 1rem;
}
.ss-title {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.65rem; font-weight: 700;
  color: rgba(220,38,38,0.7);
  text-transform: uppercase; letter-spacing: 1.5px;
  margin-bottom: 0.8rem;
}
.ss-row { display: flex; flex-direction: column; margin-bottom: 0.6rem; }
.ss-row span { font-size: 0.6rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; }
.ss-row strong { font-size: 0.82rem; color: white; font-weight: 600; margin-top: 0.1rem; }

.total-box {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.2rem 1.5rem;
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 12px;
}
.total-left { display: flex; flex-direction: column; gap: 0.2rem; }
.total-label { font-size: 0.85rem; font-weight: 700; color: white; }
.total-note { font-size: 0.68rem; color: rgba(255,255,255,0.3); }
.total-price { font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 900; color: #dc2626; }

/* Actions */
.step-actions {
  display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: auto;
}
.btn-prev {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.78rem 1.4rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px;
  color: rgba(255,255,255,0.4); font-family: inherit;
  font-size: 0.87rem; font-weight: 600;
  cursor: pointer; transition: all 0.22s;
}
.btn-prev:hover:not(:disabled) { color: white; border-color: rgba(255,255,255,0.2); }
.btn-prev:disabled { opacity: 0.25; cursor: not-allowed; }

.btn-next, .btn-confirm {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.82rem 1.8rem;
  background: #dc2626; border: none; border-radius: 9px;
  color: white; font-family: inherit;
  font-size: 0.9rem; font-weight: 700;
  cursor: pointer; transition: all 0.28s;
  box-shadow: 0 4px 20px rgba(220,38,38,0.3);
}
.btn-next:hover, .btn-confirm:hover { background: #b91c1c; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(220,38,38,0.4); }

.btn-confirm { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 20px rgba(16,185,129,0.25); }
.btn-confirm:hover { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 8px 28px rgba(16,185,129,0.35); }

/* Step transition */
.step-slide-enter-active,.step-slide-leave-active { transition: all 0.3s ease; }
.step-slide-enter-from { opacity:0; transform:translateX(20px); }
.step-slide-leave-to   { opacity:0; transform:translateX(-20px); }

/* Success modal */
.success-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(10px);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}
.success-modal {
  background: #0f0f0f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 2.5rem 2rem;
  text-align: center; max-width: 420px; width: 90%;
  position: relative; overflow: hidden;
}
.success-modal::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
}
.success-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 32px rgba(16,185,129,0.35);
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes popIn { from{transform:scale(0)} to{transform:scale(1)} }
.sm-title { font-family: 'Montserrat', sans-serif; font-size: 1.8rem; font-weight: 900; color: white; margin-bottom: 0.4rem; }
.sm-title span { color: #10b981; }
.sm-sub { font-size: 0.85rem; color: rgba(255,255,255,0.35); margin-bottom: 1.5rem; }
.sm-details {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;
  display: flex; flex-direction: column; gap: 0.6rem;
}
.sm-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.83rem; color: rgba(255,255,255,0.6); }
.sm-row svg { color: rgba(255,255,255,0.3); flex-shrink: 0; }
.sm-actions { display: flex; gap: 0.8rem; justify-content: center; }
.btn-sm-ghost {
  padding: 0.72rem 1.4rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px; color: rgba(255,255,255,0.5);
  font-family: inherit; font-size: 0.87rem; font-weight: 600;
  text-decoration: none; transition: all 0.22s;
}
.btn-sm-ghost:hover { color: white; border-color: rgba(255,255,255,0.25); }
.btn-sm-primary {
  padding: 0.72rem 1.4rem;
  background: #dc2626; border: none; border-radius: 9px;
  color: white; font-family: inherit; font-size: 0.87rem; font-weight: 700;
  text-decoration: none; transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(220,38,38,0.3);
}
.btn-sm-primary:hover { background: #b91c1c; }

.modal-anim-enter-active { animation: modalIn 0.3s ease; }
.modal-anim-leave-active { animation: modalOut 0.22s ease; }
@keyframes modalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
@keyframes modalOut { from{opacity:1} to{opacity:0} }

/* Responsive */
@media (max-width: 900px) {
  .agendar-wrapper { padding: 0 1rem 3rem; }
  .agendar-layout { flex-direction: column; }
  .steps-sidebar {
    flex: none; border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.2rem 1.2rem 1rem;
  }
  .steps-track { flex-direction: row; overflow-x: auto; }
  .step-node { flex-direction: column; align-items: center; padding-bottom: 0; padding-right: 1.2rem; flex-shrink: 0; }
  .step-connector { display: none; }
  .step-info { text-align: center; }
  .agendar-hero { padding: calc(var(--nav-height) + 1.5rem) 1.2rem 1rem; }
  .form-area { padding: 1.5rem; }
  .services-grid { grid-template-columns: 1fr; }
  .fields-grid { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: 1fr; }
}
</style>