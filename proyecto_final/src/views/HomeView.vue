<template>
  <main class="home" @mousemove="handleMouseMove">
    
    <!-- FUTURISTIC GLOW ORB BACKGROUND -->
    <div class="ambient-glow" :style="glowStyle"></div>

    <!-- 1. HERO PARALLAX (3D Hover + Scroll) -->
    <section class="hero-parallax">
      <div class="hero-bg" :style="{ transform: `translateY(${scrollY * 0.4}px) scale(1.05)` }"></div>
      <div class="hero-grid-overlay"></div>
      
      <div class="hero-content" :style="{ transform: `translate3d(${mouseX * -30}px, ${scrollY * 0.15 + (mouseY * -30)}px, 0)` }">
        <div class="hero-eyebrow fade-up" style="animation-delay: 0.2s;">
          <span class="eyebrow-line"></span>
          TALLER AUTOMOTRIZ DE PRÓXIMA GENERACIÓN
          <span class="eyebrow-line"></span>
        </div>
        
        <h1 class="hero-title fade-up" style="animation-delay: 0.4s;">
          REDEFINIENDO EL<br />
          <span class="glitch" data-text="RENDIMIENTO">RENDIMIENTO</span>
        </h1>
        
        <p class="hero-desc fade-up" style="animation-delay: 0.6s;">
          Bienvenido al estándar definitivo. Combina precisión técnica con tecnología de diagnóstico de vanguardia para una experiencia automotriz sin precedentes.
        </p>
        
        <div class="hero-actions fade-up" style="animation-delay: 0.8s;">
          <router-link to="/agendar" class="btn btn-primary">Inicializar Sistema</router-link>
          <button class="btn btn-ghost" @click="scrollToFeatures">Escanear Características</button>
        </div>
      </div>
      
      <div class="scroll-indicator fade-up" style="animation-delay: 1.2s;">
        <span>DESCUBRIR</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- 2. FEATURES MATTE (Intersection Observer) -->
    <section class="features" id="features">
      <div class="section-header observe-me">
        <h2>Ingeniería de <span>Precisión</span></h2>
        <p>No reparamos autos, optimizamos máquinas. Conoce nuestra infraestructura.</p>
      </div>

      <div class="features-grid">
        <div class="matte-card feature-card observe-me" v-for="(f, i) in features" :key="i" :style="{ transitionDelay: `${i * 0.15}s` }">
          <div class="feature-icon-wrap">
            <div class="feature-icon">{{ f.icon }}</div>
            <div class="icon-glow"></div>
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
          <div class="card-deco-line"></div>
        </div>
      </div>
    </section>

    <!-- 3. SERVICIOS DESTACADOS -->
    <section class="services-highlight">
      <div class="section-header observe-me">
        <h2>Catálogo de <span>Servicios</span></h2>
        <p>Soluciones diseñadas para el máximo desempeño de tu vehículo.</p>
      </div>

      <div class="services-grid">
        <div class="matte-card service-card observe-me" v-for="(s, i) in serviciosPreview" :key="i" :style="{ transitionDelay: `${i * 0.15}s` }">
          <div class="service-img-wrap">
            <div class="service-img" :style="{ backgroundImage: `url(${s.img})` }"></div>
            <div class="service-overlay"></div>
            <div class="service-price">${{ s.precio }}</div>
          </div>
          <div class="service-info">
            <div class="service-header-info">
              <span class="service-cat">{{ s.categoria }}</span>
              <span class="service-time">{{ s.tiempo }}</span>
            </div>
            <h4>{{ s.name }}</h4>
            <p>{{ s.desc }}</p>
            <div class="service-footer">
              <router-link to="/agendar" class="service-cta">Procesar Orden <span class="arr">→</span></router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="center-action observe-me">
        <router-link to="/servicios" class="btn btn-ghost">Acceder a Base de Datos</router-link>
      </div>
    </section>

    <!-- 4. FUTURISTIC CTA -->
    <section class="parallax-cta">
      <div class="cta-bg" :style="{ transform: `translateY(${(scrollY - 2000) * 0.2}px) scale(1.1)` }"></div>
      <div class="cta-grid"></div>
      
      <div class="cta-content matte-card observe-me">
        <div class="cta-ring"></div>
        <h2>Optimiza tu vehículo <span>ahora</span></h2>
        <p>Agenda hoy y recibe telemetría básica y escaneo computarizado de cortesía en tu primera visita a nuestras instalaciones.</p>
        <router-link to="/agendar" class="btn btn-primary">Comenzar Protocolo</router-link>
      </div>
    </section>

    <!-- FOOTER MATTE -->
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/logo.png" alt="Logo" class="footer-logo" />
          <p>El estándar definitivo en servicio automotriz profesional. Conducidos por la innovación.</p>
        </div>
        <div class="footer-links">
          <h4>Navegación</h4>
          <router-link to="/">Inicio</router-link>
          <router-link to="/servicios">Servicios</router-link>
          <router-link to="/agendar">Agendar Cita</router-link>
        </div>
        <div class="footer-contact">
          <h4>Terminal de Contacto</h4>
          <p><span class="fc-icon">⌖</span> Av. Principal 123, Sector 7</p>
          <p><span class="fc-icon">☏</span> +1 234 567 890</p>
          <p><span class="fc-icon">✉</span> sys@drivenyield.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Driven Yield Pro System. Conexión segura establecida.</p>
      </div>
    </footer>

  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const scrollY = ref(0)
