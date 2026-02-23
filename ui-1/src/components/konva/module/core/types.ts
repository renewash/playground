// drawing/core/types.ts

export type Point = [number, number];

export interface Stroke {
  id: string;
  points: number[];
}

export interface DrawingState {
  strokes: Stroke[];
  activeStroke: Stroke | null;
  mode: "idle" | "drawing";
}
