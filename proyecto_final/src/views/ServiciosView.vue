<template>
  <main class="servicios-page">

    <!-- Fondo ambientado -->
    <div class="page-bg">
      <div class="bg-img"></div>
      <div class="bg-overlay"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- subtitulo -->
    <div class="page-header">
      <div class="header-eyebrow">
        <span class="eyebrow-dot"></span>
        driven yield · CATÁLOGO
      </div>
      <h1 class="page-title">Nuestros <em>Servicios</em></h1>
      <p class="page-sub">Soluciones completas para mantener tu vehículo en óptimas condiciones</p>
    </div>

    <!-- buscador -->
    <section class="filters-section">
      <div class="filters-inner">
        <div class="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="search" type="text" placeholder="Buscar servicio…" />
        </div>

      <!--categorias-->

        <div class="filter-pills">
          <button
            v-for="f in filters"
            :key="f.value"
            :class="['fpill', { active: currentFilter === f.value }]"
            @click="currentFilter = f.value"
          >{{ f.label }}</button>
        </div>

        <div class="result-count">
          <span class="rc-num">{{ filteredServices.length }}</span>
          servicio{{ filteredServices.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </section>

    <!-- Grid de servicios -->
    <section class="services-section">
      <div class="services-grid" v-if="filteredServices.length">
        <div
          v-for="(s, i) in filteredServices"
          :key="s.id"
          class="srv-card"
          :style="`animation-delay: ${i * 0.07}s`"
        >
          <!-- Imagen -->
          <div class="srv-img-wrap">
            <img :src="s.img" :alt="s.name" class="srv-img" />
            <div class="srv-img-overlay"></div>
            <span class="srv-cat">{{ s.categoria }}</span>
            <div class="srv-price-tag">${{ s.precio }}</div>
          </div>

          <!-- Cuerpo -->
          <div class="srv-body">
            <h3 class="srv-name">{{ s.name }}</h3>
            <p class="srv-desc">{{ s.desc }}</p>

            <ul class="srv-features">
              <li v-for="feat in s.features" :key="feat">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ff1a2e" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {{ feat }}
              </li>
            </ul>

            <div class="srv-footer">
              <div class="srv-meta">
                <div class="srv-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ s.tiempo }}
                </div>
              </div>
              <router-link to="/agendar" class="srv-btn">
                Agendar
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="no-results">
        <div class="no-results-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <h3>Sin resultados</h3>
        <p>No encontramos servicios para "<em>{{ search }}</em>"</p>
        <button class="clear-btn" @click="search = ''; currentFilter = 'todos'">Limpiar filtros</button>
      </div>
    </section>

    <!-- CTA banner -->
    <section class="cta-strip">
      <div class="cta-strip-inner">
        <div class="cta-strip-text">
          <h2>¿No encontraste lo que buscas?</h2>
          <p>Contáctanos y te asesoramos sin costo</p>
        </div>
        <router-link to="/agendar" class="btn-primary-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Agendar Cita
        </router-link>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const currentFilter = ref('todos')

const filters = [
  { label: 'Todos',          value: 'todos' },
  { label: 'Mantenimiento',  value: 'Mantenimiento' },
  { label: 'Suspensión',     value: 'Suspensión' },
  { label: 'Frenos',         value: 'Frenos' },
  { label: 'Diagnóstico',    value: 'Diagnóstico' },
  { label: '',      value: '' },
]

const services = [
  {
    id: 1,
    img: 'https://motor.elpais.com/wp-content/uploads/2019/04/cambio-aceite-coche-1200x675.jpg',
    name: 'Cambio de Aceite',
    categoria: 'Mantenimiento',
    precio: 45, tiempo: '30 min',
    desc: 'Se realiza el cambio de aceite de tu vehículo con lubricante de primera calidad.',
    features: ['Aceite', 'Filtro de Aceite', 'Filtro de cabina']
  },
  {
    id: 2,
    img: 'https://www.c3carecarcenter.com/wp-content/uploads/2025/12/precio-kit-distribucion-y-montaje-1038x576.webp',
    name: 'Cambio de correa de repartición',
    categoria: 'Diagnóstico',
    precio: 60, tiempo: '1 hora',
    desc: 'Se realiza el cambio de correa de repartición con la respectiva referencia de tu vehículo.',
    features: ['Revisión', 'Mantenimiento', 'Diagnostico']
  },
  {
    id: 3,
    img: 'https://cms-gauib.s3.eu-central-1.amazonaws.com/noticias/imagenes/bigstock-Disc-Brake-And-Asbestos-Brake--311715289_1627573697.jpg?v=178',
    name: 'Revisión de frenos',
    categoria: 'Frenos',
    precio: 180, tiempo: '2 horas',
    desc: 'Aseguramos la potencia de frenado de tu vehículo mediante un servicio completo, se hacen los respectivos cambios que sean necesarios.',
    features: ['Pastillas', 'Discos', 'Caliper']
  },
  {
    id: 4,
    img: 'https://www.c3carecarcenter.com/wp-content/uploads/2025/12/precio-kit-distribucion-y-montaje-1038x576.webp',
    name: 'Cambio de kit de distribución',
    categoria: 'Diagnóstico',
    precio: 50, tiempo: '45 min',
    desc: 'Se realiza el cambio del kit de distribución para que tu vehículo mantenga su rendimiento óptimo y evite daños graves al motor.',
    features: ['Correa de accesorios', 'Bomba de agua', 'Rodillos']
  },
  {
    id: 5,
    img: 'https://www.c3carecarcenter.com/wp-content/uploads/2025/12/bomba-de-agua-curiosidades-1038x576.webp',
    name: 'Sistema de Enfriamiento',
    categoria: 'Diagnóstico',
    precio: 80, tiempo: '1–3 horas',
    desc: 'Revisión del sistema de enfriamiento para diagnosticar posibles sobrecalentamientos del vehiculo ',
    features: ['Radiador', 'Bomba de agua', 'Termostato']
  },
  {
    id: 6,
    img: 'https://www.opisto.com/wp/wp-content/uploads/2023/12/cambiar-el-alternador.png',
    name: 'Cambio de alternador',
    categoria: 'Mantenimiento',
    precio: 120, tiempo: '3 horas',
    desc: 'Se revisa el estado del alternador y se realiza el cambio tomando la misma referencia.',
    features: ['Alternador', '', '']
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1685760797836-dc09d3563f8e?mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&crop=faces%2Cedges&blend-w=1&blend=000000&blend-mode=normal&blend-alpha=10&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzcyMzk5NTk3fA&ixlib=rb-4.1.0',
    name: 'Revisión de Motor',
    categoria: 'Mantenimiento',
    precio: 90, tiempo: '2 horas',
    desc: 'Inspección completa del motor para dar diagostico del funcinamiento',
    features: ['Bujias', 'Control de emision', 'Sistema de combustible', 'Sistema de encendido']
  },
  {
    id: 8,
    img: 'https://www.c3carecarcenter.com/wp-content/uploads/2025/12/Mantenimiento-de-suspension-1038x576.webp',
    name: 'Revisión de suspención',
    categoria: 'Suspensión',
    precio: 40, tiempo: '45 min',
    desc: 'Inspección completa de la suspención y se realiza el cambio si es necesario.',
    features: ['Amortiguadores', 'Bases', 'Rotulas y terminales de dirección', 'Resortes']
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
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

/* ─── Base ─── */
.servicios-page {
  font-family: 'Barlow', sans-serif;
  background: #080809;
  color: #e2e2e5;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ─── Background ─── */
.page-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.bg-img {
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=60&auto=format') center/cover no-repeat;
  opacity: 0.04;
}
.bg-overlay { position: absolute; inset: 0; background: #080809; opacity: 0.92; }
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,26,46,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,26,46,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* ─── Page Header ─── */
.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: calc(var(--nav-height, 68px) + 3.5rem) 2rem 3rem;
  animation: slideDown 0.7s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.header-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #ff1a2e;
  background: rgba(255,26,46,0.08);
  border: 1px solid rgba(255,26,46,0.2);
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #ff1a2e;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }

.page-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
}
.page-title em { font-style: normal; color: #ff1a2e; }
.page-sub { font-size: 0.95rem; color: rgba(255,255,255,0.38); max-width: 520px; margin: 0 auto; line-height: 1.6; }

/* ─── Filters ─── */
.filters-section {
  position: relative;
  z-index: 1;
  padding: 0 3rem 2.5rem;
}
.filters-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: 1300px;
  margin: 0 auto;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  backdrop-filter: blur(10px);
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px;
  padding: 0.5rem 0.9rem;
  color: rgba(255,255,255,0.25);
  flex: 1;
  min-width: 180px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within { border-color: rgba(255,26,46,0.35); }
.search-wrap input {
  background: none;
  border: none;
  outline: none;
  color: #e2e2e5;
  font-size: 0.85rem;
  font-family: 'Barlow', sans-serif;
  width: 100%;
}
.search-wrap input::placeholder { color: rgba(255,255,255,0.22); }

.filter-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.fpill {
  padding: 0.38rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.07);
  background: transparent;
  color: rgba(255,255,255,0.38);
  font-size: 0.78rem;
  font-weight: 600;
  font-family: 'Barlow', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.fpill:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
.fpill.active { background: #ff1a2e; color: #fff; border-color: #ff1a2e; box-shadow: 0 4px 16px rgba(255,26,46,0.35); }

.result-count {
  margin-left: auto;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.28);
  white-space: nowrap;
  font-family: 'Barlow', sans-serif;
}
.rc-num { font-weight: 700; color: rgba(255,255,255,0.55); margin-right: 0.25rem; }

/* ─── Services Grid ─── */
.services-section {
  position: relative;
  z-index: 1;
  padding: 0 3rem 5rem;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
}

/* ─── Service Card ─── */
.srv-card {
  background: #111113;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  display: flex;
  flex-direction: column;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
.srv-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255,26,46,0.25);
  box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,26,46,0.1);
}

/* Card image */
.srv-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}
.srv-img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.7) saturate(0.7);
  transition: transform 0.5s ease, filter 0.4s ease;
}
.srv-card:hover .srv-img {
  transform: scale(1.07);
  filter: brightness(0.55) saturate(0.5);
}
.srv-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(8,8,9,0.75) 100%);
}
.srv-cat {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(255,26,46,0.9);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  padding: 0.22rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.srv-price-tag {
  position: absolute;
  bottom: 14px; right: 14px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.7);
}