const rawMouseX = ref(0)
const rawMouseY = ref(0)
const observer = ref(null)

const mouseX = computed(() => rawMouseX.value / window.innerWidth - 0.5)
const mouseY = computed(() => rawMouseY.value / window.innerHeight - 0.5)

const glowStyle = computed(() => ({
  top: `${rawMouseY.value}px`,
  left: `${rawMouseX.value}px`,
  transform: 'translate(-50%, -50%)'
}))

const onScroll = () => { scrollY.value = window.scrollY }
const handleMouseMove = (e) => {
  rawMouseX.value = e.clientX
  rawMouseY.value = e.clientY
}

const scrollToFeatures = () => {
  const el = document.getElementById('features')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  
  // Intersection Observer for scroll animations
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.15 })

  document.querySelectorAll('.observe-me').forEach(el => observer.value.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer.value) observer.value.disconnect()
})

const features = [
  { icon: '01', title: 'Diagnóstico IA', desc: 'Escaneo profundo asistido por algoritmos para detectar anomalías antes de que ocurran.' },
  { icon: '02', title: 'Piezas OEM', desc: 'Certificación de componentes originales para mantener la integridad de tu máquina.' },
  { icon: '03', title: 'Telemetría', desc: 'Seguimiento en tiempo real del estado de reparación a través de nuestra plataforma.' },
]

const serviciosPreview = [
  {
    img: 'https://images.unsplash.com/photo-1625047509168-a71c6f21223e?w=800&q=80',
    name: 'Calibración de Motor',
    desc: 'Optimización de ECU, inyección y fluidos sintéticos para máximo rendimiento.',
    precio: 120, tiempo: '60 min', categoria: 'RENDIMIENTO'
  },
  {
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    name: 'Dinámica Estructural',
    desc: 'Alineación láser 3D y calibración de suspensión adaptativa.',
    precio: 85, tiempo: '1.5 hrs', categoria: 'CHASIS'
  },
  {
    img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80',
    name: 'Sistemas de Frenado Cerámico',
    desc: 'Mantenimiento preventivo y reemplazo de pastillas de alta fricción.',
    precio: 250, tiempo: '2 hrs', categoria: 'SEGURIDAD'
  }
]
</script>

