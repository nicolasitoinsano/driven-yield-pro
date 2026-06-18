<template>
  <main class="servicios-page">

    <!-- Ambient Glow -->
    <div class="ambient-glow fixed-glow"></div>

    <!-- Header Section -->
    <div class="page-header observe-me">
      <div class="header-eyebrow">
        <span class="eyebrow-line"></span>
        CATÁLOGO DE MÓDULOS
        <span class="eyebrow-line"></span>
      </div>
      <h1 class="page-title">OPTIMIZACIÓN<br /><em>ESTRUCTURAL</em></h1>
      <p class="page-sub">Protocolos avanzados para el mantenimiento y mejora de tu vehículo.</p>
    </div>

    <!-- Filtros -->
    <section class="filters-section observe-me" style="transition-delay: 0.2s">
      <div class="filters-inner matte-card">
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input v-model="search" type="text" placeholder="Ingresar parámetro de búsqueda..." />
        </div>

        <div class="filter-pills">
          <button
            v-for="f in filters"
            :key="f.value"
            :class="['fpill', { active: currentFilter === f.value }]"
            @click="currentFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="result-count">
          <span class="rc-num">{{ filteredServices.length }}</span> RESULTADOS
        </div>
      </div>
    </section>

    <!-- Grid de servicios -->
    <section class="services-section">
      <div class="services-grid" v-if="filteredServices.length">
        <div
          v-for="(s, i) in filteredServices"
          :key="s.id"
          class="matte-card srv-card observe-me"
          :style="`transition-delay: ${(i % 3) * 0.15}s`"
        >
          <!-- Imagen -->
          <div class="srv-img-wrap">
            <div class="srv-img" :style="{ backgroundImage: `url(${s.img})` }"></div>
            <div class="srv-img-overlay"></div>
            <span class="srv-cat">{{ s.categoria }}</span>
            <div class="srv-price-tag">${{ s.precio }}<span>COP</span></div>
          </div>

          <!-- Cuerpo -->
          <div class="srv-body">
            <h3 class="srv-name">{{ s.name }}</h3>
            <p class="srv-desc">{{ s.desc }}</p>

            <ul class="srv-features">
              <li v-for="feat in s.features" :key="feat">
                <span class="feat-bullet"></span>
                {{ feat }}
              </li>
            </ul>

            <div class="srv-footer">
              <div class="srv-meta">
                <div class="srv-time">
                  <span class="time-icon">⏱</span>
                  {{ s.tiempo }}
                </div>
              </div>
              <router-link to="/agendar" class="srv-btn">
                Seleccionar <span class="arr">→</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="no-results observe-me">
        <div class="no-results-icon">∅</div>
        <h3>Parámetro No Encontrado</h3>
        <p>Los registros no muestran coincidencias para "<em>{{ search }}</em>"</p>
        <button class="btn btn-ghost" @click="search = ''; currentFilter = 'todos'">Restablecer Parámetros</button>
      </div>
    </section>

    <!-- CTA banner -->
    <section class="cta-strip observe-me">
      <div class="cta-strip-inner matte-card">
        <div class="cta-strip-text">
          <h2>¿Requieres diagnóstico especializado?</h2>
          <p>Nuestros técnicos pueden evaluar anomalías específicas en tu sistema.</p>
        </div>
        <router-link to="/agendar" class="btn btn-primary">
          Solicitar Evaluación
        </router-link>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const search = ref('')
const currentFilter = ref('todos')
const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.observe-me').forEach(el => observer.value.observe(el))
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

const filters = [
  { label: 'Todos',          value: 'todos' },
  { label: 'Mantenimiento',  value: 'Mantenimiento' },
  { label: 'Suspensión',     value: 'Suspensión' },
  { label: 'Frenos',         value: 'Frenos' },
  { label: 'Diagnóstico',    value: 'Diagnóstico' },
  { label: 'Estética',       value: 'Estética' }
]

