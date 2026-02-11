import { create } from "zustand";
import { type Stroke } from "@/components/konva/KonvaFreeDrawingTool";

type Document = {
  strokes: Stroke[];
};

type DrawingStore = {
  draftStrokes: Stroke[];
  document: Document | null;
  addDraftStroke: (s: Stroke) => void;
  clearDraft: () => void;
  applyDraft: () => void;
  loadDocument: (doc: Document) => void;
};

const useDrawingStore = create<DrawingStore>((set, get) => ({
  draftStrokes: [],
  document: null,
  addDraftStroke: (stroke) =>
    set((s) => ({ draftStrokes: [...s.draftStrokes, stroke] })),
  clearDraft: () => {
    console.log("clearing draft", get());
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
