import { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock3,
  MapPin,
  ArrowUpRight,
  Trash2,
  Pencil,
} from 'lucide-react';
import { lessons, milestones } from '../lib/program';
import { useWorkspace } from '../lib/workspace';
import { type CalendarEvent, uid } from '../lib/model';
import { dateLabel, endTime, monthCells, today } from '../lib/dates';
import { calendarICS, download } from '../lib/export';
import { PageHeader, Button, AddButton, IconButton, Modal, Pill, Empty } from '../components/ui';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  color: string;
  kind: string;
};
export default function Calendar() {
  const { state, setState, navigate, notify } = useWorkspace();
  const [month, setMonth] = useState(() => {
    const day = today();
    return day.slice(0, 4) === '2026' && day >= '2026-10-01' && day <= '2026-11-30'
      ? new Date(`${day}T12:00:00Z`)
      : new Date('2026-10-01T12:00:00Z');
  });
  const [selected, setSelected] = useState(today()),
    [form, setForm] = useState(false),
    [draft, setDraft] = useState<CalendarEvent>({
      id: uid(),
      title: '',
      date: today(),
      time: '18:00',
      duration: 60,
      location: '',
    }),
    [remove, setRemove] = useState<string>();
  const events: Event[] = [
    ...lessons.map((l) => ({ ...l, kind: 'Masterclass' })),
    ...milestones.map((m) => ({ ...m, kind: 'Hito' })),
    ...state.events.map((e) => ({ ...e, color: '#b5dc6b', kind: 'Personal' })),
    ...state.actions
      .filter((a) => a.due && a.status !== 'Hecho')
      .map((a) => ({
        id: a.id,
        title: a.title,
        date: a.due,
        time: '',
        duration: 0,
        location: a.area,
        color: '#e7b765',
        kind: 'Acción',
      })),
  ].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const year = month.getUTCFullYear(),
    index = month.getUTCMonth();
  const visibleEvents = events.filter((e) =>
    e.date.startsWith(`${year}-${String(index + 1).padStart(2, '0')}`),
  );
  const selectedEvents = events.filter((e) => e.date === selected);
  const shift = (n: number) => setMonth(new Date(Date.UTC(year, index + n, 1, 12)));
  const openForm = (event?: CalendarEvent) => {
    setDraft(
      event || { id: uid(), title: '', date: selected, time: '18:00', duration: 60, location: '' },
    );
    setForm(true);
  };
  const update = (key: keyof CalendarEvent, value: string | number) =>
    setDraft((d) => ({ ...d, [key]: value }));
  return (
    <>
      <PageHeader
        eyebrow="UN LUGAR PARA CADA ENCUENTRO"
        title="Tu calendario"
        description="Sesiones, hitos y tiempo para llevar las ideas a la práctica."
      >
        <Button
          onClick={() =>
            download(
              calendarICS(state.events, new Date(), state.actions),
              'aticma-2026.ics',
              'text/calendar;charset=utf-8',
            )
          }
        >
          <Download size={16} />
          Exportar .ics
        </Button>
        <AddButton onClick={() => openForm()}>Agregar evento</AddButton>
      </PageHeader>
      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-heading">
            <div>
              <span className="eyebrow">AGENDA 2026</span>
              <h2>
                {new Intl.DateTimeFormat('es-AR', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(month)}
              </h2>
            </div>
            <div>
              <Button
                variant="ghost"
                onClick={() => {
                  const now = today();
                  setMonth(new Date(`${now}T12:00:00Z`));
                  setSelected(now);
                }}
              >
                Hoy
              </Button>
              <IconButton label="Mes anterior" onClick={() => shift(-1)}>
                <ChevronLeft size={19} />
              </IconButton>
              <IconButton label="Mes siguiente" onClick={() => shift(1)}>
                <ChevronRight size={19} />
              </IconButton>
            </div>
          </div>
          <div className="calendar-weekdays">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {monthCells(year, index).map((day) => (
              <button
                key={day.date}
                className={`calendar-cell ${!day.current ? 'outside' : ''} ${day.date === selected ? 'selected' : ''} ${day.date === today() ? 'today' : ''}`}
                aria-label={`${dateLabel(day.date, { day: 'numeric', month: 'long', year: 'numeric' })}, ${events.filter((e) => e.date === day.date).length} eventos`}
                aria-pressed={day.date === selected}
                onClick={() => setSelected(day.date)}
              >
                <span className="day-number">{day.day}</span>
                <div className="cell-events">
                  {events
                    .filter((e) => e.date === day.date)
                    .slice(0, 3)
                    .map((e) => (
                      <span key={e.id} style={{ background: `${e.color}15`, color: e.color }}>
                        <i style={{ background: e.color }} />
                        {e.title}
                      </span>
                    ))}
                </div>
              </button>
            ))}
          </div>
          <div className="calendar-legend">
            <span>
              <i style={{ background: '#64d3de' }} />
              Masterclasses
            </span>
            <span>
              <i style={{ background: '#a894ed' }} />
              Hitos
            </span>
            <span>
              <i style={{ background: '#b5dc6b' }} />
              Personal
            </span>
            <span>
              <i style={{ background: '#e7b765' }} />
              Acciones
            </span>
            <small>Horario de Argentina · UTC−3</small>
          </div>
        </section>
        <aside className="calendar-sidebar">
          <div className="calendar-day-summary">
            <div className="eyebrow">TU DÍA</div>
            <h2>{dateLabel(selected, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            {selectedEvents.length ? (
              selectedEvents.map((e) => (
                <div className="day-event" key={e.id}>
                  <Pill color={e.color}>{e.kind}</Pill>
                  <h3>{e.title}</h3>
                  <p>
                    <Clock3 size={14} />
                    {e.time
                      ? `${e.time}–${endTime(e.time, e.duration)} hs`
                      : e.kind === 'Acción'
                        ? 'Fecha límite'
                        : 'Horario por confirmar'}
                  </p>
                  <p>
                    <MapPin size={14} />
                    {e.location || 'Sin lugar definido'}
                  </p>
                  {e.kind === 'Masterclass' && (
                    <Button className="full-width" onClick={() => navigate('sessions', e.id)}>
                      Preparar sesión
                      <ArrowUpRight size={15} />
                    </Button>
                  )}
                  {e.kind === 'Acción' && (
                    <Button className="full-width" onClick={() => navigate('actions', e.id)}>
                      Ver acción
                      <ArrowUpRight size={15} />
                    </Button>
                  )}
                  {e.kind === 'Personal' && (
                    <div className="row">
                      <IconButton
                        label={`Editar ${e.title}`}
                        onClick={() => openForm(state.events.find((x) => x.id === e.id))}
                      >
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton label={`Eliminar ${e.title}`} onClick={() => setRemove(e.id)}>
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <Empty
                icon={<CalendarDays size={26} />}
                title="Espacio para construir"
                text="Reservá un momento para estudiar, investigar o aplicar lo aprendido."
                action={<Button onClick={() => openForm()}>Reservar un bloque</Button>}
              />
            )}
          </div>
          <div className="calendar-tip">
            <span className="eyebrow">EL PROGRAMA</span>
            <p>
              Las primeras cuatro masterclasses son presenciales. Finanzas es virtual y Pitch
              incluye la hamburguesada.
            </p>
            <span>Fuente: calendario ATICMA compartido.</span>
          </div>
        </aside>
      </div>
      <section className="panel agenda-list">
        <div className="panel-heading">
          <h2>Encuentros del mes</h2>
          <span className="muted">{visibleEvents.length} en agenda</span>
        </div>
        {visibleEvents.map((e) => (
          <div className="agenda-row" key={e.id}>
            <div className="agenda-date">
              <strong>{dateLabel(e.date, { day: '2-digit' })}</strong>
              <span>{dateLabel(e.date, { weekday: 'short' })}</span>
            </div>
            <span className="agenda-line" style={{ background: e.color }} />
            <div>
              <h3>{e.title}</h3>
              <p>{e.location}</p>
            </div>
            <span className="agenda-time">
              {e.time ? `${e.time} hs` : e.kind === 'Acción' ? 'Fecha límite' : 'A confirmar'}
            </span>
            <IconButton
              label={`Ver ${e.title}`}
              onClick={() => {
                setSelected(e.date);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <ArrowUpRight size={18} />
            </IconButton>
          </div>
        ))}
        {!visibleEvents.length && (
          <p className="muted">Todavía no agregaste eventos en este mes.</p>
        )}
      </section>
      <Modal
        open={form}
        title={state.events.some((e) => e.id === draft.id) ? 'Editar evento' : 'Agregar un evento'}
        onClose={() => setForm(false)}
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim()) return;
            setState((s) => ({
              ...s,
              events: s.events.some((x) => x.id === draft.id)
                ? s.events.map((x) =>
                    x.id === draft.id ? { ...draft, title: draft.title.trim() } : x,
                  )
                : [...s.events, { ...draft, title: draft.title.trim() }],
            }));
            setSelected(draft.date);
            setMonth(new Date(`${draft.date}T12:00:00Z`));
            setForm(false);
            notify('Evento guardado');
          }}
        >
          <label>
            Título
            <input
              required
              maxLength={200}
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Ej. revisar el modelo con el equipo"
            />
          </label>
          <div className="form-grid">
            <label>
              Fecha
              <input
                required
                type="date"
                value={draft.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </label>
            <label>
              Hora de Argentina
              <input
                required
                type="time"
                value={draft.time}
                onChange={(e) => update('time', e.target.value)}
              />
            </label>
            <label>
              Duración en minutos
              <input
                required
                type="number"
                min={15}
                max={1440}
                value={draft.duration}
                onChange={(e) => update('duration', Number(e.target.value))}
              />
            </label>
            <label>
              Lugar o enlace
              <input
                maxLength={300}
                value={draft.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Presencial o virtual"
              />
            </label>
          </div>
          <div className="form-footer">
            <Button onClick={() => setForm(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">
              Guardar evento
            </Button>
          </div>
        </form>
      </Modal>
      <Modal open={!!remove} title="Eliminar evento" onClose={() => setRemove(undefined)}>
        <p className="modal-description">Se quitará este evento personal de tu calendario.</p>
        <div className="form-footer">
          <Button onClick={() => setRemove(undefined)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== remove) }));
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