const services = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&q=80',
    name: 'Mantenimiento Preventivo PRO',
    categoria: 'Mantenimiento',
    precio: '180.000', tiempo: '45 min',
    desc: 'Cambio de aceite sintético de alto rendimiento, filtro de aceite, filtro de aire y revisión de niveles de fluidos.',
    features: ['Aceite Full Sintético', 'Filtros Originales OEM', 'Chequeo de 20 puntos']
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80',
    name: 'Diagnóstico Computarizado Avanzado',
    categoria: 'Diagnóstico',
    precio: '90.000', tiempo: '1 hora',
    desc: 'Lectura completa de códigos de falla (DTC), revisión de sensores en tiempo real y borrado de testigos.',
    features: ['Escáner OBD2 Nivel 3', 'Lectura de sensores en vivo', 'Informe digital']
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1625047509168-a71c6f21223e?w=800&q=80',
    name: 'Actualización a Frenos Cerámicos',
    categoria: 'Frenos',
    precio: '350.000', tiempo: '2.5 horas',
    desc: 'Instalación de pastillas cerámicas de baja emisión de polvo, rectificado de discos y purga de líquido DOT 4.',
    features: ['Pastillas Cerámicas Premium', 'Rectificado de Discos', 'Líquido de Frenos DOT 4']
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&q=80',
    name: 'Sincronización Electrónica',
    categoria: 'Mantenimiento',
    precio: '250.000', tiempo: '3 horas',
    desc: 'Limpieza de inyectores por ultrasonido, cambio de bujías de Iridio y limpieza del cuerpo de aceleración.',
    features: ['Bujías de Iridio', 'Limpieza por Ultrasonido', 'Cuerpo de Aceleración']
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    name: 'Alineación y Balanceo Láser 3D',
    categoria: 'Suspensión',
    precio: '120.000', tiempo: '1 hora',
    desc: 'Alineación computarizada 3D de alta precisión y balanceo dinámico de las 4 ruedas para un manejo perfecto.',
    features: ['Tecnología Láser 3D', 'Balanceo Dinámico', 'Rotación de Llantas']
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    name: 'Mantenimiento Transmisión Automática',
    categoria: 'Mantenimiento',
    precio: '450.000', tiempo: '4 horas',
    desc: 'Extracción completa del fluido ATF viejo mediante máquina de diálisis y reemplazo del filtro interno.',
    features: ['Fluido ATF 100% Sintético', 'Diálisis Completa', 'Cambio de Filtro Interno']
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80',
    name: 'Detailing y Recubrimiento Cerámico',
    categoria: 'Estética',
    precio: '800.000', tiempo: '2 días',
    desc: 'Corrección de pintura en 3 pasos y aplicación de recubrimiento cerámico 9H con duración de hasta 3 años.',
    features: ['Corrección de Pintura', 'Cerámico 9H (3 Años)', 'Hidrofobia Extrema']
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    name: 'Restauración de Suspensión Deportiva',
    categoria: 'Suspensión',
    precio: '650.000', tiempo: '5 horas',
    desc: 'Reemplazo de amortiguadores, bujes de poliuretano y copelas para restaurar la rigidez y el confort original.',
    features: ['Amortiguadores a Gas', 'Bujes de Poliuretano', 'Garantía 1 Año']
  },
]

const filteredServices = computed(() =>
  services.filter(s => {
    const matchCat    = currentFilter.value === 'todos' || s.categoria === currentFilter.value
    const matchSearch = !search.value ||
      s.name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.value.toLowerCase())
    return matchCat && matchSearch
  })
)
</script>

<style scoped>
.servicios-page {
  padding-top: var(--nav-height);
  min-height: 100vh;
  position: relative;
}

.fixed-glow {
  position: fixed;
  top: 20%; left: 10%;
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(230,0,35,0.05) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}

/* BASE ANIMATIONS */
.observe-me {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.observe-me.is-visible { opacity: 1; transform: translateY(0); }

/* HEADER */
.page-header {
  text-align: center;
  padding: 5rem 2rem 3rem;
  position: relative; z-index: 1;
}

.header-eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 1rem;
  font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 4px; color: var(--primary); margin-bottom: 1.5rem;
}
.eyebrow-line { width: 30px; height: 1px; background: rgba(230,0,35,0.5); }

.page-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 900;
  color: white;
  line-height: 1;
  letter-spacing: -1px;
  margin-bottom: 1rem;
}
.page-title em { font-style: normal; color: transparent; -webkit-text-stroke: 1px var(--primary); }

