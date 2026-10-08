import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { type Workspace, type Page } from './model';
import { readWorkspace, writeWorkspace, browserStorage, STORAGE_KEY } from './storage';

type Context = {
  state: Workspace;
  setState: Dispatch<SetStateAction<Workspace>>;
  page: Page;
  navigate: (page: Page, id?: string) => void;
  focusId: string;
  notify: (message: string) => void;
  message: string;
  saveError: string;
  saveStatus: string;
  resumeStorage: () => void;
};
const WorkspaceContext = createContext<Context | null>(null);
const pages: Page[] = [
  'dashboard',
  'sessions',
  'calendar',
  'notes',
  'actions',
  'studies',
  'tools',
  'settings',
];
function route() {
  const [page, id = ''] = location.hash.slice(1).split('/');
  let decoded = '';
  try {
    decoded = decodeURIComponent(id);
  } catch {
    decoded = '';
  }
  return {
    page: pages.includes(page as Page) ? (page as Page) : ('dashboard' as Page),
    id: decoded,
  };
}
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => readWorkspace(browserStorage));
  const [state, setState] = useState(initial.data);
  const [current, setCurrent] = useState(route);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState(initial.error);
  const [blocked, setBlocked] = useState(initial.blocked);
  const [saveStatus, setSaveStatus] = useState('Guardado en este navegador');
  const latest = useRef(state);
  const blockedRef = useRef(initial.blocked);
  const notify = useCallback((message: string) => setMessage(message), []);
  useEffect(() => {
    latest.current = state;
  }, [state]);
  useEffect(() => {
    if (blocked) return;
    const timer = setTimeout(() => {
      if (blockedRef.current) return;
      const error = writeWorkspace(browserStorage, state);
      setSaveError(error);
      setSaveStatus(error ? 'Sin guardar' : 'Guardado en este navegador');
    }, 300);
    return () => clearTimeout(timer);
  }, [state, blocked]);
  useEffect(() => {
    const flush = () => {
      if (!blockedRef.current) {
        const error = writeWorkspace(browserStorage, latest.current);
        if (error) setSaveError(error);
      }
    };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
    };
  }, [blocked]);
  useEffect(() => {
    const sync = () => {
      setCurrent(route());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue !== JSON.stringify(latest.current)) {
        blockedRef.current = true;
        setBlocked(true);
        setSaveError(
          'Otra pestaña cambió el respaldo. Pausamos el guardado para conservar tu trabajo. Exportá esta versión y recuperá el archivo original desde Respaldo.',
        );
      }
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(t);
  }, [message]);
  const navigate = useCallback((page: Page, id = '') => {
    location.hash = `${page}${id ? `/${encodeURIComponent(id)}` : ''}`;
  }, []);
  return (
    <WorkspaceContext.Provider
      value={{
        state,
        setState,
        page: current.page,
        focusId: current.id,
        navigate,
        notify,
        message,
        saveError,
        saveStatus,
        resumeStorage: () => {
          blockedRef.current = false;
          setBlocked(false);
          setSaveError('');
        },
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('WorkspaceProvider missing');
  return value;
}
