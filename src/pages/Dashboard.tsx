import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  SlidersHorizontal,
  Check,
  BookOpen,
  CalendarDays,
  Target,
  FileText,
  FlaskConical,
  ArrowUp,
  ArrowDown,
  Clock3,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useWorkspace } from '../lib/workspace';
import { lessons, allQuestions } from '../lib/program';
import { dateLabel, endTime, today } from '../lib/dates';
import { uid, nowISO, type Workspace } from '../lib/model';
import { Button, Panel, Pill, LinkButton, Modal, IconButton, Empty } from '../components/ui';
import { MotionGraphic } from '../components/MotionGraphic';
import { ActionForm } from '../components/ActionForm';

const widgetNames = {
  sessions: 'Recorrido de aprendizaje',
  actions: 'Acciones para Handy',
  notes: 'Tus notas',
  studies: 'Estudios y evidencia',
};
export default function Dashboard() {
  const { state, setState, navigate } = useWorkspace();
  const [customize, setCustomize] = useState(false),
    [actionForm, setActionForm] = useState(false);
  const next = lessons.find(
    (l) => new Date(`${l.date}T${l.time}:00-03:00`).getTime() + l.duration * 60000 > Date.now(),
  );
  const featured = next || lessons.at(-1)!;
  const answered = [...allQuestions, ...state.questions].filter((q) =>
    state.answers[q.id]?.trim(),
  ).length;
  const questionCount = allQuestions.length + state.questions.length;
  const pending = state.actions.filter((a) => a.status !== 'Hecho');
  const createNote = () => {
    const id = uid();
    setState((s) => ({
      ...s,
      notes: [
        {
          id,
          title: 'Nueva nota',
          body: '',
          lessonId: featured.id,
          pinned: false,
          shapes: [],
          updatedAt: nowISO(),
        },
        ...s.notes,
      ],
    }));
    navigate('notes', id);
  };
  const move = (id: Workspace['widgetOrder'][number], direction: number) =>
    setState((s) => {
      const order = [...s.widgetOrder],
        index = order.indexOf(id),
        other = index + direction;
      if (other < 0 || other >= order.length) return s;
      [order[index], order[other]] = [order[other], order[index]];
      return { ...s, widgetOrder: order };
    });
  return (
    <>
      <div className="dashboard-intro">
        <div>
          <div className="eyebrow">TU ESPACIO DE TRABAJO</div>
          <h1>
            Las ideas se convierten
            <br className="mobile-break" /> en <span>acciones.</span>
          </h1>
          <p>Aprendé en ATICMA. Construí en Handy.</p>
        </div>
        <Button onClick={() => setCustomize(true)}>
          <SlidersHorizontal size={15} />
          Personalizar
        </Button>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badges">
            <Pill color="#b5dc6b">
              <span className="status-dot" />
              ATICMA EMPRENDE 2026
            </Pill>
            <span className="muted">3.ª edición</span>
          </div>
          <h2>
            Un nuevo capítulo
            <br />
            para <em>Handy.</em>
          </h2>
          <p>
            Un lugar para conectar lo que aprendés
            <br className="desktop-only" /> con lo que vas a construir.
          </p>
          <div className="hero-actions">
            <Button variant="primary" onClick={() => navigate('sessions', featured.id)}>
              {next ? 'Preparar próxima sesión' : 'Revisar mis aprendizajes'}
              <ArrowUpRight size={17} />
            </Button>
            <button className="hero-text-btn" onClick={createNote}>
              Capturar una idea
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="hero-footer">
            <span>6 masterclasses</span>
            <span className="dot-divider">·</span>
            <span>Octubre — noviembre</span>
            <span className="dot-divider">·</span>
            <span>Mar del Plata</span>
          </div>
        </div>
        <MotionGraphic />
      </section>
      <div className="stats-grid">
        {[
          {
            label: 'SESIONES COMPLETADAS',
            value: `${state.completedLessons.length}`,
            total: '/ 6',
            sub: 'Tu recorrido, a tu ritmo',
            icon: <BookOpen size={18} />,
            color: '#b5dc6b',
          },
          {
            label: 'PREGUNTAS RESPONDIDAS',
            value: String(answered).padStart(2, '0'),
            total: `/ ${questionCount}`,
            sub: 'Reflexiones que toman forma',
            icon: <FileText size={18} />,
            color: '#64d3de',
          },
          {
            label: 'ACCIONES ABIERTAS',
            value: String(pending.length).padStart(2, '0'),
            total: '',
            sub: `${state.actions.filter((a) => a.status === 'Hecho').length} llevadas a la práctica`,
            icon: <Target size={18} />,
            color: '#e7b765',
          },
          {
            label: 'ESTUDIOS CON EVIDENCIA',
            value: String(
              state.studies.filter((s) => s.status === 'Con evidencia').length,
            ).padStart(2, '0'),
            total: '',
            sub: `${state.studies.length} estudios registrados`,
            icon: <FlaskConical size={18} />,
            color: '#a894ed',
          },
        ].map((stat, i) => (
          <motion.div
            className="stat-card"
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="stat-top">
              <span>{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="stat-value">
              {stat.value}
              <small>{stat.total}</small>
            </div>
            <p>{stat.sub}</p>
            <div className="stat-accent" style={{ background: stat.color }} />
          </motion.div>
        ))}
      </div>
      <div className="dashboard-grid">
        {state.widgetOrder
          .filter((w) => !state.hiddenWidgets.includes(w))
          .map((widget) => (
            <div key={widget} className={`dashboard-widget widget-${widget}`}>
              {widget === 'sessions' && (
                <Panel
                  title="Tu recorrido"
                  subtitle="Seis encuentros. Un proyecto que evoluciona."
                  action={
                    <LinkButton onClick={() => navigate('sessions')}>Ver sesiones</LinkButton>
                  }
                >
                  <div className="journey">
                    {lessons.map((l) => (
                      <button
                        className={`journey-item ${l.id === featured.id ? 'is-featured' : ''}`}
                        key={l.id}
                        onClick={() => navigate('sessions', l.id)}
                      >
                        <span
                          className="journey-number"
                          style={{ color: l.color, borderColor: `${l.color}40` }}
                        >
                          {state.completedLessons.includes(l.id) ? <Check size={16} /> : l.id}
                        </span>
                        <span className="journey-info">
                          <strong>{l.title}</strong>
                          <span>
                            {dateLabel(l.date)}
                            <span className="dot-divider">·</span>
                            {l.time} hs
                          </span>
                        </span>
                        {l.id === featured.id && next ? (
                          <Pill color={l.color}>{l.date === today() ? 'Hoy' : 'Próxima'}</Pill>
                        ) : (
                          <ArrowUpRight className="journey-arrow" size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </Panel>
              )}
              {widget === 'actions' && (
                <Panel
                  title="Del aprendizaje a la acción"
                  subtitle="Tu siguiente paso tiene un lugar."
                  action={<LinkButton onClick={() => navigate('actions')}>Ver tablero</LinkButton>}
                >
                  <div className="action-preview">
                    {pending.slice(0, 3).map((a) => (
                      <div className="action-preview-row" key={a.id}>
                        <button
                          className="check-box"
                          aria-label={`Completar ${a.title}`}
                          onClick={() =>
                            setState((s) => ({
                              ...s,
                              actions: s.actions.map((x) =>
                                x.id === a.id ? { ...x, status: 'Hecho' } : x,
                              ),
                            }))
                          }
                        >
                          <Check size={13} />
                        </button>
                        <button
                          className="action-preview-content"
                          onClick={() => navigate('actions', a.id)}
                        >
                          <strong>{a.title}</strong>
                          <span>
                            {a.area}
                            <span className="dot-divider">·</span>
                            {a.due ? dateLabel(a.due) : 'Sin fecha'}
                          </span>
                        </button>
                        <span
                          className={`priority-dot priority-${a.priority}`}
                          title={`Prioridad ${a.priority}`}
                        />
                      </div>
                    ))}
                    {pending.length === 0 && (
                      <Empty
                        icon={<Target />}
                        title="Todo al día"
                        text="Agregá tu próximo paso cuando aparezca una nueva idea."
                      />
                    )}
                  </div>
                  <Button className="full-width add-dashed" onClick={() => setActionForm(true)}>
                    + Agregar una acción
                  </Button>
                  <div className="insight">
                    <Sparkles size={17} />
                    <p>
                      Una idea gana valor cuando la probás.
                      <br />
                      <span>Elegí una acción pequeña para esta semana.</span>
                    </p>
                  </div>
                </Panel>
              )}
              {widget === 'notes' && (
                <Panel
                  title="Ideas que querés guardar"
                  subtitle="Escribí, conectá y dibujá."
                  action={<LinkButton onClick={() => navigate('notes')}>Abrir cuaderno</LinkButton>}
                >
                  {state.notes.length ? (
                    <div className="mini-notes">
                      {state.notes.slice(0, 3).map((n) => (
                        <button key={n.id} onClick={() => navigate('notes', n.id)}>
                          <FileText size={19} />
                          <strong>{n.title}</strong>
                          <p>
                            {n.body.slice(0, 100) || `${n.shapes.length} elementos en tu pizarra`}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="note-prompt">
                      <div className="note-doodle">
                        <svg viewBox="0 0 100 80" aria-hidden="true">
                          <path
                            d="m15 55 25-35 20 20 22-24M62 17l20-1-3 20M15 65h70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3>Tu próxima idea empieza acá.</h3>
                        <p>
                          Una frase, un esquema o ese detalle
                          <br />
                          que no querés olvidar.
                        </p>
                        <LinkButton onClick={createNote}>Crear mi primera nota</LinkButton>
                      </div>
                    </div>
                  )}
                </Panel>
              )}
              {widget === 'studies' && (
                <Panel
                  title="Construí con evidencia"
                  subtitle="De la hipótesis al aprendizaje."
                  action={<LinkButton onClick={() => navigate('studies')}>Explorar</LinkButton>}
                >
                  <div className="evidence-flow">
                    {['Hipótesis', 'Experimento', 'Evidencia'].map((step, i) => (
                      <div key={step}>
                        <span>{i + 1}</span>
                        <strong>{step}</strong>
                        {i < 2 && <ArrowRight size={14} />}
                      </div>
                    ))}
                  </div>
                  <p className="panel-description">
                    Registrá lo que probaste, cómo lo mediste y qué cambió en Handy.
                  </p>
                  <div className="panel-bottom">
                    <span className="tiny-label">
                      {state.studies.length} ESTUDIOS EN TU BIBLIOTECA
                    </span>
                    <Button variant="ghost" onClick={() => navigate('studies')}>
                      <ArrowUpRight size={17} />
                    </Button>
                  </div>
                </Panel>
              )}
            </div>
          ))}
      </div>
      <section className="next-strip">
        <div className="next-strip-icon">
          <CalendarDays size={21} />
        </div>
        <div>
          <span className="tiny-label">{next ? 'PRÓXIMO ENCUENTRO' : 'ÚLTIMA MASTERCLASS'}</span>
          <h3>{featured.title}</h3>
        </div>
        <div className="next-strip-detail">
          <Clock3 size={15} />
          {dateLabel(featured.date)} · {featured.time}–{endTime(featured.time, featured.duration)}
        </div>
        <div className="next-strip-detail">
          <MapPin size={15} />
          {featured.id === '05' ? 'Virtual' : 'Mar del Plata'}
        </div>
        <IconButton label="Abrir calendario" onClick={() => navigate('calendar')}>
          <ArrowUpRight size={20} />
        </IconButton>
      </section>
      <Modal open={customize} title="Hacé tuyo el dashboard" onClose={() => setCustomize(false)}>
        <p className="modal-description">Elegí qué querés ver y el orden de tus herramientas.</p>
        <div className="widget-options">
          {state.widgetOrder.map((w, i) => (
            <div key={w}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!state.hiddenWidgets.includes(w)}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      hiddenWidgets: e.target.checked
                        ? s.hiddenWidgets.filter((x) => x !== w)
                        : [...s.hiddenWidgets, w],
                    }))
                  }
                />
                {widgetNames[w]}
              </label>
              <IconButton
                label={`Subir ${widgetNames[w]}`}
                disabled={i === 0}
                onClick={() => move(w, -1)}
              >
                <ArrowUp size={16} />
              </IconButton>
              <IconButton
                label={`Bajar ${widgetNames[w]}`}
                disabled={i === 3}
                onClick={() => move(w, 1)}
              >
                <ArrowDown size={16} />
              </IconButton>
            </div>
          ))}
        </div>
        <div className="form-footer">
          <Button variant="primary" onClick={() => setCustomize(false)}>
            Listo
          </Button>
        </div>
      </Modal>
      {actionForm && <ActionForm onClose={() => setActionForm(false)} />}
    </>
  );
}