<style scoped>
/* AMBIENT GLOW */
.ambient-glow {
  position: fixed;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(230,0,35,0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s;
  mix-blend-mode: screen;
}

/* BASE ANIMATIONS */
.fade-up {
  opacity: 0; transform: translateY(30px);
  animation: introFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes introFadeUp { to { opacity: 1; transform: translateY(0); } }

.observe-me {
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.observe-me.is-visible { opacity: 1; transform: translateY(0); }

/* HERO PARALLAX */
.hero-parallax {
  position: relative; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: -10%;
  background: url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&q=80') center/cover no-repeat;
  filter: grayscale(100%) brightness(0.2) contrast(1.2);
  z-index: 0; will-change: transform;
}
.hero-grid-overlay {
  position: absolute; inset: 0;
  background-image: 
    linear-gradient(rgba(230,0,35,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(230,0,35,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  z-index: 1;
}
.hero-content {
  position: relative; z-index: 2;
  text-align: center; max-width: 900px; padding: 0 2rem;
  will-change: transform;
}
.hero-eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 1rem;
  font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 4px; color: var(--primary); margin-bottom: 2rem;
}
.eyebrow-line { width: 50px; height: 1px; background: rgba(230,0,35,0.5); }
.hero-title {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 900; line-height: 1; color: white; margin-bottom: 1.5rem;
  text-transform: uppercase; letter-spacing: -2px;
}
.glitch {
  position: relative; color: var(--primary); display: inline-block;
  text-shadow: 0 0 30px rgba(230,0,35,0.4);
}
.hero-desc {
  font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 3.5rem;
  max-width: 650px; margin-left: auto; margin-right: auto; line-height: 1.8;
}
.hero-actions { display: flex; gap: 1.5rem; justify-content: center; }
.scroll-indicator {
  position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  z-index: 2;
}
.scroll-indicator span {
  font-family: 'Space Grotesk', sans-serif; font-size: 0.6rem;
  letter-spacing: 3px; color: rgba(255,255,255,0.3);
}
.scroll-line {
  width: 1px; height: 50px;
  background: linear-gradient(to bottom, rgba(230,0,35,0.5), transparent);
  animation: scrollDown 2s ease-in-out infinite;
}
@keyframes scrollDown {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* SECTION HEADER */
.section-header h2 span { color: var(--primary); font-style: italic; padding-right: 0.2rem; }

/* FEATURES */
.features { padding: 8rem 2rem 4rem; max-width: 1300px; margin: 0 auto; position: relative; z-index: 10; }
.features-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem; margin-top: 5rem;
}
.feature-card { padding: 3rem 2.5rem; text-align: left; }
.feature-icon-wrap { position: relative; margin-bottom: 2rem; display: inline-block; }
.feature-icon {
  font-family: 'Space Grotesk', sans-serif; font-size: 4rem; font-weight: 300;
  color: white; line-height: 1; position: relative; z-index: 2;
}
.icon-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 60px; height: 60px; background: var(--primary); filter: blur(30px);
  opacity: 0.3; z-index: 1; transition: opacity 0.4s;
}
.feature-card:hover .icon-glow { opacity: 0.6; }
.feature-card h3 { font-size: 1.4rem; margin-bottom: 1rem; color: white; letter-spacing: 1px; }
.feature-card p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; }
.card-deco-line {
  width: 0; height: 2px; background: var(--primary); margin-top: 2rem;
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.feature-card:hover .card-deco-line { width: 40px; }

/* SERVICES HIGHLIGHT */
.services-highlight { padding: 6rem 2rem; max-width: 1300px; margin: 0 auto; position: relative; z-index: 10; }
.services-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem; margin-top: 5rem; margin-bottom: 4rem;
}
.service-card { display: flex; flex-direction: column; padding: 0; }
.service-img-wrap { position: relative; height: 250px; overflow: hidden; }
.service-img {
  width: 100%; height: 100%; background-size: cover; background-position: center;
  filter: grayscale(80%) contrast(1.2); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.service-card:hover .service-img { transform: scale(1.1); filter: grayscale(0%) contrast(1.1); }
.service-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, var(--bg-card) 0%, transparent 100%);
}
.service-price {
  position: absolute; bottom: 20px; right: 20px;
  font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700;
  color: white; text-shadow: 0 5px 15px rgba(0,0,0,0.8);
}
.service-info { padding: 2rem; display: flex; flex-direction: column; flex: 1; }
.service-header-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.service-cat {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 3px; color: var(--primary); padding: 0.3rem 0.8rem;
  border: 1px solid rgba(230,0,35,0.3); border-radius: 100px;
}
.service-time { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: var(--text-muted); }
.service-info h4 { font-size: 1.5rem; color: white; margin-bottom: 1rem; }
.service-info p { color: var(--text-secondary); font-size: 0.95rem; flex: 1; margin-bottom: 2rem; line-height: 1.6; }
.service-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; }
.service-cta {
  font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700;
  color: white; text-transform: uppercase; letter-spacing: 2px;
  display: flex; align-items: center; justify-content: space-between; transition: color 0.3s;
}
.service-cta .arr { color: var(--primary); transition: transform 0.3s; }
.service-cta:hover { color: var(--primary); }
.service-cta:hover .arr { transform: translateX(5px); }

/* PARALLAX CTA */
.parallax-cta {
  position: relative; padding: 10rem 2rem; margin-top: 5rem;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.cta-bg {
  position: absolute; inset: -15%;
  background: url('https://images.unsplash.com/photo-1503375839088-33eb0e94770d?w=1600&q=80') center/cover no-repeat;
  filter: grayscale(100%) brightness(0.15); z-index: 0; will-change: transform;
}
.cta-grid {
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, transparent 0%, var(--bg-deep) 80%),
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px; z-index: 1;
}
.cta-content { position: relative; z-index: 2; text-align: center; padding: 5rem 4rem; max-width: 800px; border-radius: 24px; }
.cta-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 150%; height: 150%; border-radius: 50%; border: 1px solid rgba(230,0,35,0.1);
  animation: pulseRing 4s linear infinite; pointer-events: none; z-index: -1;
}
@keyframes pulseRing {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}
.cta-content h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.5rem; line-height: 1.1; }
.cta-content h2 span { color: var(--primary); }
.cta-content p { color: var(--text-secondary); margin-bottom: 3rem; font-size: 1.1rem; line-height: 1.6; }

