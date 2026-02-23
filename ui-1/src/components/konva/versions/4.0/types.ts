export type Listener = () => void;

export type Point = {
  x: number;
  y: number;
};

export type FlatPoint = [number, number];
export type FlatPoints = FlatPoint[];

export type Stroke = number[];
export type Mode = "idle" | "drawing";

export type DrawingStore = {
  subscribe: (l: Listener) => () => void;
  getSnapshot: () => DrawingState;
  addStrokePoint: (s: number[]) => void;
  clearDocument: () => void;
  addCompletedStroke: () => void;
};

export type DrawingState = {
  document: { strokes: Stroke[] };
  activeStroke: Stroke;
  mode: Mode;
};
