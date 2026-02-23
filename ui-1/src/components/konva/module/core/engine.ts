// drawing/core/engine.ts

import type { DrawingState, Point, Stroke } from "./types";

type Listener = () => void;

export interface DrawingEngine {
  getState(): DrawingState;
  subscribe(listener: Listener): () => void;

  startStroke(point: Point): void;
  appendPoint(point: Point): void;
  commitStroke(): void;
  cancelStroke(): void;

  undo(): void;
  clear(): void;
}

export function createDrawingEngine(
  initial?: Partial<DrawingState>,
): DrawingEngine {
  let state: DrawingState = {
    strokes: [],
    activeStroke: null,
    mode: "idle",
    ...initial,
  };

  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l());

  const setState = (next: DrawingState) => {
    state = next;
    emit();
  };

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    startStroke(point) {
      if (state.mode === "drawing") return;

      const stroke: Stroke = {
        id: crypto.randomUUID(),
        points: [...point],
      };

      setState({
        ...state,
        activeStroke: stroke,
        mode: "drawing",
      });
    },

    appendPoint(point) {
      if (!state.activeStroke) return;

      state.activeStroke.points.push(...point);
      emit(); // Only for state observers; renderer may optimize
    },

    commitStroke() {
      if (!state.activeStroke) return;

      setState({
        strokes: [...state.strokes, state.activeStroke],
        activeStroke: null,
        mode: "idle",
      });
    },

    cancelStroke() {
      setState({
        ...state,
        activeStroke: null,
        mode: "idle",
      });
    },

    undo() {
      if (!state.strokes.length) return;

      setState({
        ...state,
        strokes: state.strokes.slice(0, -1),
      });
    },

    clear() {
      setState({
        strokes: [],
        activeStroke: null,
        mode: "idle",
      });
    },
  };
}
