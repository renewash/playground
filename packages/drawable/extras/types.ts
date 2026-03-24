export type Point = { x: number; y: number };
export type Points = Point[];

export type ModelTypes =
  | "line"
  | "circle"
  | "freeDraw"
  | "lineSegment"
  | "polygonSegment";

export type ShapeStyle = {
  strokeWidth: number;
  strokeColor: string;
};

interface BaseModel {
  id: string;
  type: ModelTypes;
  style: ShapeStyle;
}

export interface LineModel extends BaseModel {
  type: "line";
  start: Point;
  end: Point;
  length: number;
}

export interface CircleModel extends BaseModel {
  type: "circle";
  center: Point;
  radius: number;
}

export type DrawableObject = LineModel | CircleModel;
