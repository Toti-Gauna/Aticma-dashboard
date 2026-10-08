import { workspaceSchema, freshWorkspace, type Workspace } from './model';
export const STORAGE_KEY = 'aticma-handy-workspace-v1';
export const browserStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
};
export type StorageResult = { data: Workspace; error: string; blocked: boolean };
export function readWorkspace(storage: Pick<Storage, 'getItem'>): StorageResult {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      data: freshWorkspace(),
      error: 'No pudimos leer el almacenamiento. Exportá tu trabajo antes de cerrar esta pestaña.',
      blocked: true,
    };
  }
  if (!raw) return { data: freshWorkspace(), error: '', blocked: false };
  const invalid = () => ({
    data: freshWorkspace(),
    error:
      'El respaldo guardado no tiene un formato válido. Conservamos el original; exportalo desde Respaldo antes de recuperarlo.',
    blocked: true,
  });
  try {
    const parsed = workspaceSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return invalid();
    return { data: parsed.data, error: '', blocked: false };
  } catch {
    return invalid();
  }
}
export function writeWorkspace(storage: Pick<Storage, 'setItem'>, state: Workspace): string {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return '';
  } catch {
    return 'No se pudo guardar en este navegador. Puede estar lleno o bloqueado. Exportá un respaldo antes de cerrar.';
  }
}
export function parseBackup(raw: string): Workspace {
  if (new TextEncoder().encode(raw).length > 8_000_000)
    throw new Error('El archivo supera el límite de 8 MB.');
  return workspaceSchema.parse(JSON.parse(raw));
}
