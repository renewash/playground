// drawing/core/types.ts

export type Point = [number, number];
export type ToolType = "line" | "circle" | "freeDraw";
export type DrawingMode = "idle" | "drawing";

export interface StrokeModel {
  id: string;
  type: "stroke";
  points: number[];
}

export interface LineModel {
  id: string;
  type: "line";
  start: Point;
  end: Point;
}

export interface TwoPointLineModel {
  id: string;
  type: "twoPointLine";
  start: Point;
  end: Point;
  radius: number;
}

export interface CircleModel {
  id: string;
  type: "circle";
  center: Point;
  radius: number;
}
export interface LineWithMarkersModel {
  type: "lineWithMarkers";
  id: string;
  points: number[];
  markerRadius: number;
}

export type DrawableObject =
  | LineModel
  | StrokeModel
  | CircleModel
  | TwoPointLineModel
  | LineWithMarkersModel;

export type ObjectTable = Record<string, DrawableObject>;
export type ChildToParentMap = Record<string, string | null>;

export interface DrawingState {
  objects: ObjectTable;
  childToParentMap: ChildToParentMap;
  mode: DrawingMode;
  tool: ToolType;
}

export type Listener = () => void;

export interface DrawingEngine {
  getState(): DrawingState;

  /**
   * Subscribe to changes in static objects.
   *
   * @param {Listener} listener - Callback invoked when changes occur.
   * @returns {() => void} An unsubscribe function to stop listening.
   */
  subscribe(listener: Listener): () => void;
  /**
   * Subscribe to in-progress object changes.
   *
   * @param {Listener} listener - Callback invoked when changes occur.
   * @returns {() => void} An unsubscribe function to stop listening.
   */
  subscribeTransient(listener: Listener): () => void;
  getInProgressObject(): DrawableObject | null;
  getCommitedObjects(): DrawingState["objects"];
  getParentId(nodeId: string): string | null;
  getNode(nodeId: string): DrawableObject | null;
  commitObject(): void;

  // mutations to inProgressObject
  // addMarker(point: Point): void;

  createStraightline(point: Point): void;
  endStraightline(point: Point): void;

  createTwoPointline(point: Point, radius?: number): void;
  endTwoPointline(point: Point, radius?: number): void;

  createCircle(center: Point, radius: number): void;
  setCircle(center: Point, radius: number): void;

  createStroke(point: Point): void;
  appendPointToStroke(point: Point): void;
  setStroke(points: number[]): void;

  cancelShape(): void;

  undo(): void;
  redo(): void;
  clear(): void;
}
