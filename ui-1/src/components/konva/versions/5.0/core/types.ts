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

export interface Shape {
  id: string;
  type: "stroke" | "circle";
  data: Stroke | Circle;
}
export interface Shapes {
  shapes: Shape[];
}

export interface DrawingState {
  strokes: Stroke[];
  activeStroke: Stroke | null;
  mode: "idle" | "drawing";
}
