import { useState } from 'react';
import {
  Target,
  MoreHorizontal,
  CalendarDays,
  Trash2,
  Check,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { type Action } from '../lib/model';
import { lessons, areas } from '../lib/program';
import { dateLabel, today } from '../lib/dates';
import { PageHeader, AddButton, Pill, Button, IconButton, Empty, Modal } from '../components/ui';
import { ActionForm } from '../components/ActionForm';

export default function Actions() {
  const { state, setState, focusId, navigate, notify } = useWorkspace();
  const [form, setForm] = useState(false),
    [editing, setEditing] = useState<Action>(),
    [remove, setRemove] = useState<Action>(),
    [filter, setFilter] = useState('Todas'),
    [view, setView] = useState('board'),
    [query, setQuery] = useState('');
  const focused = state.actions.find((a) => a.id === focusId);
  const actions = state.actions.filter(
    (a) =>
      (filter === 'Todas' || a.area === filter) &&
      `${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const statuses: Action['status'][] = ['Pendiente', 'En curso', 'Hecho'];
  const change = (id: string, status: Action['status']) => {
    setState((s) => ({
      ...s,
      actions: s.actions.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
    notify(`Acción: ${status.toLowerCase()}`);
  };
  return (
    <>
      <PageHeader
        eyebrow="PASAR A LA PRÁCTICA"
        title="Acciones para Handy"
        description="Convertí cada aprendizaje en un próximo paso concreto."
      >
        <AddButton
          onClick={() => {
            setEditing(undefined);
            setForm(true);
          }}
        >
          Nueva acción
        </AddButton>
      </PageHeader>
      <div className="filter-bar">
        <div className="filter-chips">
          {['Todas', ...areas].map((a) => (
            <button key={a} className={filter === a ? 'active' : ''} onClick={() => setFilter(a)}>
              {a}
            </button>
          ))}
        </div>
        <div className="view-switch">
          <IconButton
            label="Vista tablero"
            onClick={() => setView('board')}
            aria-pressed={view === 'board'}
          >
            <LayoutGrid size={17} />
          </IconButton>
          <IconButton
            label="Vista lista"
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
          >
            <List size={17} />
          </IconButton>
        </div>
      </div>
      <div className="board-info">
        <p>Las acciones iniciales son plantillas sugeridas. Adaptalas a tu trabajo.</p>
        <input
          className="compact-search"
          aria-label="Buscar acciones"
          placeholder="Buscar una acción…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={`action-board ${view === 'list' ? 'list-view' : ''}`}>
        {statuses.map((status) => (
          <section
            className="board-column"
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/action-id');
              if (state.actions.some((a) => a.id === id)) change(id, status);
            }}
          >
            <div className="column-heading">
              <span className={`column-dot status-${status.replace(' ', '-')}`} />
              <h2>{status}</h2>
              <span>{actions.filter((a) => a.status === status).length}</span>
            </div>
            <div className="board-cards">
              {actions
                .filter((a) => a.status === status)
                .map((a) => (
                  <article
                    key={a.id}
                    className="action-card"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/action-id', a.id)}
                  >
                    <div className="action-card-top">
                      <Pill
                        color={
                          a.priority === 'Alta'
                            ? '#e7b765'
                            : a.priority === 'Media'
                              ? '#64d3de'
                              : '#a1abb7'
                        }
                      >
                        {a.priority}
                      </Pill>
                      <IconButton
                        label={`Editar ${a.title}`}
                        onClick={() => {
                          setEditing(a);
                          setForm(true);
                        }}
                      >
                        <MoreHorizontal size={17} />
                      </IconButton>
                    </div>
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                    {a.lessonId && (
                      <button
                        className="lesson-link"
                        onClick={() => navigate('sessions', a.lessonId)}
                      >
                        ↗ {lessons.find((l) => l.id === a.lessonId)?.title || 'Sesión'}
                      </button>
                    )}
                    <div className="action-card-meta">
                      <span>{a.area}</span>
                      <span
                        className={
                          a.due && a.due < today() && a.status !== 'Hecho' ? 'overdue' : ''
                        }
                      >
                        <CalendarDays size={12} />
                        {a.due ? dateLabel(a.due) : 'Sin fecha'}
                      </span>
                    </div>
                    <div className="action-card-bottom">
                      <span className="owner-avatar" title={a.owner || 'Sin responsable'}>
                        {a.owner ? a.owner.slice(0, 2).toUpperCase() : '—'}
                      </span>
                      <label className="sr-only" htmlFor={`status-${a.id}`}>
                        Estado de {a.title}
                      </label>
                      <select
                        id={`status-${a.id}`}
                        value={a.status}
                        onChange={(e) => change(a.id, e.target.value as Action['status'])}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <IconButton label={`Eliminar ${a.title}`} onClick={() => setRemove(a)}>
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </article>
                ))}
              {!actions.some((a) => a.status === status) && (
                <div className="column-empty">
                  {status === 'Hecho' ? <Check size={22} /> : <Target size={22} />}
                  <p>
                    {status === 'Hecho'
                      ? 'Tus avances van a aparecer acá.'
                      : 'Soltá una acción acá o cambiá su estado.'}
                  </p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
      {actions.length === 0 && query && (
        <Empty
          icon={<Target />}
          title="No encontramos esa acción"
          text="Probá con otra palabra o cambiá el área."
        />
      )}
      {(form || focused) && (
        <ActionForm
          action={form ? editing : focused}
          onClose={() => {
            setForm(false);
            if (focused) navigate('actions');
          }}
        />
      )}
      <Modal open={!!remove} title="Eliminar esta acción" onClose={() => setRemove(undefined)}>
        <p className="modal-description">Se quitará “{remove?.title}” del tablero.</p>
        <div className="form-footer">
          <Button onClick={() => setRemove(undefined)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              setState((s) => ({ ...s, actions: s.actions.filter((a) => a.id !== remove?.id) }));
              setRemove(undefined);
              notify('Acción eliminada');
            }}
          >
            Eliminar acción
          </Button>
        </div>
      </Modal>
    </>
  );
}