/* Card body */
.srv-body {
  padding: 1.25rem 1.4rem 1.4rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.srv-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.01em;
  margin-bottom: 0.4rem;
}
.srv-desc {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.42);
  line-height: 1.6;
  margin-bottom: 1rem;
}
.srv-features {
  list-style: none;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}
.srv-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
}
.srv-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: auto;
}
.srv-time {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.28);
}
.srv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: #ff1a2e;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Barlow', sans-serif;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.srv-btn:hover { background: #ff3347; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,26,46,0.4); }

/* ─── No Results ─── */
.no-results {
  text-align: center;
  padding: 6rem 2rem;
  max-width: 400px;
  margin: 0 auto;
  animation: fadeUp 0.4s ease both;
}
.no-results-icon { margin-bottom: 1.25rem; display: flex; justify-content: center; }
.no-results h3 {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.4rem;
}
.no-results p { font-size: 0.85rem; color: rgba(255,255,255,0.2); margin-bottom: 1.5rem; }
.no-results p em { font-style: normal; color: rgba(255,26,46,0.6); }
.clear-btn {
  padding: 0.5rem 1.25rem;
  background: rgba(255,26,46,0.1);
  border: 1px solid rgba(255,26,46,0.2);
  border-radius: 8px;
  color: #ff1a2e;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Barlow', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}
.clear-btn:hover { background: rgba(255,26,46,0.18); }

/* ─── CTA Strip ─── */
.cta-strip {
  position: relative;
  z-index: 1;
  padding: 0 3rem 5rem;
}
.cta-strip-inner {
  max-width: 1300px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255,26,46,0.1), rgba(255,26,46,0.04));
  border: 1px solid rgba(255,26,46,0.2);
  border-radius: 16px;
  padding: 2.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.cta-strip-text h2 {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.25rem;
  letter-spacing: 0.01em;
}
.cta-strip-text p { font-size: 0.88rem; color: rgba(255,255,255,0.4); }
.btn-primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.75rem;
  background: #ff1a2e;
  color: #fff;
  font-family: 'Barlow', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-primary-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(255,26,46,0.4); }

