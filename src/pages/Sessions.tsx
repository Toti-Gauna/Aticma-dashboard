import { useState } from 'react';
import {
  Check,
  Clock3,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  Plus,
  NotebookPen,
  CheckCircle2,
  MessageCircle,
  Download,
  Target,
  Copy,
} from 'lucide-react';
import { motion } from 'motion/react';
import { lessons } from '../lib/program';
import { useWorkspace } from '../lib/workspace';
import { uid, nowISO } from '../lib/model';
import { dateLabel, endTime } from '../lib/dates';
import { download, workspaceMarkdown } from '../lib/export';
import { Button, IconButton, Pill, PageHeader, Modal, Panel } from '../components/ui';
import { ActionForm } from '../components/ActionForm';

export default function Sessions() {
  const { state, setState, focusId, navigate, notify } = useWorkspace();
  const lesson = lessons.find((l) => l.id === focusId) || lessons[0];
  const [tab, setTab] = useState('Preguntas'),
    [audience, setAudience] = useState<'speaker' | 'reflection'>('speaker'),
    [customAudience, setCustomAudience] = useState<'speaker' | 'reflection'>('speaker'),
    [action, setAction] = useState(false),
    [question, setQuestion] = useState(false),
    [prompt, setPrompt] = useState(''),
    [actionSeed, setActionSeed] = useState({ title: '', description: '' });
  const customQuestions = state.questions.filter((q) => q.lessonId === lesson.id);
  const speakerQuestions = [
    ...lesson.speakerQuestions,
    ...customQuestions
      .filter((q) => q.audience === 'speaker')
      .map((q) => ({ ...q, hint: 'Tu pregunta para hacer durante el encuentro.' })),
  ];
  const reflectionQuestions = [
    ...lesson.questions,
    ...customQuestions
      .filter((q) => q.audience !== 'speaker')
      .map((q) => ({ ...q, hint: 'Tu pregunta para reflexionar sobre esta sesión.' })),
  ];
  const questions = audience === 'speaker' ? speakerQuestions : reflectionQuestions;
  const allQuestions = [...speakerQuestions, ...reflectionQuestions];
  const answeredCount = (qs: typeof questions) =>
    qs.filter((q) => state.answers[q.id]?.trim()).length;
  const answered = answeredCount(allQuestions);
  const complete = state.completedLessons.includes(lesson.id);
  const createNote = () => {
    const id = uid();
    setState((s) => ({
      ...s,
      notes: [
        {
          id,
          title: `Notas · ${lesson.title}`,
          body: '',
          lessonId: lesson.id,
          updatedAt: nowISO(),
          pinned: false,
          shapes: [],
        },
        ...s.notes,
      ],
    }));
    navigate('notes', id);
  };
  return (
    <>
      <PageHeader
        eyebrow="APRENDER PARA CONSTRUIR"
        title="Tus masterclasses"
        description="Cada encuentro, una nueva perspectiva para tu proyecto."
      >
        <Button onClick={() => download(workspaceMarkdown(state), 'aticma-cuaderno.md')}>
          <Download size={16} />
          Exportar cuaderno
        </Button>
      </PageHeader>
      <div className="sessions-layout">
        <aside className="session-list" aria-label="Elegir masterclass">
          {lessons.map((l) => (
            <button
              className={`session-nav ${l.id === lesson.id ? 'active' : ''}`}
              key={l.id}
              onClick={() => navigate('sessions', l.id)}
              style={{ '--session-color': l.color } as React.CSSProperties}
            >
              <div>
                <span className="session-nav-number">{l.id}</span>
                {state.completedLessons.includes(l.id) && <CheckCircle2 size={15} />}
              </div>
              <h3>{l.title}</h3>
              <span>
                {dateLabel(l.date)} · {l.time} hs
              </span>
              <div className="session-nav-line" />
            </button>
          ))}
          <div className="session-list-footer">
            <span>{state.completedLessons.length} de 6 completadas</span>
            <div className="progress-track">
              <div style={{ width: `${(state.completedLessons.length / 6) * 100}%` }} />
            </div>
          </div>
        </aside>
        <motion.section
          className="session-detail"
          key={lesson.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="session-cover"
            style={{ '--session-color': lesson.color } as React.CSSProperties}
          >
            <div className="session-cover-top">
              <Pill color={lesson.color}>MASTERCLASS {lesson.id}</Pill>
              <Button
                variant={complete ? 'secondary' : 'ghost'}
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    completedLessons: complete
                      ? s.completedLessons.filter((id) => id !== lesson.id)
                      : [...s.completedLessons, lesson.id],
                  }));
                  notify(complete ? 'Sesión marcada como pendiente' : 'Sesión completada');
                }}
              >
                <Check size={15} />
                {complete ? 'Completada' : 'Marcar completada'}
              </Button>
            </div>
            <div className="session-title-row">
              <div>
                <span className="eyebrow">{lesson.theme}</span>
                <h2>{lesson.title}</h2>
              </div>
              <span className="session-big-number">{lesson.id}</span>
            </div>
            <div className="session-meta">
              <span>
                <CalendarDays size={15} />
                {dateLabel(lesson.date, { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span>
                <Clock3 size={15} />
                {lesson.time}–{endTime(lesson.time, lesson.duration)} hs
              </span>
              <span>
                <MapPin size={15} />
                {lesson.location}
              </span>
            </div>
          </div>
          <div className="speaker-row">
            <div className="speaker-avatar" style={{ color: lesson.color }}>
              {lesson.speaker
                .split(' ')
                .map((x) => x[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="tiny-label">A CARGO DE</div>
              <strong>{lesson.speaker}</strong>
              <p>{lesson.role}</p>
            </div>
          </div>
          <div className="session-objective">
            <Target size={20} />
            <div>
              <h3>Lo que te llevás del encuentro</h3>
              <p>{lesson.objective}</p>
              <span>{lesson.deliverable}</span>
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Contenido de la sesión">
            {['Preguntas', 'Notas', 'Acciones'].map((t) => (
              <button
                role="tab"
                aria-selected={tab === t}
                className={tab === t ? 'active' : ''}
                key={t}
                onClick={() => setTab(t)}
              >
                {t === 'Preguntas' ? (
                  <MessageCircle size={16} />
                ) : t === 'Notas' ? (
                  <NotebookPen size={16} />
                ) : (
                  <Target size={16} />
                )}{' '}
                {t}
                {t === 'Preguntas' && (
                  <span>
                    {answered}/{allQuestions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          {tab === 'Preguntas' && (
            <div className="question-list" role="tabpanel">
              <div className="question-groups" role="group" aria-label="Tipo de preguntas">
                <button
                  className={audience === 'speaker' ? 'active' : ''}
                  aria-pressed={audience === 'speaker'}
                  onClick={() => setAudience('speaker')}
                >
                  <MessageCircle size={15} />
                  Para el speaker
                  <span>
                    {answeredCount(speakerQuestions)}/{speakerQuestions.length}
                  </span>
                </button>
                <button
                  className={audience === 'reflection' ? 'active' : ''}
                  aria-pressed={audience === 'reflection'}
                  onClick={() => setAudience('reflection')}
                >
                  <NotebookPen size={15} />
                  Para reflexionar
                  <span>
                    {answeredCount(reflectionQuestions)}/{reflectionQuestions.length}
                  </span>
                </button>
              </div>
              <div className="question-intro">
                <p>
                  {audience === 'speaker'
                    ? 'Casos hipotéticos para consultar, sin nombres ni detalles del proyecto. Anotá la respuesta del speaker debajo.'
                    : 'Conectá lo aprendido con tus decisiones. Tus respuestas anteriores siguen acá.'}
                </p>
                <span>Guardado automático</span>
              </div>
              {questions.map((q, i) => (
                <article className="question" key={q.id} aria-labelledby={`question-${q.id}`}>
                  <div className="question-title">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <h3 id={`question-${q.id}`}>{q.prompt}</h3>
                    {state.answers[q.id]?.trim() && <Check size={16} className="lime" />}
                    <IconButton
                      label={`Copiar pregunta: ${q.prompt}`}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(q.prompt);
                          notify('Pregunta copiada');
                        } catch {
                          notify('No se pudo copiar. Podés seleccionar el texto de la pregunta.');
                        }
                      }}
                    >
                      <Copy size={14} />
                    </IconButton>
                  </div>
                  <p>{q.hint}</p>
                  <label className="sr-only" htmlFor={`answer-${q.id}`}>
                    Respuesta a {q.prompt}
                  </label>
                  <textarea
                    id={`answer-${q.id}`}
                    value={state.answers[q.id] || ''}
                    maxLength={50000}
                    onChange={(e) =>
                      setState((s) => ({ ...s, answers: { ...s.answers, [q.id]: e.target.value } }))
                    }
                    rows={3}
                    placeholder={
                      audience === 'speaker'
                        ? 'La respuesta del speaker, sus ejemplos y lo que querés repreguntar…'
                        : 'Tu reflexión, lo que aprendiste y la decisión que querés tomar…'
                    }
                  />
                  <div className="question-footer">
                    <span>{state.answers[q.id]?.length || 0} caracteres</span>
                    <button
                      onClick={() => {
                        setActionSeed({
                          title: q.prompt,
                          description: state.answers[q.id] || q.hint,
                        });
                        setAction(true);
                      }}
                    >
                      Convertir en acción
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </article>
              ))}
              <Button
                className="full-width add-dashed"
                onClick={() => {
                  setCustomAudience(audience);
                  setQuestion(true);
                }}
              >
                <Plus size={16} />
                Agregar mi propia pregunta
              </Button>
            </div>
          )}
          {tab === 'Notas' && (
            <div className="session-related" role="tabpanel">
              {state.notes
                .filter((n) => n.lessonId === lesson.id)
                .map((n) => (
                  <button
                    className="related-card"
                    key={n.id}
                    onClick={() => navigate('notes', n.id)}
                  >
                    <NotebookPen size={20} />
                    <div>
                      <strong>{n.title}</strong>
                      <p>{n.body.slice(0, 150) || 'Nota con pizarra'}</p>
                    </div>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
              <Button onClick={createNote}>
                <Plus size={16} />
                Crear nota de esta sesión
              </Button>
            </div>
          )}
          {tab === 'Acciones' && (
            <div className="session-related" role="tabpanel">
              {state.actions
                .filter((a) => a.lessonId === lesson.id)
                .map((a) => (
                  <div className="related-card" key={a.id}>
                    <Target size={20} />
                    <div>
                      <strong>{a.title}</strong>
                      <p>
                        {a.area} · {a.due ? dateLabel(a.due) : 'Sin fecha'}
                      </p>
                    </div>
                    <Pill>{a.status}</Pill>
                  </div>
                ))}
              <Button onClick={() => setAction(true)}>
                <Plus size={16} />
                Crear acción de esta sesión
              </Button>
            </div>
          )}
        </motion.section>
      </div>
      <Panel title="El aprendizaje no termina en el encuentro" className="session-end">
        <p className="muted">
          Registrá una reflexión, diseñá un experimento y volvé a revisar tu respuesta cuando tengas
          evidencia.
        </p>
      </Panel>
      {action && (
        <ActionForm
          lessonId={lesson.id}
          initialTitle={actionSeed.title}
          initialDescription={actionSeed.description}
          onClose={() => {
            setAction(false);
            setActionSeed({ title: '', description: '' });
          }}
        />
      )}
      <Modal
        open={question}
        title="Tu pregunta para esta sesión"
        onClose={() => setQuestion(false)}
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!prompt.trim()) return;
            setState((s) => ({
              ...s,
              questions: [
                ...s.questions,
                {
                  id: uid(),
                  lessonId: lesson.id,
                  prompt: prompt.trim(),
                  audience: customAudience,
                },
              ],
            }));
            setPrompt('');
            setAudience(customAudience);
            setQuestion(false);
          }}
        >
          <label>
            Tipo de pregunta
            <select
              aria-label="Tipo de pregunta"
              value={customAudience}
              onChange={(e) => setCustomAudience(e.target.value as 'speaker' | 'reflection')}
            >
              <option value="speaker">Para el speaker</option>
              <option value="reflection">Para reflexionar</option>
            </select>
          </label>
          <label>
            Pregunta
            <textarea
              required
              maxLength={500}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="¿Qué necesitás entender mejor?"
            />
          </label>
          <div className="form-footer">
            <Button variant="primary" type="submit">
              Agregar pregunta
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
