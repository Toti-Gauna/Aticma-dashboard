import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import {
  MousePointer2,
  Pencil,
  Square,
  MoveUpRight,
  Type,
  Undo2,
  Redo2,
  Download,
  Trash2,
  Minus,
  Plus,
  Hand,
  Maximize,
} from 'lucide-react';
import type { Shape } from '../lib/model';
import { uid } from '../lib/model';
import { download } from '../lib/export';
import { useWorkspace } from '../lib/workspace';
import { Button, IconButton, Modal } from './ui';

type Tool = Shape['type'] | 'select' | 'hand';
type Gesture = {
  kind: 'draw' | 'move' | 'pan';
  start: [number, number];
  shape?: Shape;
  view?: { x: number; y: number; zoom: number };
};
const colors = ['#b5dc6b', '#64d3de', '#e7b765', '#a894ed', '#f0f2f5'];
function bounds(s: Shape) {
  if (s.type === 'pen') {
    const xs = s.points.map((p) => p[0] + s.x),
      ys = s.points.map((p) => p[1] + s.y);
    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    };
  }
  return {
    x: Math.min(s.x, s.x + s.w),
    y: Math.min(s.y, s.y + s.h),
    w: Math.abs(s.w),
    h: Math.abs(s.h),
  };
}
function DrawShape({ shape: s }: { shape: Shape }) {
  if (s.type === 'pen')
    return (
      <path
        data-shape={s.id}
        d={s.points.map((p, i) => `${i ? 'L' : 'M'}${s.x + p[0]},${s.y + p[1]}`).join(' ')}
        fill="none"
        stroke={s.color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  if (s.type === 'rect') {
    const b = bounds(s);
    return (
      <rect
        data-shape={s.id}
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx="10"
        fill={`${s.color}12`}
        stroke={s.color}
        strokeWidth="2"
      />
    );
  }
  if (s.type === 'arrow') {
    const angle = Math.atan2(s.h, s.w),
      a = 12;
    const x = s.x + s.w,
      y = s.y + s.h;
    return (
      <g data-shape={s.id} stroke={s.color} strokeWidth="2" strokeLinecap="round">
        <path d={`M${s.x},${s.y}L${x},${y}`} />
        <path
          d={`M${x - a * Math.cos(angle - 0.5)},${y - a * Math.sin(angle - 0.5)}L${x},${y}L${x - a * Math.cos(angle + 0.5)},${y - a * Math.sin(angle + 0.5)}`}
        />
      </g>
    );
  }
  return (
    <g data-shape={s.id}>
      <rect x={s.x - 8} y={s.y - 23} width={s.w + 16} height="34" rx="5" fill="#121a22" />
      <text x={s.x} y={s.y} fill={s.color} fontFamily="sans-serif" fontSize="20">
        {s.text}
      </text>
    </g>
  );
}
export function SketchBoard({
  shapes,
  onChange,
  title,
}: {
  shapes: Shape[];
  onChange: (shapes: Shape[]) => void;
  title: string;
}) {
  const { notify } = useWorkspace();
  const svg = useRef<SVGSVGElement>(null),
    gesture = useRef<Gesture | null>(null);
  const [tool, setTool] = useState<Tool>('pen'),
    [color, setColor] = useState(colors[0]),
    [text, setText] = useState('Nueva idea'),
    [selection, setSelection] = useState<string>(),
    [draft, setDraft] = useState<Shape | null>(null),
    [view, setView] = useState({ x: 0, y: 0, zoom: 1 }),
    [clear, setClear] = useState(false);
  const [history, setHistory] = useState<Shape[][]>([]),
    [future, setFuture] = useState<Shape[][]>([]);
  const commit = (next: Shape[]) => {
    setHistory((h) => [...h.slice(-39), shapes]);
    setFuture([]);
    onChange(next);
  };
  const undo = () => {
    if (!history.length) return;
    const prev = history.at(-1)!;
    setFuture((f) => [shapes, ...f]);
    setHistory((h) => h.slice(0, -1));
    onChange(prev);
    setSelection(undefined);
  };
  const redo = () => {
    if (!future.length) return;
    setHistory((h) => [...h, shapes]);
    onChange(future[0]);
    setFuture((f) => f.slice(1));
    setSelection(undefined);
  };
  const point = (e: PointerEvent<SVGSVGElement>): [number, number] => {
    const p = svg.current!.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const v = p.matrixTransform(svg.current!.getScreenCTM()!.inverse());
    return [v.x, v.y];
  };
  const down = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.focus();
    const p = point(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tool === 'hand') {
      gesture.current = { kind: 'pan', start: [e.clientX, e.clientY], view };
      return;
    }
    if (tool === 'select') {
      const id = (e.target as Element).closest('[data-shape]')?.getAttribute('data-shape');
      setSelection(id || undefined);
      const selected = shapes.find((s) => s.id === id);
      if (selected) {
        gesture.current = { kind: 'move', start: p, shape: selected };
        setDraft(selected);
        if (selected.type === 'text') setText(selected.text);
      }
      return;
    }
    if (shapes.length >= 250) {
      notify('La pizarra llegó a 250 elementos. Creá otra nota o eliminá algunos.');
      return;
    }
    const shape: Shape = {
      id: uid(),
      type: tool,
      color,
      x: p[0],
      y: p[1],
      w: tool === 'text' ? Math.max(50, text.length * 11) : 0,
      h: tool === 'text' ? 24 : 0,
      text: tool === 'text' ? text : '',
      points: tool === 'pen' ? [[0, 0]] : [],
    };
    if (tool === 'text') {
      commit([...shapes, shape]);
      setSelection(shape.id);
      setTool('select');
      return;
    }
    gesture.current = { kind: 'draw', start: p, shape };
    setDraft(shape);
    setSelection(undefined);
  };
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pan') {
      const matrix = svg.current!.getScreenCTM()!;
      setView({
        ...g.view!,
        x: g.view!.x - (e.clientX - g.start[0]) / matrix.a,
        y: g.view!.y - (e.clientY - g.start[1]) / matrix.d,
      });
      return;
    }
    const p = point(e),
      dx = p[0] - g.start[0],
      dy = p[1] - g.start[1];
    if (g.kind === 'move') setDraft({ ...g.shape!, x: g.shape!.x + dx, y: g.shape!.y + dy });
    else if (g.shape?.type === 'pen')
      setDraft((d) => {
        if (!d || d.points.length >= 5000) return d;
        const last = d.points.at(-1)!;
        if (Math.hypot(dx - last[0], dy - last[1]) < 1) return d;
        return { ...d, points: [...d.points, [dx, dy]] };
      });
    else setDraft({ ...g.shape!, w: dx, h: dy });
  };
  const up = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (g && draft) {
      if (g.kind === 'move') {
        commit(shapes.map((s) => (s.id === draft.id ? draft : s)));
      } else if (g.kind === 'draw') {
        if (draft.type === 'pen' ? draft.points.length > 1 : Math.hypot(draft.w, draft.h) > 4)
          commit([...shapes, draft]);
      }
    }
    gesture.current = null;
    setDraft(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const removeSelected = () => {
    if (selection) {
      commit(shapes.filter((s) => s.id !== selection));
      setSelection(undefined);
    }
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      removeSelected();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    if (e.key === 'Escape') {
      setSelection(undefined);
      setTool('select');
    }
    if (selection && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      commit(
        shapes.map((s) =>
          s.id === selection
            ? {
                ...s,
                x: s.x + (e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0),
                y: s.y + (e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0),
              }
            : s,
        ),
      );
    }
  };
  const exportSVG = () => {
    const clone = svg.current!.cloneNode(true) as SVGSVGElement;
    clone.querySelector('[data-selection]')?.remove();
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const all = shapes.map(bounds);
    const minX = Math.min(0, ...all.map((b) => b.x)) - 40,
      minY = Math.min(0, ...all.map((b) => b.y)) - 40,
      maxX = Math.max(1200, ...all.map((b) => b.x + b.w)) + 40,
      maxY = Math.max(700, ...all.map((b) => b.y + b.h)) + 40;
    clone.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    clone.setAttribute('width', '1200');
    clone.setAttribute('height', '700');
    clone.removeAttribute('tabindex');
    download(
      new XMLSerializer().serializeToString(clone),
      `${title.replace(/[^\p{L}\p{N} -]/gu, '') || 'diagrama'}.svg`,
      'image/svg+xml',
    );
    notify('Diagrama exportado en SVG');
  };
  const selected = shapes.find((s) => s.id === selection),
    rendered = shapes.map((s) => (draft?.id === s.id ? draft : s));
  if (draft && gesture.current?.kind === 'draw') rendered.push(draft);
  return (
    <div className="sketch">
      <div className="sketch-toolbar">
        <div className="tool-group">
          {(
            [
              { id: 'select', label: 'Seleccionar y mover', icon: <MousePointer2 /> },
              { id: 'hand', label: 'Mover lienzo', icon: <Hand /> },
              { id: 'pen', label: 'Dibujar', icon: <Pencil /> },
              { id: 'rect', label: 'Rectángulo', icon: <Square /> },
              { id: 'arrow', label: 'Flecha', icon: <MoveUpRight /> },
              { id: 'text', label: 'Texto', icon: <Type /> },
            ] as { id: Tool; label: string; icon: React.ReactNode }[]
          ).map((t) => (
            <button
              type="button"
              className={`sketch-tool ${tool === t.id ? 'active' : ''}`}
              key={t.id}
              aria-label={t.label}
              title={t.label}
              aria-pressed={tool === t.id}
              onClick={() => setTool(t.id)}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <div className="tool-group colors">
          {colors.map((c) => (
            <button
              key={c}
              className={color === c ? 'active' : ''}
              style={{ background: c }}
              aria-label={`Color ${c}`}
              aria-pressed={color === c}
              onClick={() => {
                setColor(c);
                if (selected)
                  commit(shapes.map((s) => (s.id === selection ? { ...s, color: c } : s)));
              }}
            />
          ))}
        </div>
        <div className="tool-group">
          <IconButton label="Deshacer" disabled={!history.length} onClick={undo}>
            <Undo2 size={17} />
          </IconButton>
          <IconButton label="Rehacer" disabled={!future.length} onClick={redo}>
            <Redo2 size={17} />
          </IconButton>
          <IconButton label="Eliminar selección" disabled={!selection} onClick={removeSelected}>
            <Trash2 size={17} />
          </IconButton>
          <IconButton label="Exportar diagrama SVG" onClick={exportSVG}>
            <Download size={17} />
          </IconButton>
        </div>
      </div>
      {(tool === 'text' || selected?.type === 'text') && (
        <div className="sketch-text">
          <label>
            Texto del diagrama
            <input maxLength={200} value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          {selected?.type === 'text' ? (
            <Button
              onClick={() =>
                commit(
                  shapes.map((s) =>
                    s.id === selection ? { ...s, text, w: Math.max(50, text.length * 11) } : s,
                  ),
                )
              }
            >
              Actualizar texto
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (shapes.length >= 250) return;
                const shape: Shape = {
                  id: uid(),
                  type: 'text',
                  color,
                  x: view.x + 600 / view.zoom,
                  y: view.y + 350 / view.zoom,
                  w: Math.max(50, text.length * 11),
                  h: 24,
                  text,
                  points: [],
                };
                commit([...shapes, shape]);
                setSelection(shape.id);
                setTool('select');
              }}
            >
              Agregar al centro
            </Button>
          )}
        </div>
      )}
      <svg
        ref={svg}
        className={`sketch-canvas tool-${tool}`}
        viewBox={`${view.x} ${view.y} ${1200 / view.zoom} ${700 / view.zoom}`}
        tabIndex={0}
        role="application"
        aria-label="Pizarra de diagramas. Elegí una herramienta. Seleccionar permite mover; Delete elimina; Control Z deshace."
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          gesture.current = null;
          setDraft(null);
        }}
        onKeyDown={key}
      >
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#2c343e" />
          </pattern>
        </defs>
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="#11171e" />
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#dots)" />
        {rendered.map((s) => (
          <DrawShape key={s.id} shape={s} />
        ))}
        {selected &&
          (() => {
            const b = bounds(draft || selected);
            return (
              <rect
                data-selection
                x={b.x - 8}
                y={b.y - 30}
                width={b.w + 16}
                height={b.h + 40}
                fill="none"
                stroke="#64d3de"
                strokeDasharray="5 5"
                strokeWidth="1"
                pointerEvents="none"
              />
            );
          })()}
      </svg>
      <div className="sketch-footer">
        <label className="sketch-element-select">
          <span className="sr-only">Elemento de la pizarra</span>
          <select
            aria-label="Elemento de la pizarra"
            value={selection || ''}
            onChange={(e) => {
              setSelection(e.target.value || undefined);
              setTool('select');
              const s = shapes.find((s) => s.id === e.target.value);
              if (s?.type === 'text') setText(s.text);
            }}
          >
            <option value="">{shapes.length} elementos · Seleccionar</option>
            {shapes.map((s, i) => (
              <option value={s.id} key={s.id}>
                {i + 1} ·{' '}
                {s.type === 'text'
                  ? s.text
                  : s.type === 'pen'
                    ? 'Trazo'
                    : s.type === 'rect'
                      ? 'Rectángulo'
                      : 'Flecha'}
              </option>
            ))}
          </select>
        </label>
        <div>
          <IconButton
            label="Alejar"
            disabled={view.zoom <= 0.5}
            onClick={() => setView((v) => ({ ...v, zoom: Math.max(0.5, v.zoom - 0.25) }))}
          >
            <Minus size={14} />
          </IconButton>
          <span>{Math.round(view.zoom * 100)}%</span>
          <IconButton
            label="Acercar"
            disabled={view.zoom >= 3}
            onClick={() => setView((v) => ({ ...v, zoom: Math.min(3, v.zoom + 0.25) }))}
          >
            <Plus size={14} />
          </IconButton>
          <IconButton label="Restablecer vista" onClick={() => setView({ x: 0, y: 0, zoom: 1 })}>
            <Maximize size={14} />
          </IconButton>
          <Button variant="ghost" disabled={!shapes.length} onClick={() => setClear(true)}>
            Limpiar
          </Button>
        </div>
      </div>
      <p className="sketch-help">
        Lápiz para ideas libres. Rectángulos y flechas para flujos. Seleccioná un elemento para
        moverlo, cambiar su color o editar su texto. También funciona con lápiz táctil.
      </p>
      <Modal open={clear} title="Limpiar la pizarra" onClose={() => setClear(false)}>
        <p className="modal-description">
          Se quitarán los elementos de esta pizarra. Podés deshacerlo mientras la nota siga abierta.
        </p>
        <div className="form-footer">
          <Button onClick={() => setClear(false)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={() => {
              commit([]);
              setSelection(undefined);
              setClear(false);
            }}
          >
            Limpiar pizarra
          </Button>
        </div>
      </Modal>
    </div>
  );
}
