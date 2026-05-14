<template>
  <main class="home">

    <!-- ═══════════════════════════════════════
         HERO
    ════════════════════════════════════════ -->
    <section class="hero">
      <!-- Fondo con partículas y gradientes -->
      <div class="hero-bg">
        <div class="hero-bg-img"></div>
        <div class="hero-bg-overlay"></div>
        <div class="hero-grid"></div>
        <!-- Líneas decorativas -->
        <div class="hero-line hero-line--1"></div>
        <div class="hero-line hero-line--2"></div>
      </div>

      <div class="hero-inner">
        <!-- Columna izquierda -->
        <div class="hero-content">
          <div class="hero-eyebrow" style="animation-delay:0s">
            <span class="eyebrow-dot"></span>
            TALLER MECÁNICO PROFESIONAL
          </div>

          <h1 class="hero-title" style="animation-delay:0.15s">
            <span class="ht-line ht-white">TU AUTO</span>
            <span class="ht-line ht-red">EN LAS</span>
            <span class="ht-line ht-outline">MEJORES<br>MANOS</span>
          </h1>

          <p class="hero-desc" style="animation-delay:0.3s">
            Más de 15 años brindando servicios automotrices de élite.
            Diagnóstico computarizado, garantía en todos nuestros trabajos.
          </p>

          <div class="hero-cta" style="animation-delay:0.45s">
            <router-link to="/agendar" class="btn-primary-hero">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Agendar Cita
            </router-link>
            <router-link to="/servicios" class="btn-ghost-hero">
              Ver Servicios
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>

          <!-- Stats -->
          <div class="hero-stats" style="animation-delay:0.6s">
            <div class="hero-stat">
              <span class="hs-num">15+</span>
              <span class="hs-label">Años de experiencia</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hs-num">2K+</span>
              <span class="hs-label">Clientes satisfechos</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hs-num">100%</span>
              <span class="hs-label">Garantía en servicios</span>
            </div>
          </div>
        </div>

        <!-- Columna derecha: imagen del auto -->
        <div class="hero-visual" style="animation-delay:0.2s">
          <div class="hero-car-wrap">
            <div class="hero-car-glow"></div>
            <img
              src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format"
              alt="Auto en taller"
              class="hero-car-img"
            />
            <!-- Badge flotante -->
            <div class="hero-badge hero-badge--1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Diagnóstico incluido
            </div>
            <div class="hero-badge hero-badge--2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff1a2e" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Garantía total
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-hint">
        <div class="scroll-line"></div>
        <span>scroll</span>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         FEATURES
    ════════════════════════════════════════ -->
    <section class="features">
      <div class="section-label">¿POR QUÉ ELEGIRNOS?</div>
      <div class="section-title-wrap">
        <h2 class="section-h2">Excelencia en cada <em>detalle</em></h2>
        <p class="section-sub">Calidad, honestidad y resultados garantizados</p>
      </div>

      <div class="features-grid">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          class="feat-card"
          :style="`animation-delay:${i * 0.08}s`"
        >
          <div class="feat-img-wrap">
            <img :src="f.img" :alt="f.title" class="feat-img" />
            <div class="feat-img-overlay"></div>
          </div>
          <div class="feat-body">
            <h3 class="feat-title">{{ f.title }}</h3>
            <p class="feat-desc">{{ f.desc }}</p>
          </div>
          <div class="feat-number">{{ String(i + 1).padStart(2, '0') }}</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SERVICIOS
    ════════════════════════════════════════ -->
    <section class="services">
      <div class="services-top">
        <div>
          <div class="section-label">NUESTROS SERVICIOS</div>
          <h2 class="section-h2">Soluciones para <em>tu vehículo</em></h2>
        </div>
        <router-link to="/servicios" class="btn-ghost-hero">
          Ver todos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <div class="services-grid">
        <div  
          v-for="(s, i) in serviciosPreview"
          :key="s.name"
          class="srv-card"
          :style="`animation-delay:${i * 0.1}s`"
        >
          <div class="srv-img-wrap">
            <img :src="s.img" :alt="s.name" class="srv-img" />
            <div class="srv-overlay"></div>
            <span class="srv-cat">{{ s.categoria }}</span>
            <div class="srv-price-badge">${{ s.precio }}</div>
          </div>
          <div class="srv-body">
            <h4 class="srv-name">{{ s.name }}</h4>
            <p class="srv-desc">{{ s.desc }}</p>
            <div class="srv-footer">
              <div class="srv-time">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ s.tiempo }}
              </div>
              <router-link to="/agendar" class="srv-cta">Agendar →</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         BANNER INTERMEDIO
    ════════════════════════════════════════ -->
    <section class="mid-banner">
      <img
        src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1400&q=80&auto=format"
        alt="Taller mecánico"
        class="mid-banner-img"
      />
      <div class="mid-banner-overlay"></div>
      <div class="mid-banner-content">
        <div class="section-label" style="color:rgba(255,255,255,0.6)">NUESTRA PROMESA</div>
        <h2 class="mid-banner-title">Calidad que <em>se siente</em><br>en cada kilómetro</h2>
        <router-link to="/agendar" class="btn-primary-hero">Agendar ahora</router-link>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         TESTIMONIALS
    ════════════════════════════════════════ -->
    <section class="testimonials">
      <div class="section-label">TESTIMONIOS</div>
      <h2 class="section-h2">Lo que dicen nuestros <em>clientes</em></h2>

      <div class="testi-grid">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="testi-card"
          :style="`animation-delay:${i * 0.12}s`"
        >
          <div class="testi-stars">
            <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" fill="#ff1a2e"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="testi-text">"{{ t.text }}"</p>
          <div class="testi-author">
            <div class="testi-avatar" :style="`background:${t.color}`">{{ t.initials }}</div>
            <div>
              <div class="testi-name">{{ t.name }}</div>
              <div class="testi-since">{{ t.since }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         CTA FINAL
    ════════════════════════════════════════ -->
    <section class="cta-section">
      <div class="cta-inner">
        <div class="cta-glow"></div>
        <div class="cta-text">
          <div class="section-label">¿LISTO?</div>
          <h2 class="cta-title">Agenda hoy y recibe<br><em>revisión gratuita</em> de niveles</h2>
          <p class="cta-sub">Sin compromiso. Atención inmediata. Tu auto en las mejores manos.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/agendar" class="btn-primary-hero btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Agendar Ahora
          </router-link>
          <router-link to="/servicios" class="btn-ghost-hero">Ver Precios →</router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         FOOTER
    ════════════════════════════════════════ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand-col">
          <div class="footer-logo">
            <span class="fl-main">DRIVEN YIELD</span>
            <span class="fl-sub">PRO SYSTEM</span>
          </div>
          <p class="footer-about">Taller mecánico profesional con más de 15 años de experiencia en el sector automotriz.</p>
        </div>

        <div class="footer-col">
          <h5>CONTACTO</h5>
          <div class="fc-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Av. Principal 123
          </div>
          <div class="fc-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 13.1 19.79 19.79 0 0 1 1.61 4.47 2 2 0 0 1 3.59 2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.96-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17l.19-.08z"/></svg>
            +1 234 567 890
          </div>
          <div class="fc-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            info@drivenyield.com
          </div>
        </div>

        <div class="footer-col">
          <h5>HORARIO</h5>
          <div class="fc-item">Lun – Vie: 8am – 6pm</div>
          <div class="fc-item">Sábado: 9am – 2pm</div>
          <div class="fc-item fc-closed">Domingo: Cerrado</div>
        </div>

        <div class="footer-col">
          <h5>NAVEGACIÓN</h5>
          <router-link to="/" class="fc-link">Inicio</router-link>
          <router-link to="/servicios" class="fc-link">Servicios</router-link>
          <router-link to="/agendar" class="fc-link">Agendar</router-link>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 Driven Yield Pro System. Todos los derechos reservados.</p>
        <div class="footer-bottom-line"></div>
      </div>
    </footer>
  </main>
</template>

<script setup>
const features = [
  {
    img: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80&auto=format',
    title: '15+ Años de Experiencia',
    desc: 'Técnicos certificados con amplia trayectoria en marcas nacionales e importadas.'
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format',
    title: 'Garantía en Todo',
    desc: 'Cada servicio tiene respaldo de garantía. Si algo falla, lo resolvemos sin costo.'
  },
  {
    img: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&q=80&auto=format',
    title: 'Diagnóstico Rápido',
    desc: 'Diagnóstico computarizado de última generación para identificar problemas al instante.'
  },
  {
    img: 'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=400&q=80&auto=format',
    title: 'Precios Transparentes',
    desc: 'Sin sorpresas. Te informamos el costo antes de comenzar cualquier trabajo.'
  },
  {
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format',
    title: 'Horario Extendido',
    desc: 'Lunes a viernes 8am–6pm, sábados 9am–2pm para mayor comodidad.'
  },
  {
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format',
    title: 'Seguimiento Post-Servicio',
    desc: 'Te contactamos 48h después para asegurarnos de tu total satisfacción.'
  },
]

const serviciosPreview = [
  {
    img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80&auto=format',
    name: 'Cambio de Aceite',
    desc: 'Cambio de aceite y filtro con lubricantes de primera calidad.',
    precio: 45, tiempo: '30 min', categoria: 'MANTENIMIENTO'
  },
  {
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format',
    name: 'Alineación y Balanceo',
    desc: 'Alineación computarizada y balanceo de las 4 ruedas.',
    precio: 60, tiempo: '1 hora', categoria: 'SUSPENSIÓN'
  },
  {
    img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80&auto=format',
    name: 'Frenos Completos',
    desc: 'Cambio de pastillas, discos y revisión completa del sistema.',
    precio: 180, tiempo: '2 horas', categoria: 'FRENOS'
  },
  {
    img: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&q=80&auto=format',
    name: 'Diagnóstico Computarizado',
    desc: 'Escaneo completo del sistema electrónico del vehículo.',
    precio: 50, tiempo: '45 min', categoria: 'DIAGNÓSTICO'
  },
]

const testimonials = [
  { name: 'Carlos Mendez',  initials: 'CM', color: '#ff1a2e', since: 'Cliente desde 2019', text: 'Excelente servicio, muy profesionales y honestos. Me explicaron todo el proceso paso a paso.' },
  { name: 'María González', initials: 'MG', color: '#457b9d', since: 'Cliente desde 2020', text: 'La mejor atención y precios justos de la zona. Repararon los frenos de mi SUV perfectamente.' },
  { name: 'Roberto Silva',  initials: 'RS', color: '#2a9d8f', since: 'Cliente desde 2021', text: 'Rápidos y eficientes. El diagnóstico detectó un problema que otros talleres pasaron por alto.' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Barlow:wght@400;500;600&display=swap');

/* ─── Base ─── */
.home { font-family: 'Barlow', sans-serif; background: #080809; color: #e2e2e5; overflow-x: hidden; }

/* ─── Shared section labels ─── */
.section-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #ff1a2e;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  display: block;
}
.section-h2 {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}
.section-h2 em { font-style: normal; color: #ff1a2e; }
.section-sub { color: rgba(255,255,255,0.4); font-size: 0.95rem; }

/* ══════════════════════════════
   HERO
══════════════════════════════ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-bg-img {
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80&auto=format') center/cover no-repeat;
  transform: scale(1.05);
  animation: slowZoom 20s ease-in-out infinite alternate;
}
@keyframes slowZoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }
.hero-bg-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, #080809 45%, rgba(8,8,9,0.7) 70%, rgba(8,8,9,0.3) 100%);
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,26,46,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,26,46,0.04) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: gridFade 3s ease forwards;
}
@keyframes gridFade { from { opacity: 0; } to { opacity: 1; } }
.hero-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255,26,46,0.3), transparent);
  height: 1px;
  width: 60%;
  animation: lineScan 4s ease-in-out infinite alternate;
}
.hero-line--1 { top: 30%; left: 0; animation-delay: 0s; }
.hero-line--2 { top: 70%; left: 20%; animation-delay: 1.5s; }
@keyframes lineScan { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(20px); } }

.hero-inner {
  position: relative; z-index: 1;
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: calc(var(--nav-height, 68px) + 3rem) 5rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Hero content */
.hero-content { flex: 1; max-width: 580px; }
.hero-content > * { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #ff1a2e;
  text-transform: uppercase;
  background: rgba(255,26,46,0.08);
  border: 1px solid rgba(255,26,46,0.2);
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.5rem;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #ff1a2e;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}
.ht-line { display: block; }
.ht-white { color: #fff; }
.ht-red { color: #ff1a2e; text-shadow: 0 0 40px rgba(255,26,46,0.5); }
.ht-outline { -webkit-text-stroke: 2px #ff1a2e; color: transparent; }

.hero-desc { color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; max-width: 460px; }

.hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }

.btn-primary-hero {
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
  position: relative;
  overflow: hidden;
}
.btn-primary-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.btn-primary-hero:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,26,46,0.4); }
.btn-primary-hero:hover::after { opacity: 1; }
.btn-lg { padding: 1rem 2.25rem; font-size: 1rem; }

.btn-ghost-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.75);
  font-family: 'Barlow', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.btn-ghost-hero:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }

.hero-stats { display: flex; align-items: center; gap: 1.5rem; }
.hero-stat { display: flex; flex-direction: column; }
.hs-num { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; color: #fff; line-height: 1; }
.hs-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); letter-spacing: 0.05em; margin-top: 0.2rem; }
.hero-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

/* Hero visual */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease 0.2s both;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.hero-car-wrap { position: relative; width: 100%; max-width: 560px; }
.hero-car-glow {
  position: absolute;
  bottom: -20px; left: 50%;
  transform: translateX(-50%);
  width: 80%; height: 80px;
  background: radial-gradient(ellipse, rgba(255,26,46,0.5), transparent 70%);
  filter: blur(20px);
  animation: glowPulse 3s ease-in-out infinite alternate;
}
@keyframes glowPulse { from { opacity: 0.5; } to { opacity: 1; } }
.hero-car-img {
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
  aspect-ratio: 4/3;
  position: relative;
  z-index: 1;
  filter: brightness(0.9) contrast(1.1);
  animation: carFloat 6s ease-in-out infinite alternate;
}
@keyframes carFloat { from { transform: translateY(0); } to { transform: translateY(-10px); } }

.hero-badge {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(10,10,12,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.hero-badge--1 {
  top: 20px; left: -20px;
  animation: badgeFloat1 4s ease-in-out infinite alternate;
}
.hero-badge--2 {
  bottom: 30px; right: -20px;
  animation: badgeFloat2 4s ease-in-out infinite alternate;
}
@keyframes badgeFloat1 { from { transform: translateY(0); } to { transform: translateY(-8px); } }
@keyframes badgeFloat2 { from { transform: translateY(0); } to { transform: translateY(8px); } }

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
  animation: fadeIn 1s ease 1s both;
}
.scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
  animation: scrollAnim 1.5s ease-in-out infinite;
}
@keyframes scrollAnim { from { transform: scaleY(0); transform-origin: top; } to { transform: scaleY(1); transform-origin: top; } }
.scroll-hint span { font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); text-transform: uppercase; }

/* ══════════════════════════════
   FEATURES
══════════════════════════════ */
.features {
  padding: 6rem 5rem;
  background: #0c0c0e;
}
.features > .section-label,
.features > .section-title-wrap { max-width: 1300px; margin-left: auto; margin-right: auto; }
.section-title-wrap { margin-bottom: 3rem; max-width: 1300px; margin-left: auto; margin-right: auto; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
}
.feat-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  background: #111113;
  transition: all 0.3s ease;
  animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  cursor: default;
}
.feat-card:hover { transform: translateY(-6px); border-color: rgba(255,26,46,0.25); }
.feat-img-wrap { position: relative; height: 180px; overflow: hidden; }
.feat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; filter: brightness(0.7) saturate(0.8); }
.feat-card:hover .feat-img { transform: scale(1.08); filter: brightness(0.5) saturate(0.6); }
.feat-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 30%, #111113 100%);
}
.feat-body { padding: 1.25rem 1.5rem 1.5rem; }
.feat-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.4rem; letter-spacing: 0.01em; }
.feat-desc { font-size: 0.84rem; color: rgba(255,255,255,0.45); line-height: 1.6; }
.feat-number {
  position: absolute;
  top: 14px; right: 16px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255,26,46,0.12);
  line-height: 1;
  pointer-events: none;
  transition: color 0.3s;
}
.feat-card:hover .feat-number { color: rgba(255,26,46,0.25); }

