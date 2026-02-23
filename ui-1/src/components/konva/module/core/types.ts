// drawing/core/types.ts

export type Point = [number, number];

export interface Stroke {
  id: string;
  points: number[];
}

export interface Circle {
  id: string;
  center: Point;
  radius: number;
}

export interface Shapes {
  strokes: Stroke[];
  circles: Circle[];
}

export interface DrawingState {
  strokes: Stroke[];
  activeStroke: Stroke | null;
  mode: "idle" | "drawing";
}
