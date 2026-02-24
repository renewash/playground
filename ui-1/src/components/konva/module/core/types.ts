// drawing/core/types.ts

export type Point = [number, number];
export type ToolType = "freeDraw" | "twoPointLine" | "circle";
export type DrawingMode = "idle" | "drawing";

export interface Stroke {
  id: string;
  type: "stroke";
  points: number[];
}

export interface Circle {
  id: string;
  type: "circle";
  center: Point;
  radius: number;
}

export type PrimitiveObject = Stroke | Circle;
export interface LineWithMarkersObject {
  type: "lineWithMarkers";
  id: string;
  points: number[];
  markerRadius: number;
}

export type CompositeObject = LineWithMarkersObject;

export type Shape = PrimitiveObject | CompositeObject;

export type DrawableObject = PrimitiveObject | CompositeObject;

export type Shapes = Shape[];

export interface DrawingState {
  objects: DrawableObject[];
  activeObject: DrawableObject | null;
  mode: DrawingMode;
  tool: ToolType;
}