/* ══════════════════════════════
   SERVICIOS
══════════════════════════════ */
.services {
  padding: 6rem 5rem;
  background: #080809;
}
.services-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  max-width: 1300px;
  margin: 0 auto 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
}
.srv-card {
  border-radius: 16px;
  overflow: hidden;
  background: #111113;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;
  animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
.srv-card:hover { transform: translateY(-6px); border-color: rgba(255,26,46,0.25); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.srv-img-wrap { position: relative; height: 200px; overflow: hidden; }
.srv-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; filter: brightness(0.75) saturate(0.7); }
.srv-card:hover .srv-img { transform: scale(1.08); }
.srv-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,8,9,0.7) 100%); }
.srv-cat {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(255,26,46,0.9);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}
.srv-price-badge {
  position: absolute;
  bottom: 12px; right: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6);
}
.srv-body { padding: 1.1rem 1.25rem 1.25rem; }
.srv-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 0.35rem; }
.srv-desc { font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.5; margin-bottom: 0.85rem; }
.srv-footer { display: flex; align-items: center; justify-content: space-between; }
.srv-time { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: rgba(255,255,255,0.3); }
.srv-cta {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ff1a2e;
  text-decoration: none;
  transition: gap 0.2s;
  letter-spacing: 0.02em;
}
.srv-cta:hover { color: #ff4455; }

/* ══════════════════════════════
   MID BANNER
══════════════════════════════ */
.mid-banner {
  position: relative;
  height: 420px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mid-banner-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.35) saturate(0.5);
  transform: scale(1.05);
  animation: slowZoom 15s ease-in-out infinite alternate;
}
.mid-banner-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(8,8,9,0.8) 0%, rgba(8,8,9,0.3) 50%, rgba(8,8,9,0.8) 100%);
}
.mid-banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}
.mid-banner-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-align: center;
}
.mid-banner-title em { font-style: normal; color: #ff1a2e; }

/* ══════════════════════════════
   TESTIMONIALS
══════════════════════════════ */
.testimonials {
  padding: 6rem 5rem;
  background: #0c0c0e;
}
.testimonials > .section-label,
.testimonials > .section-h2 {
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.testimonials > .section-h2 { margin-bottom: 3rem; }

.testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
}
.testi-card {
  background: #111113;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s ease;
  animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
.testi-card:hover { transform: translateY(-5px); border-color: rgba(255,26,46,0.2); }
.testi-stars { display: flex; gap: 0.2rem; margin-bottom: 1rem; }
.testi-text { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
.testi-author { display: flex; align-items: center; gap: 0.75rem; }
.testi-avatar {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem; color: #fff;
  flex-shrink: 0;
}
.testi-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
.testi-since { font-size: 0.72rem; color: rgba(255,255,255,0.3); margin-top: 0.1rem; }

/* ══════════════════════════════
   CTA
══════════════════════════════ */
.cta-section { padding: 6rem 5rem; background: #080809; }
.cta-inner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  background: #111113;
  border: 1px solid rgba(255,26,46,0.2);
  border-radius: 24px;
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
  overflow: hidden;
}
.cta-glow {
  position: absolute;
  top: -100px; left: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,26,46,0.15), transparent 70%);
  pointer-events: none;
}
.cta-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}
.cta-title em { font-style: normal; color: #ff1a2e; }
.cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.35); }
.cta-actions { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; flex-shrink: 0; }

