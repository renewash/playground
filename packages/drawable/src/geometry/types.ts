export type Point = { x: number; y: number };
export type Points = Point[];

export type ModelTypes = "freeDraw" | "lineSegment" | "polygonSegment";

export type ShapeStyle = {
  strokeWidth: number;
  strokeColor: string;
};

interface BaseModel {
  id: string;
  type: ModelTypes;
  style: ShapeStyle;
}

export interface LineSegmentModel extends BaseModel {
  type: "lineSegment";
  start: Point;
  end: Point;
  radius: number;
  length: number;
}

export interface FreeDrawModel extends BaseModel {
  type: "freeDraw";
  points: Points;
  area: number;
}

export interface PolygonSegmentModel extends BaseModel {
  type: "polygonSegment";
  points: Points;
  radius: number;
  area: number;
}

export type DrawableObject =
  | FreeDrawModel
  | LineSegmentModel
  | PolygonSegmentModel;
