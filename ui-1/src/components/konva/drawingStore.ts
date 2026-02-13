import { create } from "zustand";
import { type DrawingStore } from "@/components/konva/types";

const useDrawingStore = create<DrawingStore>((set, get) => ({
  draftStrokes: [],
  committedStrokes: [],

  updateDraft: (stroke) =>
    set((s) => ({ draftStrokes: [...s.draftStrokes, stroke] })),

  clearDraft: () => set({ draftStrokes: [] }),

  applyDraft: () => {
    const { draftStrokes, committedStrokes } = get();
    const committedStrokesList: number[][] = committedStrokes || [];
    set({
      committedStrokes: [...committedStrokesList, ...draftStrokes],
      draftStrokes: [],
    });
  },

  reset: () => set({ draftStrokes: [], committedStrokes: [] }),
}));

export default useDrawingStore;