.page-sub {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* FILTERS */
.filters-section {
  padding: 0 2rem 4rem;
  position: relative; z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}
.filters-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  padding: 1rem 1.5rem;
}

.search-wrap {
  display: flex; align-items: center; gap: 0.8rem;
  background: var(--bg-base);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  flex: 1; min-width: 250px;
  transition: border-color 0.3s;
}
.search-wrap:focus-within { border-color: var(--primary); }
.search-icon { color: var(--primary); font-size: 1.2rem; line-height: 1; }
.search-wrap input {
  background: transparent; border: none; outline: none;
  color: white; font-family: 'Outfit', sans-serif; font-size: 0.95rem; width: 100%;
}

.filter-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.fpill {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-secondary);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s ease;
}
.fpill:hover { background: rgba(255,255,255,0.05); color: white; }
.fpill.active { background: var(--primary); border-color: var(--primary); color: white; box-shadow: var(--shadow-red); }

.result-count {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 2px;
}
.rc-num { color: white; font-size: 0.9rem; font-weight: 700; margin-right: 0.3rem; }

/* SERVICES GRID */
.services-section {
  padding: 0 2rem 6rem;
  max-width: 1300px; margin: 0 auto;
  position: relative; z-index: 2;
}
.services-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.srv-card {
  display: flex; flex-direction: column; padding: 0;
}
.srv-img-wrap {
  position: relative; height: 220px; overflow: hidden;
}
.srv-img {
  width: 100%; height: 100%; background-size: cover; background-position: center;
  filter: grayscale(80%) contrast(1.1); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.srv-card:hover .srv-img { transform: scale(1.1); filter: grayscale(0%); }
.srv-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, var(--bg-card) 0%, transparent 80%);
}
.srv-cat {
  position: absolute; top: 15px; left: 15px;
  background: var(--primary); color: white; font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; padding: 0.4rem 0.8rem; border-radius: 4px;
}
.srv-price-tag {
  position: absolute; bottom: 15px; right: 15px;
  font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 900; color: white;
  text-shadow: 0 4px 12px rgba(0,0,0,0.8);
}
.srv-price-tag span { font-size: 0.8rem; color: var(--primary); font-weight: 700; margin-left: 2px; }

.srv-body { padding: 1.8rem; display: flex; flex-direction: column; flex: 1; }
.srv-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 900; color: white; margin-bottom: 0.8rem; line-height: 1.1; }
.srv-desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; flex: 1; }

.srv-features { list-style: none; margin-bottom: 2rem; }
.srv-features li { display: flex; align-items: center; gap: 0.8rem; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem; }
.feat-bullet { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }

.srv-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05);
}
.srv-time { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
.time-icon { color: var(--primary); }

.srv-btn {
  font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: white;
  text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s;
}
.srv-btn .arr { color: var(--primary); transition: transform 0.3s; display: inline-block; }
.srv-btn:hover { color: var(--primary); }
.srv-btn:hover .arr { transform: translateX(5px); color: white; }

/* NO RESULTS */
.no-results { text-align: center; padding: 5rem 2rem; max-width: 500px; margin: 0 auto; }
.no-results-icon { font-size: 4rem; color: rgba(255,255,255,0.1); margin-bottom: 1rem; }
.no-results h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: white; margin-bottom: 1rem; }
.no-results p { color: var(--text-secondary); margin-bottom: 2rem; }
.no-results em { color: var(--primary); font-style: normal; }

/* CTA STRIP */
.cta-strip { padding: 0 2rem 6rem; max-width: 1000px; margin: 0 auto; }
.cta-strip-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 2rem;
  padding: 3rem 4rem; border: 1px solid rgba(230,0,35,0.3); background: rgba(230,0,35,0.05);
}
.cta-strip-text h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: white; margin-bottom: 0.5rem; }
.cta-strip-text p { color: var(--text-secondary); font-size: 1rem; }

@media (max-width: 900px) {
  .filters-inner { flex-direction: column; align-items: stretch; }
  .search-wrap { width: 100%; }
  .cta-strip-inner { flex-direction: column; text-align: center; padding: 2rem; }
}
</style>