/* FOOTER */
.footer {
  background: var(--bg-deep); border-top: 1px solid rgba(255,255,255,0.03);
  padding: 6rem 2rem 2rem; position: relative; z-index: 10;
}
.footer-grid {
  max-width: 1300px; margin: 0 auto 4rem;
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem;
}
.footer-logo { height: 40px; margin-bottom: 1.5rem; filter: grayscale(100%) brightness(200%); opacity: 0.8; }
.footer-brand p { color: var(--text-secondary); font-size: 0.95rem; max-width: 350px; line-height: 1.6; }
.footer h4 { color: white; margin-bottom: 2rem; font-size: 1.1rem; font-family: 'Space Grotesk', sans-serif; letter-spacing: 1px; }
.footer-links { display: flex; flex-direction: column; gap: 1rem; }
.footer-links a { color: var(--text-secondary); font-size: 0.95rem; transition: color 0.3s; }
.footer-links a:hover { color: var(--primary); padding-left: 5px; }
.footer-contact p { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
.fc-icon { color: var(--primary); font-size: 1.2rem; }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.03); padding-top: 2rem; text-align: center;
  color: var(--text-muted); font-size: 0.8rem; font-family: 'Space Grotesk', sans-serif; letter-spacing: 2px; text-transform: uppercase;
}

@media (max-width: 900px) {
  .hero-title { font-size: 3rem; }
  .footer-grid { grid-template-columns: 1fr; gap: 3rem; }
  .hero-actions { flex-direction: column; }
}
</style>