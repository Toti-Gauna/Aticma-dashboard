import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  NotebookPen,
  Target,
  FlaskConical,
  Wrench,
  HardDrive,
  Search,
  ArrowUpRight,
  Menu,
  X,
  CircleCheck,
  TriangleAlert,
} from 'lucide-react';
import { useWorkspace } from './lib/workspace';
import type { Page } from './lib/model';
import { Button, IconButton } from './components/ui';
import { SearchDialog } from './components/SearchDialog';

const Dashboard = lazy(() => import('./pages/Dashboard')),
  Sessions = lazy(() => import('./pages/Sessions')),
  Calendar = lazy(() => import('./pages/Calendar')),
  Notes = lazy(() => import('./pages/Notes')),
  Actions = lazy(() => import('./pages/Actions')),
  Studies = lazy(() => import('./pages/Studies')),
  Tools = lazy(() => import('./pages/Tools')),
  Settings = lazy(() => import('./pages/Settings'));
const nav: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { id: 'sessions', label: 'Masterclasses', icon: <BookOpen /> },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays /> },
  { id: 'notes', label: 'Cuaderno', icon: <NotebookPen /> },
  { id: 'actions', label: 'Acciones', icon: <Target /> },
  { id: 'studies', label: 'Estudios y experiencias', icon: <FlaskConical /> },
  { id: 'tools', label: 'Herramientas', icon: <Wrench /> },
];
export default function App() {
  const { page, navigate, state, message, saveError, saveStatus } = useWorkspace();
  const [search, setSearch] = useState(false),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((s) => !s);
      }
      if (e.key === 'Escape') setMenu(false);
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    document.title = `${nav.find((n) => n.id === page)?.label || 'Respaldo'} · ATICMA × Handy`;
  }, [page]);
  const content = {
    dashboard: <Dashboard />,
    sessions: <Sessions />,
    calendar: <Calendar />,
    notes: <Notes />,
    actions: <Actions />,
    studies: <Studies />,
    tools: <Tools />,
    settings: <Settings />,
  };
  const go = (page: Page) => {
    navigate(page);
    setMenu(false);
  };
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      {menu && (
        <button
          className="sidebar-overlay"
          aria-label="Cerrar navegación"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <button className="brand" onClick={() => go('dashboard')} aria-label="ATICMA Handy, inicio">
          <span className="brand-symbol">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="m10 29 9-19h3l9 19M14 22h13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>
            <strong>
              ATICMA<span className="brand-times"> × </span>
              <span className="brand-handy">handy</span>
            </strong>
            <small>LEARNING WORKSPACE</small>
          </span>
        </button>
        <div className="workspace-select">
          <span className="workspace-avatar">H</span>
          <div>
            <strong>Proyecto Handy</strong>
            <span>ATICMA Emprende 2026</span>
          </div>
          <span className="workspace-select-dot" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Navegación principal">
          {nav.map((item) => (
            <button
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              aria-current={page === item.id ? 'page' : undefined}
              key={item.id}
              onClick={() => go(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'actions' && (
                <small>{state.actions.filter((a) => a.status !== 'Hecho').length}</small>
              )}
              {page === item.id && <span className="nav-active-mark" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="program-card">
            <div className="program-card-top">
              <span className="status-dot" />
              PROGRAMA 2026
            </div>
            <strong>
              Aprender. Aplicar.
              <br />
              Hacer que pase.
            </strong>
            <p>{state.completedLessons.length} de 6 sesiones completadas</p>
            <div className="progress-track">
              <div style={{ width: `${(state.completedLessons.length / 6) * 100}%` }} />
            </div>
            <button onClick={() => go('sessions')}>
              Ver mi recorrido
              <ArrowUpRight size={14} />
            </button>
          </div>
          <button
            className={`nav-item ${page === 'settings' ? 'active' : ''}`}
            onClick={() => go('settings')}
          >
            <HardDrive />
            <span>Respaldo y referencias</span>
          </button>
          <div className="sidebar-signature">
            <span className="profile-avatar">H</span>
            <div>
              <strong>Mi espacio de trabajo</strong>
              <span>Construyendo Handy</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <IconButton
              label={menu ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </IconButton>
            <span>
              Workspace<span className="breadcrumb-slash">/</span>
              <strong>{nav.find((n) => n.id === page)?.label || 'Respaldo y referencias'}</strong>
            </span>
          </div>
          <div className="topbar-right">
            <button
              aria-label="Buscar en el workspace"
              className="global-search"
              onClick={() => setSearch(true)}
            >
              <Search size={16} />
              <span>Buscar en tu workspace</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="live-program">
              <span className="status-dot" />
              ATICMA 2026
            </div>
            <span className="profile-avatar">H</span>
          </div>
        </header>
        {saveError && (
          <div className="storage-alert" role="alert">
            <TriangleAlert size={18} />
            <p>{saveError}</p>
            <Button onClick={() => go('settings')}>Abrir respaldo</Button>
          </div>
        )}
        <main id="main-content" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="page-loading">
                Preparando tu workspace
                <span />
              </div>
            }
          >
            <motion.div
              key={page}
              className="page-content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {content[page]}
            </motion.div>
          </Suspense>
          <footer className="app-footer">
            <span>
              ATICMA × Handy <span className="footer-separator">·</span> Ideas que se convierten en
              realidad.
            </span>
            <span>
              <CircleCheck size={12} />
              {saveError ? 'Revisá el respaldo' : saveStatus}
            </span>
          </footer>
        </main>
      </div>
      <AnimatePresence>
        {message && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <CircleCheck size={17} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      {search && <SearchDialog onClose={() => setSearch(false)} />}
    </>
  );
}
