import { useState } from 'react';
import {
  NotebookPen,
  PenTool,
  FileText,
  Pin,
  Trash2,
  Download,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { type Note, uid, nowISO } from '../lib/model';
import { lessons } from '../lib/program';
import { download } from '../lib/export';
import { PageHeader, AddButton, Button, IconButton, Empty, Modal } from '../components/ui';
import { SketchBoard } from '../components/SketchBoard';

export default function Notes() {
  const { state, setState, focusId, navigate, notify } = useWorkspace();
  const [query, setQuery] = useState(''),
    [tab, setTab] = useState('Escribir'),
    [remove, setRemove] = useState(false);
  const notes = state.notes
    .filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  const note = state.notes.find((n) => n.id === focusId) || notes[0];
  const create = () => {
    const id = uid();
    setState((s) => ({
      ...s,
      notes: [
        {
          id,
          title: 'Nueva nota',
          body: '',
          lessonId: '',
          updatedAt: nowISO(),
          pinned: false,
          shapes: [],
        },
        ...s.notes,
      ],
    }));
    navigate('notes', id);
    setQuery('');
  };
  const update = (patch: Partial<Note>) =>
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) => (n.id === note?.id ? { ...n, ...patch, updatedAt: nowISO() } : n)),
    }));
  return (
    <>
      <PageHeader
        eyebrow="PENSAR EN VOZ ALTA"
        title="Tu cuaderno"
        description="Notas, conexiones y diagramas. Todo lo que no querés perder."
      >
        <AddButton onClick={create}>Nueva nota</AddButton>
      </PageHeader>
      {!state.notes.length ? (
        <div className="panel">
          <Empty
            icon={<NotebookPen size={32} />}
            title="Dale un lugar a tus ideas"
            text="Creá una nota para escribir aprendizajes o abrí su pizarra para dibujar y diagramar."
            action={<AddButton onClick={create}>Crear mi primera nota</AddButton>}
          />
          <div className="notes-empty-features">
            <span>
              <FileText size={18} />
              Escritura libre
            </span>
            <span>
              <PenTool size={18} />
              Diagramas y bocetos
            </span>
            <span>
              <ArrowUpRight size={18} />
              Conectadas a tus sesiones
            </span>
          </div>
        </div>
      ) : (
        <div className="notes-layout">
          <aside className="notes-list">
            <div className="search-field">
              <Search size={16} />
              <input
                aria-label="Buscar notas"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en tu cuaderno…"
              />
            </div>
            {notes.map((n) => (
              <button
                key={n.id}
                className={`note-list-item ${note?.id === n.id ? 'active' : ''}`}
                onClick={() => navigate('notes', n.id)}
              >
                <div>
                  <FileText size={16} />
                  {n.pinned && <Pin size={13} />}
                </div>
                <h3>{n.title}</h3>
                <p>{n.body.slice(0, 75) || 'Una idea por desarrollar…'}</p>
                <span>
                  {n.lessonId ? `Sesión ${n.lessonId}` : 'Nota libre'}
                  {n.shapes.length > 0 && ` · ${n.shapes.length} elementos`}
                </span>
              </button>
            ))}
            {!notes.length && <p className="muted">No encontramos notas con esa búsqueda.</p>}
          </aside>
          {note && (
            <section className="note-editor">
              <div className="note-toolbar">
                <select
                  aria-label="Sesión de la nota"
                  value={note.lessonId}
                  onChange={(e) => update({ lessonId: e.target.value })}
                >
                  <option value="">Nota libre</option>
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} · {l.title}
                    </option>
                  ))}
                </select>
                <div>
                  <IconButton
                    label={note.pinned ? 'Desfijar nota' : 'Fijar nota'}
                    aria-pressed={note.pinned}
                    onClick={() => update({ pinned: !note.pinned })}
                  >
                    <Pin size={17} />
                  </IconButton>
                  <IconButton
                    label="Exportar nota Markdown"
                    onClick={() => {
                      download(
                        `# ${note.title}\n\n${note.body}`,
                        `${note.title.replace(/[^\p{L}\p{N} -]/gu, '') || 'nota'}.md`,
                      );
                      notify('Nota exportada');
                    }}
                  >
                    <Download size={17} />
                  </IconButton>
                  <IconButton label="Eliminar nota" onClick={() => setRemove(true)}>
                    <Trash2 size={17} />
                  </IconButton>
                </div>
              </div>
              <input
                className="note-title"
                aria-label="Título de la nota"
                value={note.title}
                maxLength={160}
                onChange={(e) => update({ title: e.target.value || ' ' })}
                onBlur={(e) => {
                  if (!e.target.value.trim()) update({ title: 'Sin título' });
                }}
              />
              <div className="note-meta">
                Actualizada{' '}
                {new Date(note.updatedAt).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                · {note.body.length} caracteres
              </div>
              <div className="tabs" role="tablist" aria-label="Tipo de nota">
                {['Escribir', 'Pizarra'].map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    className={tab === t ? 'active' : ''}
                    onClick={() => setTab(t)}
                  >
                    {t === 'Escribir' ? <FileText size={16} /> : <PenTool size={16} />} {t}
                    {t === 'Pizarra' && note.shapes.length > 0 && <span>{note.shapes.length}</span>}
                  </button>
                ))}
              </div>
              {tab === 'Escribir' ? (
                <div className="writing-area" role="tabpanel">
                  <textarea
                    aria-label="Contenido de la nota"
                    value={note.body}
                    maxLength={50000}
                    onChange={(e) => update({ body: e.target.value })}
                    placeholder="Lo que te llamó la atención. Una idea para Handy. Una pregunta que todavía no tiene respuesta…"
                  />
                  <span className="writing-hint">
                    Podés usar Markdown. Se exporta como texto editable.
                  </span>
                </div>
              ) : (
                <div role="tabpanel">
                  <SketchBoard
                    key={note.id}
                    shapes={note.shapes}
                    title={note.title}
                    onChange={(shapes) => update({ shapes })}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      )}
      <Modal open={remove} title="Eliminar esta nota" onClose={() => setRemove(false)}>
        <p className="modal-description">
          Se eliminarán “{note?.title}” y su pizarra. Podés exportarlas antes de continuar.
        </p>
        <div className="form-footer">
          <Button onClick={() => setRemove(false)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== note?.id) }));
              setRemove(false);
              navigate('notes');
              notify('Nota eliminada');
            }}
          >
            Eliminar nota
          </Button>
        </div>
      </Modal>
    </>
  );
}