/* ─── Responsive — Full Coverage ─── */

/* Tablets (≤900px) */
@media (max-width: 900px) {
  .page-header { padding: calc(var(--nav-height,68px) + 2.5rem) 1.5rem 2rem; }
  .page-title { font-size: clamp(2.2rem, 7vw, 3.5rem); }
  .filters-section { padding-left: 1.5rem; padding-right: 1.5rem; }
  .services-section { padding-left: 1.5rem; padding-right: 1.5rem; padding-bottom: 4rem; }
  .cta-strip { padding-left: 1.5rem; padding-right: 1.5rem; padding-bottom: 4rem; }
  .filters-inner { flex-direction: column; align-items: stretch; gap: 0.75rem; }
  .search-wrap { max-width: 100%; }
  .search-wrap input { width: 100%; }
  .filter-pills { flex-wrap: wrap; }
  .result-count { margin-left: 0; text-align: right; }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .cta-strip-inner { flex-direction: column; text-align: center; padding: 2rem; gap: 1.5rem; }
  .btn-primary-cta { width: 100%; justify-content: center; }
}

/* Mobile (≤600px) */
@media (max-width: 600px) {
  .page-header { padding: calc(var(--nav-height,68px) + 2rem) 1.25rem 1.75rem; }
  .page-title { font-size: clamp(2rem, 9vw, 2.8rem); }
  .page-sub { font-size: 0.88rem; }
  .filters-section { padding-left: 1rem; padding-right: 1rem; padding-bottom: 1.5rem; }
  .services-section { padding-left: 1rem; padding-right: 1rem; padding-bottom: 3rem; }
  .cta-strip { padding-left: 1rem; padding-right: 1rem; padding-bottom: 3rem; }
  .services-grid { grid-template-columns: 1fr; }
  .fpill { font-size: 0.72rem; padding: 0.32rem 0.7rem; }
  .srv-img-wrap { height: 190px; }
  .srv-name { font-size: 1.15rem; }
  .cta-strip-text h2 { font-size: 1.3rem; }
}

/* Small phones (≤400px) */
@media (max-width: 400px) {
  .page-title { font-size: 1.9rem; }
  .filters-section, .services-section, .cta-strip { padding-left: 0.875rem; padding-right: 0.875rem; }
  .filters-inner { padding: 0.875rem 1rem; }
  .srv-body { padding: 1rem 1.1rem 1.1rem; }
}
</style>