/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
.footer { background: #060607; border-top: 1px solid rgba(255,255,255,0.06); padding: 4rem 5rem 2rem; }
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  max-width: 1300px;
  margin: 0 auto 3rem;
}
.footer-logo { margin-bottom: 1rem; }
.fl-main { display: block; font-family: 'Barlow Condensed', sans-serif; font-size: 1.4rem; font-weight: 900; letter-spacing: 0.08em; color: #fff; }
.fl-sub { display: block; font-size: 0.58rem; letter-spacing: 0.25em; color: #ff1a2e; text-transform: uppercase; margin-top: 0.1rem; }
.footer-about { font-size: 0.84rem; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 260px; }
.footer-col h5 { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.35); text-transform: uppercase; margin-bottom: 1.25rem; }
.fc-item {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.84rem; color: rgba(255,255,255,0.45);
  margin-bottom: 0.6rem;
}
.fc-closed { color: rgba(255,255,255,0.2); }
.fc-link {
  display: block;
  font-size: 0.84rem;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  margin-bottom: 0.6rem;
  transition: color 0.2s;
}
.fc-link:hover { color: #ff1a2e; }

.footer-bottom {
  max-width: 1300px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  text-align: center;
}
.footer-bottom p { font-size: 0.78rem; color: rgba(255,255,255,0.2); }

/* ══════════════════════════════
   RESPONSIVE — FULL COVERAGE
   xl: 1280+ | lg: 1024 | md: 768 | sm: 480 | xs: 360
══════════════════════════════ */

/* ── Large tablets / small laptops (≤1100px) ── */
@media (max-width: 1100px) {
  .hero-inner { padding: calc(var(--nav-height,68px) + 2rem) 3rem 3rem; gap: 2.5rem; }
  .features, .services, .testimonials, .cta-section, .footer { padding-left: 3rem; padding-right: 3rem; }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ── Tablets (≤900px) ── */
@media (max-width: 900px) {
  /* Hero */
  .hero-inner { flex-direction: column; text-align: center; padding: calc(var(--nav-height,68px) + 2rem) 2rem 3rem; gap: 2rem; }
  .hero-content { max-width: 100%; }
  .hero-desc { max-width: 100%; margin-left: auto; margin-right: auto; }
  .hero-cta { justify-content: center; flex-wrap: wrap; }
  .hero-stats { justify-content: center; gap: 1.25rem; }
  .hero-visual { width: 100%; max-width: 500px; margin: 0 auto; }
  .hero-badge--1 { left: 0; top: 10px; }
  .hero-badge--2 { right: 0; bottom: 10px; }
  .scroll-hint { display: none; }

  /* Sections padding */
  .features, .services, .testimonials, .cta-section, .footer { padding-left: 2rem; padding-right: 2rem; }
  .features { padding-top: 4rem; padding-bottom: 4rem; }
  .services { padding-top: 4rem; padding-bottom: 4rem; }
  .testimonials { padding-top: 4rem; padding-bottom: 4rem; }

  /* Grids */
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .testi-grid { grid-template-columns: repeat(2, 1fr); }

  /* Services top */
  .services-top { flex-direction: column; align-items: flex-start; gap: 0.75rem; }

  /* CTA */
  .cta-inner { flex-direction: column; text-align: center; padding: 2.5rem 2rem; gap: 2rem; }
  .cta-actions { width: 100%; align-items: center; flex-direction: row; justify-content: center; flex-wrap: wrap; }

  /* Mid banner */
  .mid-banner { height: 320px; }

  /* Footer */
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .footer { padding: 3rem 2rem 2rem; }
}

/* ── Mobile (≤600px) ── */
@media (max-width: 600px) {
  /* Hero */
  .hero-inner { padding: calc(var(--nav-height,68px) + 1.5rem) 1.25rem 2.5rem; }
  .hero-title { font-size: clamp(2.8rem, 11vw, 4rem); }
  .hero-eyebrow { font-size: 0.62rem; }
  .hero-desc { font-size: 0.92rem; }
  .hero-stats { gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .hs-num { font-size: 1.5rem; }
  .hero-badge { display: none; } /* demasiado apretado en móvil */
  .hero-car-img { border-radius: 14px; }

  /* Buttons */
  .btn-primary-hero, .btn-ghost-hero { width: 100%; justify-content: center; }
  .hero-cta { flex-direction: column; gap: 0.75rem; }

  /* Sections */
  .features, .services, .testimonials, .cta-section { padding-left: 1.25rem; padding-right: 1.25rem; }
  .features { padding-top: 3rem; padding-bottom: 3rem; }
  .services { padding-top: 3rem; padding-bottom: 3rem; }
  .testimonials { padding-top: 3rem; padding-bottom: 3rem; }
  .cta-section { padding-top: 3rem; padding-bottom: 3rem; }

  /* Grids → 1 col */
  .features-grid { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
  .testi-grid { grid-template-columns: 1fr; }

  /* Cards */
  .feat-img-wrap { height: 160px; }
  .srv-img-wrap { height: 180px; }

  /* Section titles */
  .section-h2 { font-size: clamp(1.7rem, 7vw, 2.5rem); }

  /* CTA */
  .cta-inner { padding: 2rem 1.25rem; border-radius: 16px; }
  .cta-title { font-size: clamp(1.5rem, 6vw, 2.2rem); }
  .cta-actions { flex-direction: column; }
  .btn-lg { width: 100%; justify-content: center; }

  /* Mid banner */
  .mid-banner { height: 260px; }
  .mid-banner-title { font-size: clamp(1.6rem, 6vw, 2.5rem); }

  /* Footer */
  .footer { padding: 2.5rem 1.25rem 1.5rem; }
  .footer-inner { grid-template-columns: 1fr; gap: 1.75rem; }
  .footer-about { max-width: 100%; }
}

/* ── Small phones (≤400px) ── */
@media (max-width: 400px) {
  .hero-title { font-size: clamp(2.4rem, 10vw, 3rem); }
  .hero-stats { gap: 0.75rem; }
  .hs-num { font-size: 1.3rem; }
  .hero-stat-divider { height: 28px; }
  .section-h2 { font-size: 1.6rem; }
  .features, .services, .testimonials, .cta-section { padding-left: 1rem; padding-right: 1rem; }
  .footer { padding-left: 1rem; padding-right: 1rem; }
}
</style>