import { useState } from 'react';
import { FlaskConical, ArrowUpRight, Trash2, Pencil, BookOpen, Search } from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { type Study, uid, nowISO } from '../lib/model';
import { lessons } from '../lib/program';
import { PageHeader, AddButton, Button, Pill, Empty, Modal, IconButton } from '../components/ui';

function safeURL(value: string) {
  try {
    const u = new URL(value);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : '';
  } catch {
    return '';
  }
}
export default function Studies() {
  const { state, setState, focusId, navigate, notify } = useWorkspace();
  const [form, setForm] = useState(false),
    [draft, setDraft] = useState<Study>(),
    [detail, setDetail] = useState<Study>(),
    [remove, setRemove] = useState<Study>(),
    [filter, setFilter] = useState('Todos'),
    [query, setQuery] = useState('');
  const focused = state.studies.find((s) => s.id === focusId),
    current = detail || focused;
  const open = (study?: Study) => {
    setDraft(
      study || {
        id: uid(),
        title: '',
        kind: 'Experimento',
        hypothesis: '',
        method: '',
        evidence: '',
        conclusion: '',
        lessonId: '',
        status: 'Hipótesis',
        source: '',
        updatedAt: nowISO(),
      },
    );
    setForm(true);
    setDetail(undefined);
    if (focused) navigate('studies');
  };
  const update = (key: keyof Study, value: string) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  const studies = state.studies.filter(
    (s) =>
      (filter === 'Todos' || s.status === filter) &&
      `${s.title} ${s.hypothesis} ${s.evidence}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="OBSERVAR · PROBAR · APRENDER"
        title="Estudios y experiencias"
        description="Guardá el contexto, la evidencia y lo que cambia en Handy."
      >
        <AddButton onClick={() => open()}>Nuevo registro</AddButton>
      </PageHeader>
      <div className="filter-bar">
        <div className="filter-chips">
          {['Todos', 'Hipótesis', 'En estudio', 'Con evidencia'].map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f}
              <span>
                {f === 'Todos'
                  ? state.studies.length
                  : state.studies.filter((s) => s.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar estudios"
            placeholder="Buscar un aprendizaje…"
          />
        </div>
      </div>
      {!studies.length ? (
        <div className="panel">
          <Empty
            icon={<FlaskConical size={32} />}
            title={
              state.studies.length
                ? 'No encontramos ese registro'
                : 'Tu evidencia empieza con una buena pregunta'
            }
            text="Registrá una experiencia de la sesión, una investigación o un experimento. Separá lo que observaste de lo que interpretás."
            action={
              <Button variant="primary" onClick={() => open()}>
                Crear un registro
              </Button>
            }
          />
        </div>
      ) : (
        <div className="study-grid">
          {studies.map((s) => (
            <article className="study-card" key={s.id}>
              <div className="study-card-top">
                <Pill
                  color={
                    s.status === 'Con evidencia'
                      ? '#b5dc6b'
                      : s.status === 'En estudio'
                        ? '#64d3de'
                        : '#a894ed'
                  }
                >
                  {s.status}
                </Pill>
                <span>{s.kind}</span>
              </div>
              <button className="study-open" onClick={() => setDetail(s)}>
                <h2>{s.title}</h2>
                <p>{s.hypothesis || s.method || 'Un aprendizaje por desarrollar.'}</p>
              </button>
              <div className="study-card-bottom">
                <span>
                  <BookOpen size={14} />
                  {s.lessonId ? `Sesión ${s.lessonId}` : 'Handy'}
                </span>
                <IconButton label={`Abrir ${s.title}`} onClick={() => setDetail(s)}>
                  <ArrowUpRight size={18} />
                </IconButton>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="evidence-note">
        <FlaskConical size={19} />
        <p>
          “Con evidencia” indica que agregaste observaciones y un método. La calidad y la validez de
          la conclusión requieren tu revisión.
        </p>
      </div>
      <Modal
        open={!!current && !form}
        title={current?.title || 'Registro'}
        onClose={() => {
          setDetail(undefined);
          if (focused) navigate('studies');
        }}
        wide
      >
        {current && (
          <>
            <div className="study-detail-meta">
              <Pill>{current.kind}</Pill>
              <Pill>{current.status}</Pill>
              {current.lessonId && (
                <Button variant="ghost" onClick={() => navigate('sessions', current.lessonId)}>
                  Sesión {current.lessonId}
                  <ArrowUpRight size={15} />
                </Button>
              )}
            </div>
            {[
              { title: 'Hipótesis o idea inicial', value: current.hypothesis },
              { title: 'Método y contexto', value: current.method },
              { title: 'Evidencia y observaciones', value: current.evidence },
              { title: 'Conclusión y aplicación a Handy', value: current.conclusion },
            ].map((section) => (
              <div className="study-detail-section" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.value || 'Todavía no registrado.'}</p>
              </div>
            ))}
            {current.source && (
              <div className="study-detail-section">
                <h3>Fuente</h3>
                {safeURL(current.source) ? (
                  <a href={safeURL(current.source)} target="_blank" rel="noopener noreferrer">
                    Abrir fuente
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <p>{current.source}</p>
                )}
              </div>
            )}
            <div className="form-footer">
              <Button
                variant="danger"
                onClick={() => {
                  setRemove(current);
                  setDetail(undefined);
                  if (focused) navigate('studies');
                }}
              >
                <Trash2 size={15} />
                Eliminar
              </Button>
              <Button variant="primary" onClick={() => open(current)}>
                <Pencil size={15} />
                Editar registro
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={form}
        title={
          state.studies.some((s) => s.id === draft?.id)
            ? 'Editar registro'
            : 'Nuevo estudio o experiencia'
        }
        onClose={() => setForm(false)}
        wide
      >
        {draft && (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.title.trim()) return;
              if (
                draft.status === 'Con evidencia' &&
                (!draft.evidence.trim() || !draft.method.trim())
              ) {
                notify('Agregá el método y la evidencia antes de cambiar el estado.');
                return;
              }
              const value = { ...draft, title: draft.title.trim(), updatedAt: nowISO() };
              setState((s) => ({
                ...s,
                studies: s.studies.some((x) => x.id === draft.id)
                  ? s.studies.map((x) => (x.id === draft.id ? value : x))
                  : [value, ...s.studies],
              }));
              setForm(false);
              notify('Registro guardado en tu biblioteca');
            }}
          >
            <label>
              Título
              <input
                required
                maxLength={200}
                value={draft.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Ej. qué valora un especialista de su agenda"
              />
            </label>
            <div className="form-grid">
              <label>
                Tipo
                <select
                  aria-label="Tipo"
                  value={draft.kind}
                  onChange={(e) => update('kind', e.target.value)}
                >
                  {['Experimento', 'Experiencia', 'Investigación'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Estado
                <select
                  aria-label="Estado"
                  value={draft.status}
                  onChange={(e) => update('status', e.target.value)}
                >
                  {['Hipótesis', 'En estudio', 'Con evidencia'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Sesión
                <select
                  aria-label="Sesión"
                  value={draft.lessonId}
                  onChange={(e) => update('lessonId', e.target.value)}
                >
                  <option value="">Sin sesión</option>
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} · {l.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fuente o enlace
                <input
                  maxLength={2000}
                  value={draft.source}
                  onChange={(e) => update('source', e.target.value)}
                  placeholder="URL o referencia del material"
                />
              </label>
            </div>
            {[
              {
                key: 'hypothesis',
                title: 'Hipótesis o idea inicial',
                placeholder: '¿Qué creés que ocurre? ¿Qué querés comprobar?',
              },
              {
                key: 'method',
                title: 'Método y contexto',
                placeholder:
                  'Fecha, muestra, instrumento y criterio de éxito. Para una experiencia, contá qué pasó.',
              },
              {
                key: 'evidence',
                title: 'Evidencia y observaciones',
                placeholder:
                  'Qué observaste. Usá referencias anónimas para participantes y separá hechos de opiniones.',
              },
              {
                key: 'conclusion',
                title: 'Conclusión y aplicación a Handy',
                placeholder: 'Qué aprendiste, qué decisión cambia y qué falta investigar.',
              },
            ].map((field) => (
              <label key={field.key}>
                {field.title}
                <textarea
                  rows={3}
                  maxLength={50000}
                  required={
                    draft.status === 'Con evidencia' && ['method', 'evidence'].includes(field.key)
                  }
                  value={draft[field.key as 'hypothesis' | 'method' | 'evidence' | 'conclusion']}
                  onChange={(e) => update(field.key as keyof Study, e.target.value)}
                  placeholder={field.placeholder}
                />
              </label>
            ))}
            <div className="form-footer">
              <Button onClick={() => setForm(false)}>Cancelar</Button>
              <Button variant="primary" type="submit">
                Guardar registro
              </Button>
            </div>
          </form>
        )}
      </Modal>
      <Modal open={!!remove} title="Eliminar registro" onClose={() => setRemove(undefined)}>
        <p className="modal-description">Se quitará “{remove?.title}” de tu biblioteca.</p>
        <div className="form-footer">
          <Button onClick={() => setRemove(undefined)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              setState((s) => ({ ...s, studies: s.studies.filter((x) => x.id !== remove?.id) }));
              setRemove(undefined);
            }}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  );
}
