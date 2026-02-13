// drawingEngine.ts
import { type DrawingState } from "./types";

export function createDrawingEngine(initial?: Partial<DrawingState>) {
  let state: DrawingState = {
    draftStrokes: [],
    committedStrokes: [],
    ...initial,
  };

  return {
    getState: () => state,
    addDraftPoint(point: number[]) {
      state = {
        ...state,
        draftStrokes: [...state.draftStrokes, point],
      };
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
