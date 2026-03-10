export type Point = [number, number];

export type ModelTypes =
  | "line"
  | "circle"
  | "freeDraw"
  | "lineSegment"
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

export interface LineSegmentModel extends BaseModel {
  type: "lineSegment";
  start: Point;
  end: Point;
  radius: number;
  length: number;
}

export interface FreeFormLineModel extends BaseModel {
  type: "freeDraw";
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
  | LineSegmentModel
  | LineWithMarkersModel;
