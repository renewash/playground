export type Point = [number, number];

export type ModelTypes =
  | "line"
  | "circle"
  | "freeFormLine"
  | "twoPointLine"
  | "lineWithMarkers";

interface BaseModel {
  id: string;
  type: ModelTypes;
}

export interface LineModel extends BaseModel {
  type: "line";
  start: Point;
  end: Point;
  length: number;
}

export interface TwoPointLineModel extends BaseModel {
  type: "twoPointLine";
  start: Point;
  end: Point;
  radius: number;
  length: number;
}

export interface FreeFormLineModel extends BaseModel {
  type: "freeFormLine";
  points: number[];
  area: number;
}

export interface CircleModel extends BaseModel {
  type: "circle";
  center: Point;
  radius: number;
  area: number;
}
export interface LineWithMarkersModel extends BaseModel {
  type: "lineWithMarkers";
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
