import { useState } from 'react';
import { Modal, Button } from './ui';
import { useWorkspace } from '../lib/workspace';
import { type Action, uid } from '../lib/model';
import { lessons, areas } from '../lib/program';

export function ActionForm({
  action,
  lessonId = '',
  initialTitle = '',
  initialDescription = '',
  onClose,
}: {
  action?: Action;
  lessonId?: string;
  initialTitle?: string;
  initialDescription?: string;
  onClose: () => void;
}) {
  const { setState, notify } = useWorkspace();
  const [draft, setDraft] = useState<Action>(
    action || {
      id: uid(),
      title: initialTitle.slice(0, 200),
      description: initialDescription,
      lessonId,
      area: 'Producto',
      status: 'Pendiente',
      priority: 'Media',
      due: '',
      owner: '',
    },
  );
  const update = (key: keyof Action, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  return (
    <Modal open title={action ? 'Editar acción' : 'Nueva acción para Handy'} onClose={onClose}>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.title.trim()) return;
          setState((s) => ({
            ...s,
            actions: action
              ? s.actions.map((a) =>
                  a.id === action.id ? { ...draft, title: draft.title.trim() } : a,
                )
              : [...s.actions, { ...draft, title: draft.title.trim() }],
          }));
          notify(action ? 'Acción actualizada' : 'Acción agregada al tablero');
          onClose();
        }}
      >
        <label>
          ¿Qué vas a hacer?
          <input
            required
            maxLength={200}
            value={draft.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Ej. entrevistar a cinco especialistas"
          />
        </label>
        <label>
          Resultado esperado
          <textarea
            value={draft.description}
            maxLength={50000}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Definí qué significa terminar esta acción…"
            rows={3}
          />
        </label>
        <div className="form-grid">
          <label>
            Área
            <select
              aria-label="Área"
              value={draft.area}
              onChange={(e) => update('area', e.target.value)}
            >
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label>
            Prioridad
            <select
              aria-label="Prioridad"
              value={draft.priority}
              onChange={(e) => update('priority', e.target.value)}
            >
              {['Alta', 'Media', 'Baja'].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label>
            Fecha límite
            <input type="date" value={draft.due} onChange={(e) => update('due', e.target.value)} />
          </label>
          <label>
            Responsable
            <input
              maxLength={100}
              value={draft.owner}
              onChange={(e) => update('owner', e.target.value)}
              placeholder="Nombre o rol"
            />
          </label>
          <label>
            Sesión relacionada
            <select
              aria-label="Sesión relacionada"
              value={draft.lessonId}
              onChange={(e) => update('lessonId', e.target.value)}
            >
              <option value="">Sin sesión</option>
              {lessons.map((l) => (
                <option value={l.id} key={l.id}>
                  {l.id} · {l.title}
                </option>
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
              {['Pendiente', 'En curso', 'Hecho'].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-footer">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            Guardar acción
          </Button>
        </div>
      </form>
    </Modal>
  );
}
