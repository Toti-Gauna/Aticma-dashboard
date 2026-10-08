import { motion, useReducedMotion } from 'motion/react';

export function MotionGraphic() {
  const reduced = useReducedMotion();
  return (
    <div className="motion-graphic" aria-hidden="true">
      <svg viewBox="0 0 480 330" fill="none">
        <defs>
          <linearGradient
            id="orbit"
            x1="30"
            y1="0"
            x2="450"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#b5dc6b" />
            <stop offset=".5" stopColor="#64d3de" />
            <stop offset="1" stopColor="#a894ed" />
          </linearGradient>
          <radialGradient id="glow">
            <stop stopColor="#b5dc6b" stopOpacity=".15" />
            <stop offset="1" stopColor="#b5dc6b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="168" r="160" fill="url(#glow)" />
        {[0, 1, 2, 3].map((i) => (
          <motion.ellipse
            key={i}
            cx="260"
            cy="168"
            rx={130 + i * 15}
            ry={43 + i * 20}
            stroke="url(#orbit)"
            strokeOpacity={0.15 + i * 0.08}
            strokeWidth="1"
            initial={false}
            animate={reduced ? undefined : { rotate: [i * 32, i * 32 + 360] }}
            transition={{ duration: 65 + i * 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '260px 168px' }}
          />
        ))}
        <motion.path
          d="M117 206 191 163 256 185 332 110 406 143"
          stroke="url(#orbit)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8 }}
        />
        {[
          [117, 206],
          [191, 163],
          [256, 185],
          [332, 110],
          [406, 143],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <motion.circle
              cx={cx}
              cy={cy}
              r="15"
              fill="#b5dc6b"
              opacity={0.1}
              initial={false}
              animate={reduced ? undefined : { opacity: [0.03, 0.16, 0.03], r: [8, 22, 8] }}
              transition={{ duration: 4, delay: i * 0.6, repeat: Infinity }}
            />
            <circle cx={cx} cy={cy} r="4" fill={i > 2 ? '#64d3de' : '#b5dc6b'} />
          </g>
        ))}
        <g transform="translate(214 114)">
          <rect width="91" height="91" rx="24" fill="#131e22" stroke="#b5dc6b" strokeOpacity=".6" />
          <path
            d="m24 63 20-37h5l19 37M33 48h25"
            stroke="#b5dc6b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="72" cy="19" r="4" fill="#64d3de" />
        </g>
        <text x="302" y="255" fill="#829088" fontFamily="monospace" fontSize="10" letterSpacing="3">
          APRENDER → APLICAR
        </text>
      </svg>
      <div className="graphic-label">
        <span className="status-dot" />
        IDEAS EN MOVIMIENTO
      </div>
    </div>
  );
}
