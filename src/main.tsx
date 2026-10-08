import { StrictMode, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/dm-sans';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import './styles.css';
import App from './App';
import { WorkspaceProvider } from './lib/workspace';

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="fatal-error">
          <h1>No pudimos abrir el workspace.</h1>
          <p>
            Recargá la página para volver a intentar. Tus datos guardados siguen en este navegador.
          </p>
          <button className="btn btn-primary" onClick={() => location.reload()}>
            Recargar
          </button>
        </div>
      );
    return this.props.children;
  }
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
);
