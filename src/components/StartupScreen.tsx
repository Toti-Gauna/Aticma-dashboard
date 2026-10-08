import { motion, useReducedMotion } from 'motion/react';

const colors = ['#64d3de', '#b5dc6b', '#e7b765', '#d084bc', '#a894ed', '#64d3de'];

export function StartupScreen() {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      className="startup-screen"
      role="status"
      aria-label="Cargando workspace"
      aria-live="polite"
      aria-atomic="true"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.35 }}
    >
      <div className="startup-grid" aria-hidden="true" />
      <div className="startup-glow" aria-hidden="true" />
      <div className="startup-content">
        <span className="startup-eyebrow">APRENDER. APLICAR. CRECER.</span>
        <svg className="startup-art" viewBox="0 0 240 240" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="startup-gradient" x1="72" y1="72" x2="170" y2="175">
              <stop stopColor="#b5dc6b" />
              <stop offset="1" stopColor="#64d3de" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="103" stroke="#ffffff0b" />
          <circle cx="120" cy="120" r="80" stroke="#ffffff0a" strokeDasharray="2 7" />
          <motion.g
            style={{ transformOrigin: '120px 120px' }}
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            {colors.map((color, i) => {
              const angle = ((i * 60 - 90) * Math.PI) / 180;
              const x = 120 + Math.cos(angle) * 103;
              const y = 120 + Math.sin(angle) * 103;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="10" fill={color} fillOpacity="0.07" />
                  <circle cx={x} cy={y} r="3" fill={color} />
                </g>
              );
            })}
          </motion.g>
          <rect
            x="74"
            y="74"
            width="92"
            height="92"
            rx="27"
            fill="#152026"
            stroke="url(#startup-gradient)"
            strokeOpacity="0.35"
          />
          <motion.path
            d="m99 140 19-40h5l19 40m-34-15h25"
            stroke="url(#startup-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <path d="M115 58h10M120 53v10M115 182h10M120 177v10" stroke="#b5dc6b55" />
        </svg>
        <h1>
          Las ideas
          <br />
          <span>toman forma.</span>
        </h1>
        <p>Preparando tu espacio de aprendizaje</p>
        <div className="startup-activity" aria-hidden="true">
          <span />
        </div>
      </div>
      <div className="startup-signature" aria-hidden="true">
        <strong>ATICMA EMPRENDE</strong>
        <span>2026</span>
      </div>
    </motion.section>
  );
}
