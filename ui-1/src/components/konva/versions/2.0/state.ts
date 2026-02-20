// drawingEngine.ts
import { useSyncExternalStore } from "react";
import { type DrawingState } from "./types";

type Listener = () => void;

export function createDrawingStore(initial?: Partial<DrawingState>) {
  let state: DrawingState = {
    draftStrokes: [],
    committedStrokes: [],
    ...initial,
  };

  const listeners = new Set<Listener>();
  const emitChange = () => listeners.forEach((l) => l());

  const setState = (partial: Partial<DrawingState>) => {
    state = {
      ...state,
      ...partial,
    };
    emitChange();
  };

  const getSnapshot = () => state;

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    subscribe,
    getSnapshot,

    addDraftPoint(point: number[]) {
      setState({
        draftStrokes: [...state.draftStrokes, point],
      });
    },

    clearDraft() {
      state = {
        ...state,
        draftStrokes: [],
      };
    },

    commitDraft() {
      state = {
        draftStrokes: [],
        committedStrokes: [...state.committedStrokes, ...state.draftStrokes],
      };
    },
  };
}

type Store = {
  subscribe: () => () => void;
  getSnapshot: () => DrawingState;
};
export function useDrawingStore(store: Store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
