export type Point = [number, number];

export type ModelTypes =
  | "line"
  | "circle"
  | "freeFormLine"
  | "twoPointLine"
  | "lineWithMarkers";

export interface LineModel {
  id: string;
  type: "line";
  start: Point;
  end: Point;
  length: number;
}

export interface TwoPointLineModel {
  id: string;
  type: "twoPointLine";
  start: Point;
  end: Point;
  radius: number;
}

export interface FreeFormLineModel {
  id: string;
  type: "freeFormLine";
  points: number[];
  area: number;
}

export interface CircleModel {
  id: string;
  type: "circle";
  center: Point;
  radius: number;
  area: number;
}
export interface LineWithMarkersModel {
  type: "lineWithMarkers";
  id: string;
  points: number[];
  markerRadius: number;
  length: number;
}

export type DrawableObject =
  | LineModel
  | FreeFormLineModel
  | CircleModel
  | TwoPointLineModel
  | LineWithMarkersModel;
