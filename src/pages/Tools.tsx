import { useEffect, useRef, useState } from 'react';
import {
  LayoutTemplate,
  Calculator,
  Mic2,
  Play,
  Pause,
  RotateCcw,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { canvasFields } from '../lib/program';
import { download } from '../lib/export';
import { PageHeader, Button, Pill, Panel } from '../components/ui';

export function economics(
  ticket: number,
  rate: number,
  paymentRate: number,
  variable: number,
  fixed: number,
  absorbs: boolean,
) {
  const revenue = (ticket * rate) / 100,
    payment = absorbs ? (ticket * paymentRate) / 100 : 0,
    contribution = revenue - payment - variable;
  return {
    revenue,
    payment,
    contribution,
    breakEven: contribution > 0 ? Math.ceil(fixed / contribution) : null,
  };
}
export default function Tools() {
  const { state, setState, navigate } = useWorkspace();
  const [tab, setTab] = useState('Canvas de negocio');
  const write = (key: string, value: string) =>
    setState((s) => ({ ...s, canvas: { ...s.canvas, [key]: value } }));
  const num = (key: string, fallback: number) => Number(state.canvas[key] ?? fallback);
  const ticket = num('econ-ticket', 10000),
    rate = num('econ-rate', 15),
    paymentRate = num('econ-payment', 5),
    variable = num('econ-variable', 200),
    fixed = num('econ-fixed', 50000),
    absorbs = (state.canvas['econ-absorbs'] ?? 'sí') === 'sí';
  const result = economics(ticket, rate, paymentRate, variable, fixed, absorbs);
  const currency = (v: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(v);
  const [duration, setDuration] = useState(180),
    [remaining, setRemaining] = useState(180),
    [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setRunning(false);
    };
    const t = setInterval(tick, 200);
    return () => clearInterval(t);
  }, [running]);
  const toggle = () => {
    if (running) {
      setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
      setRunning(false);
    } else {
      const value = remaining || duration;
      setRemaining(value);
      deadline.current = Date.now() + value * 1000;
      setRunning(true);
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="TU CAJA DE HERRAMIENTAS"
        title="Pensar mejor. Construir mejor."
        description="Herramientas simples para convertir las sesiones en decisiones."
      />
      <div className="tool-tabs">
        {[
          { name: 'Canvas de negocio', icon: <LayoutTemplate size={19} />, session: 'Sesión 02' },
          {
            name: 'Economía unitaria',
            icon: <Calculator size={19} />,
            session: 'Sesiones 02 y 05',
          },
          { name: 'Ensayo de pitch', icon: <Mic2 size={19} />, session: 'Sesión 06' },
        ].map((t) => (
          <button
            className={tab === t.name ? 'active' : ''}
            onClick={() => setTab(t.name)}
            key={t.name}
          >
            {t.icon}
            <div>
              <strong>{t.name}</strong>
              <span>{t.session}</span>
            </div>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      {tab === 'Canvas de negocio' && (
        <>
          <div className="tool-section-heading">
            <div>
              <h2>El modelo, en una sola página.</h2>
              <p>Completá ambos lados del marketplace. Volvé a este canvas con cada aprendizaje.</p>
            </div>
            <Button
              onClick={() =>
                download(
                  `# Canvas de negocio · Handy\n\n${canvasFields.map((f) => `## ${f}\n${state.canvas[f] || 'Por desarrollar'}`).join('\n\n')}`,
                  'handy-canvas.md',
                )
              }
            >
              <Download size={15} />
              Exportar canvas
            </Button>
          </div>
          <div className="business-canvas">
            {canvasFields.map((field, i) => (
              <label key={field} className={`canvas-field canvas-${i}`}>
                <span>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  {field}
                </span>
                <textarea
                  aria-label={field}
                  maxLength={50000}
                  value={state.canvas[field] || ''}
                  onChange={(e) => write(field, e.target.value)}
                  placeholder="Ideas, supuestos y evidencias…"
                />
              </label>
            ))}
          </div>
          <div className="evidence-note">
            <LayoutTemplate size={18} />
            <p>
              Una herramienta para explorar el modelo. Las decisiones aprobadas siguen viviendo en
              el sistema de Handy.
            </p>
          </div>
        </>
      )}
      {tab === 'Economía unitaria' && (
        <div className="economics-layout">
          <Panel
            title="Probá tus escenarios"
            subtitle="Valores de ejemplo editables en pesos argentinos."
          >
            <Pill color="#e7b765">SIMULACIÓN · SUPUESTOS</Pill>
            <div className="form economics-form">
              {[
                {
                  key: 'econ-ticket',
                  label: 'Importe de referencia del trabajo',
                  value: ticket,
                  max: 100000000,
                },
                {
                  key: 'econ-rate',
                  label: 'Ingreso total de la plataforma (%)',
                  value: rate,
                  max: 100,
                },
                {
                  key: 'econ-payment',
                  label: 'Costo de la pasarela (%) sobre el importe',
                  value: paymentRate,
                  max: 100,
                },
                {
                  key: 'econ-variable',
                  label: 'Otros costos variables por trabajo',
                  value: variable,
                  max: 100000000,
                },
                {
                  key: 'econ-fixed',
                  label: 'Costos fijos del período',
                  value: fixed,
                  max: 100000000,
                },
              ].map((f) => (
                <label key={f.key}>
                  {f.label}
                  <input
                    required
                    type="number"
                    min={0}
                    max={f.max}
                    step="any"
                    value={f.value}
                    onChange={(e) =>
                      write(f.key, String(Math.max(0, Math.min(f.max, Number(e.target.value)))))
                    }
                  />
                </label>
              ))}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={absorbs}
                  onChange={(e) => write('econ-absorbs', e.target.checked ? 'sí' : 'no')}
                />
                La plataforma absorbe el costo de la pasarela
              </label>
            </div>
          </Panel>
          <div>
            <Panel title="La cuenta, a la vista" subtitle="Por cada trabajo del escenario.">
              <div className="economics-result">
                <div>
                  <span>Ingreso de la plataforma</span>
                  <strong>{currency(result.revenue)}</strong>
                </div>
                <div>
                  <span>− Costo de pasarela absorbido</span>
                  <strong>{currency(result.payment)}</strong>
                </div>
                <div>
                  <span>− Otros costos variables</span>
                  <strong>{currency(variable)}</strong>
                </div>
                <div className={result.contribution > 0 ? 'contribution' : 'contribution negative'}>
                  <span>Margen de contribución</span>
                  <strong>{currency(result.contribution)}</strong>
                </div>
              </div>
              <div className="breakeven">
                <span className="eyebrow">PUNTO DE EQUILIBRIO DEL PERÍODO</span>
                <strong>
                  {result.breakEven === null ? 'Sin equilibrio' : `${result.breakEven} trabajos`}
                </strong>
                <p>
                  {result.breakEven === null
                    ? 'El margen es cero o negativo. Revisá el escenario antes de proyectar volumen.'
                    : 'Costos fijos ÷ margen por trabajo, redondeado hacia arriba.'}
                </p>
              </div>
            </Panel>
            <div className="calculator-note">
              <h3>Revisá qué incluye cada número.</h3>
              <p>
                El importe total del trabajo no es el ingreso de Handy. Este cálculo simplifica la
                economía: no incluye impuestos, reembolsos ni distintos plazos de acreditación.
                Agregalos a tus costos cuando corresponda.
              </p>
              <Button variant="ghost" onClick={() => navigate('sessions', '05')}>
                Llevar preguntas a Finanzas
                <ArrowUpRight size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}
      {tab === 'Ensayo de pitch' && (
        <div className="pitch-layout">
          <Panel title="Tu próximo ensayo" subtitle="Una historia clara, en el tiempo justo.">
            <div className="pitch-duration">
              {[60, 180, 300].map((v) => (
                <button
                  key={v}
                  className={duration === v ? 'active' : ''}
                  disabled={running}
                  onClick={() => {
                    setDuration(v);
                    setRemaining(v);
                  }}
                >
                  {v / 60} min
                </button>
              ))}
            </div>
            <div
              className={`pitch-clock ${remaining === 0 ? 'finished' : ''}`}
              role="timer"
              aria-label="Tiempo restante"
            >
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="100" cy="100" r="89" fill="none" stroke="#222c35" strokeWidth="3" />
                <circle
                  cx="100"
                  cy="100"
                  r="89"
                  fill="none"
                  stroke={remaining === 0 ? '#e7b765' : '#b5dc6b'}
                  strokeWidth="3"
                  strokeDasharray="559.2"
                  strokeDashoffset={559.2 * (1 - remaining / duration)}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <strong>
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </strong>
              <span>
                {remaining === 0
                  ? 'TIEMPO CUMPLIDO'
                  : running
                    ? 'TU IDEA TIENE VOZ'
                    : 'LISTO PARA ENSAYAR'}
              </span>
            </div>
            <div className="pitch-controls">
              <Button variant="primary" onClick={toggle}>
                {running ? <Pause size={17} /> : <Play size={17} />}{' '}
                {running ? 'Pausar' : 'Empezar'}
              </Button>
              <Button
                onClick={() => {
                  setRunning(false);
                  setRemaining(duration);
                }}
              >
                <RotateCcw size={16} />
                Reiniciar
              </Button>
            </div>
            <p className="muted pitch-note">
              Ensayá en voz alta. El cronómetro continúa aunque cambies de pestaña del navegador.
            </p>
          </Panel>
          <Panel
            title="La estructura de tu historia"
            subtitle="Cinco momentos para que Handy se entienda."
          >
            {[
              'El problema y quién lo vive',
              'La solución y el diferencial',
              'La evidencia que tenemos hoy',
              'El modelo y el próximo hito',
              'La solicitud concreta',
            ].map((s, i) => (
              <label className="pitch-field" key={s}>
                <span>
                  <i>{i + 1}</i>
                  {s}
                </span>
                <textarea
                  rows={2}
                  maxLength={50000}
                  value={state.canvas[`pitch-${i}`] || ''}
                  onChange={(e) => write(`pitch-${i}`, e.target.value)}
                  placeholder="Tu frase clave…"
                />
              </label>
            ))}
            <Button
              className="full-width"
              onClick={() =>
                download(
                  `# Pitch de Handy\n\n${Array.from({ length: 5 }, (_, i) => state.canvas[`pitch-${i}`] || 'Por desarrollar').join('\n\n')}`,
                  'handy-pitch.md',
                )
              }
            >
              <Download size={16} />
              Exportar guion
            </Button>
          </Panel>
        </div>
      )}
    </>
  );
}
