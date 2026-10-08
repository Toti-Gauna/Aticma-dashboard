import { useRef, useState } from 'react';
import {
  Download,
  Upload,
  HardDrive,
  BookOpen,
  Github,
  ArrowUpRight,
  CheckCircle2,
  FileJson,
  FileText,
  CalendarDays,
} from 'lucide-react';
import { useWorkspace } from '../lib/workspace';
import { type Workspace } from '../lib/model';
import { parseBackup, browserStorage, STORAGE_KEY } from '../lib/storage';
import { download, workspaceMarkdown, calendarICS } from '../lib/export';
import { PageHeader, Button, Panel, Modal, Pill } from '../components/ui';

export default function Settings() {
  const { state, setState, notify, saveError, resumeStorage } = useWorkspace();
  const input = useRef<HTMLInputElement>(null),
    [incoming, setIncoming] = useState<Workspace>(),
    [error, setError] = useState('');
  const exportJSON = () => {
    download(
      JSON.stringify(state, null, 2),
      `aticma-respaldo-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json',
    );
    notify('Respaldo exportado');
  };
  const original = () => {
    try {
      const raw = browserStorage.getItem(STORAGE_KEY);
      if (raw) {
        download(raw, 'aticma-original.json', 'application/json');
        notify('Original exportado sin modificar');
      } else notify('No hay un archivo original guardado.');
    } catch {
      notify('El navegador bloquea la lectura del archivo original.');
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="TU TRABAJO, A TU ALCANCE"
        title="Respaldo y referencias"
        description="Llevá tus aprendizajes con vos y volvé a las fuentes."
      />
      <div className="settings-grid">
        <Panel title="Tu espacio es local" subtitle="El trabajo se guarda en este navegador.">
          <div className="storage-card">
            <span>
              <HardDrive size={25} />
            </span>
            <div>
              <strong>Notas, respuestas, acciones y diagramas</strong>
              <p>
                Persisten al recargar. Para usarlos en otro dispositivo, exportá un respaldo e
                importalo allí. El sitio no sincroniza con Notion ni con una cuenta.
              </p>
            </div>
          </div>
          <Pill color={saveError ? '#e7b765' : '#b5dc6b'}>
            <CheckCircle2 size={13} />
            {saveError ? 'Revisá el almacenamiento' : 'Guardado automático activo'}
          </Pill>
          <p className="settings-detail">
            El respaldo JSON incluye las pizarras y todos tus registros. Markdown te permite
            trabajar con el cuaderno en otras herramientas.
          </p>
        </Panel>
        <Panel title="Exportar tu trabajo" subtitle="Elegí el formato que necesitás.">
          <div className="export-options">
            <Button onClick={exportJSON}>
              <FileJson size={19} />
              <span>
                <strong>Respaldo completo</strong>
                <small>JSON · incluye diagramas y configuración</small>
              </span>
              <Download size={16} />
            </Button>
            <Button onClick={() => download(workspaceMarkdown(state), 'aticma-cuaderno.md')}>
              <FileText size={19} />
              <span>
                <strong>Cuaderno de aprendizajes</strong>
                <small>Markdown · respuestas, notas, estudios y acciones</small>
              </span>
              <Download size={16} />
            </Button>
            <Button
              onClick={() =>
                download(
                  calendarICS(state.events, new Date(), state.actions),
                  'aticma-calendario.ics',
                  'text/calendar;charset=utf-8',
                )
              }
            >
              <CalendarDays size={19} />
              <span>
                <strong>Calendario</strong>
                <small>ICS · compatible con tu agenda</small>
              </span>
              <Download size={16} />
            </Button>
          </div>
        </Panel>
        <Panel
          title="Recuperar un respaldo"
          subtitle="Importá un archivo exportado por este workspace."
        >
          <p className="muted">
            Podés revisar el contenido antes de reemplazar el trabajo de este navegador. Exportá tu
            versión actual si querés conservar ambas.
          </p>
          <input
            className="sr-only"
            type="file"
            accept=".json,application/json"
            ref={input}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 8_000_000) throw new Error('size');
                setIncoming(parseBackup(await file.text()));
                setError('');
              } catch {
                setError(
                  'No pudimos importar el archivo. Debe ser un respaldo JSON del workspace, versión 1, de hasta 8 MB.',
                );
              }
              e.target.value = '';
            }}
          />
          <Button className="import-button" onClick={() => input.current?.click()}>
            <Upload size={16} />
            Elegir respaldo JSON
          </Button>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {saveError && (
            <div className="recovery">
              <p>{saveError}</p>
              <Button onClick={original}>Exportar archivo original</Button>
              <p className="muted">
                Para recuperar el trabajo, importá un respaldo válido. El original se conserva hasta
                que confirmes el reemplazo.
              </p>
            </div>
          )}
        </Panel>
        <Panel title="Volver a las fuentes" subtitle="El contexto que dio forma a este espacio.">
          <div className="reference-links">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Toti-Gauna/Handy-landing-page-fe"
            >
              <Github size={18} />
              <div>
                <strong>Handy · landing y demo</strong>
                <span>Experiencia de usuario y especialista</span>
              </div>
              <ArrowUpRight size={16} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Toti-Gauna/handy-internal-portal"
            >
              <Github size={18} />
              <div>
                <strong>Handy · portal interno</strong>
                <span>Flujos operativos y contratos pendientes</span>
              </div>
              <ArrowUpRight size={16} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Toti-Gauna/Aticma-dashboard/blob/main/docs/auditoria.md"
            >
              <BookOpen size={18} />
              <div>
                <strong>Auditoría y decisiones de diseño</strong>
                <span>Hallazgos, alcance y límites de las fuentes</span>
              </div>
              <ArrowUpRight size={16} />
            </a>
          </div>
          <p className="settings-detail">
            El calendario se transcribió de las imágenes de ATICMA Emprende 2026. Horarios de
            semifinal y final pendientes. Las preguntas son una guía editorial para Handy.
          </p>
        </Panel>
      </div>
      <Modal open={!!incoming} title="Revisar el respaldo" onClose={() => setIncoming(undefined)}>
        {incoming && (
          <>
            <p className="modal-description">
              Este archivo reemplazará el trabajo actual de este navegador.
            </p>
            <div className="backup-counts">
              <span>
                <strong>{incoming.notes.length}</strong>notas
              </span>
              <span>
                <strong>{incoming.actions.length}</strong>acciones
              </span>
              <span>
                <strong>{incoming.studies.length}</strong>registros
              </span>
              <span>
                <strong>{Object.values(incoming.answers).filter((x) => x.trim()).length}</strong>
                respuestas
              </span>
            </div>
            <div className="form-footer">
              <Button onClick={exportJSON}>Exportar actual</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setState(incoming);
                  resumeStorage();
                  setIncoming(undefined);
                  notify('Respaldo restaurado');
                }}
              >
                Reemplazar con este respaldo
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
