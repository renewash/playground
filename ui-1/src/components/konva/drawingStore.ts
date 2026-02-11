import { create } from "zustand";

type Document = {
  strokes: number[][];
};

export type DrawingStore = {
  currentStroke: number[];
  draftStrokes: number[][];
  document: Document | null;
  updateCurrentStroke: (s: number[]) => void;
  clearCurrentStroke: () => void;
  updateDraft: (s: number[]) => void;
  clearDraft: () => void;
  applyDraft: () => void;
  loadDocument: (doc: Document) => void;
};

const useDrawingStore = create<DrawingStore>((set, get) => ({
  currentStroke: [],
  draftStrokes: [],
  document: null,
  updateCurrentStroke: (stroke) =>
    set((s) => ({ currentStroke: [...s.currentStroke, ...stroke] })),
  clearCurrentStroke: () => set({ currentStroke: [] }),
  updateDraft: (stroke) =>
    set((s) => ({ draftStrokes: [...s.draftStrokes, stroke] })),
  clearDraft: () => {
    set({ draftStrokes: [] });
  },
  applyDraft: () => {
    const { draftStrokes, document } = get();
    set({
      document: {
        ...document,
        strokes: draftStrokes,
      },
    });
  },
  loadDocument: (doc) => set({ document: doc, draftStrokes: [] }),
}));

export default useDrawingStore;
