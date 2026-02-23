// drawingEngine.ts
import { useSyncExternalStore, useMemo } from "react";
import { type DrawingState, type DrawingStore, type Listener } from "./types";

export function createDrawingStore(
  initial?: Partial<DrawingState>,
): DrawingStore {
  let state: DrawingState = {
    document: { strokes: [] },
    activeStroke: [],
    mode: "idle",
    ...initial,
  };

  const listeners = new Set<Listener>();
  const emitChange = () => listeners.forEach((l) => l());

  const getSnapshot = () => state;

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    subscribe,
    getSnapshot,
    addStrokePoint([x, y]) {
      state = {
        ...state,
        activeStroke: [...state.activeStroke, x, y],
        mode: "drawing",
      };
      emitChange();
    },

    clearDocument() {
      state = {
        ...state,
        document: { strokes: [] },
        activeStroke: [],
        mode: "idle",
      };
      emitChange();
    },

    addCompletedStroke() {
      const completedStroke = state.activeStroke;
      state = {
        ...state,
        activeStroke: [],
        document: {
          ...state.document,
          strokes: [...state.document.strokes, completedStroke],
        },
        mode: "idle",
      };

      emitChange();
    },
  };
}

export function useDrawingStore(initial?: Partial<DrawingState>) {
  // store: DrawingStore
  // const store = createDrawingStore(initial);
  const store = useMemo(() => createDrawingStore(initial), [initial]);
  return {
    store,
    drawingState: useSyncExternalStore(store.subscribe, store.getSnapshot),
  };
}
