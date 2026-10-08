import { useState } from 'react';
import {
  Search,
  ArrowUpRight,
  BookOpen,
  NotebookPen,
  Target,
  FlaskConical,
  LayoutDashboard,
  CalendarDays,
  Wrench,
} from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { lessons } from '../lib/program';
import type { Page } from '../lib/model';
import { Modal } from './ui';

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const { state, navigate } = useWorkspace();
  const [query, setQuery] = useState('');
  const pages: { title: string; page: Page; icon: React.ReactNode }[] = [
    { title: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard /> },
    { title: 'Calendario', page: 'calendar', icon: <CalendarDays /> },
    { title: 'Herramientas', page: 'tools', icon: <Wrench /> },
  ];
  const results = [
    ...pages.map((p) => ({ ...p, id: '', detail: 'Ir a la sección', search: p.title })),
    ...lessons.map((l) => ({
      title: l.title,
      id: l.id,
      page: 'sessions' as Page,
      icon: <BookOpen />,
      detail: `Masterclass ${l.id}`,
      search: `${l.title} ${l.speaker}`,
    })),
    ...state.notes.map((n) => ({
      title: n.title,
      id: n.id,
      page: 'notes' as Page,
      icon: <NotebookPen />,
      detail: 'Nota',
      search: `${n.title} ${n.body}`,
    })),
    ...state.actions.map((a) => ({
      title: a.title,
      id: a.id,
      page: 'actions' as Page,
      icon: <Target />,
      detail: `Acción · ${a.status}`,
      search: `${a.title} ${a.description}`,
    })),
    ...state.studies.map((s) => ({
      title: s.title,
      id: s.id,
      page: 'studies' as Page,
      icon: <FlaskConical />,
      detail: `Registro · ${s.status}`,
      search: `${s.title} ${s.hypothesis} ${s.evidence}`,
    })),
  ]
    .filter((r) =>
      r.search
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
          query
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
        ),
    )
    .slice(0, 15);
  return (
    <Modal open title="Encontrá lo que necesitás" onClose={onClose}>
      <div className="command-search">
        <Search size={19} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sesiones, notas, acciones, estudios…"
          aria-label="Buscar en el workspace"
        />
      </div>
      <div className="search-results">
        {results.map((r, i) => (
          <button
            key={`${r.page}-${r.id}-${i}`}
            onClick={() => {
              navigate(r.page, r.id);
              onClose();
            }}
          >
            {r.icon}
            <span>
              <strong>{r.title}</strong>
              <small>{r.detail}</small>
            </span>
            <ArrowUpRight size={16} />
          </button>
        ))}
        {!results.length && (
          <p className="muted">No encontramos resultados. Probá con otra palabra.</p>
        )}
      </div>
      <div className="search-footer">TAB para recorrer · ENTER para abrir · ESC para cerrar</div>
    </Modal>
  );
}
