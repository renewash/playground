export type DrawingStore = {
  draftStrokes: number[][];
  committedStrokes: number[][];
  updateDraft: (s: number[]) => void;
  clearDraft: () => void;
  applyDraft: () => void;
  reset: () => void;
};

export type Point = {
  x: number;
  y: number;
};

export type FlatPoint = [number, number];
export type FlatPoints = FlatPoint[];

export type Stroke = number[];

export interface DrawingState {
  draftStrokes: Stroke[];
  committedStrokes: Stroke[];
}
