// drawing/core/types.ts

import {
  DrawableObject,
  Point,
  Points,
  ModelTypes,
  ShapeStyle,
} from "../geometry/types";
import { DrawingTool } from "../tools/types";

export type ToolType = ModelTypes;
export type DrawingMode = "idle" | "drawing";

export type ObjectTable = Record<string, DrawableObject>;
export type ChildToParentMap = Record<string, string | null>;

export interface TransientSnapshot {
  version: number;
  inProgressObject: DrawableObject | null;
}
export interface DrawingState {
  objects: ObjectTable;
  childToParentMap: ChildToParentMap;
}

export type ToolSet = {
  [key in ToolType]: DrawingTool;
};

export interface AllEngineShapes {
  committedObjects: DrawingState;
  inProgressObject: DrawableObject | null;
}
export interface EditorState {
  mode: DrawingMode;
  tool: DrawingTool;
  style: ShapeStyle;
  editable: boolean;
}

export type Listener = () => void;

export interface DrawingEngine {
  getState(): DrawingState;
  getEditorState(): EditorState;
  setStrokeColor(color: string): void;
  setStrokeWidth(width: number): void;

  setEditable(editable: boolean): void;
  toggleEditable(): void;

  getTool(): DrawingTool;
  pickTool(tool: ToolType): void;
  setTool(tool: DrawingTool): void;

  _startDrawing(): void;
  _stopDrawing(): void;

  subscribeEditor(listener: Listener): () => void;
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
  getTransientSnapshot(): {
    version: number;
    inProgressObject: DrawableObject | null;
  };
  getCommittedObjects(): DrawingState["objects"];

  getParentId(nodeId: string): string | null;
  getNode(nodeId: string): DrawableObject | null;

  commitObject(): void;
  deleteObjectById(id: string): void;

  // mutations to inProgressObject
  createLineSegment(point: Point, radius?: number): void;
  endLineSegment(point: Point, radius?: number): void;

  createFreeFormLine(points: Points): void;
  appendPointToFreeFormLine(point: Point): void;
  setFreeFormLine(points: Points): void;

  createPolygonSegment(points: Points, radius?: number): void;
  appendPointToPolygonSegment(point: Point): void;
  setPolygonSegment(points: Points, radius?: number): void;
  replaceLastPointOfPolygonSegment(point: Point): void;
  removeLastPointOfPolygonSegment(): void;

  cancelDrawing(): void;

  _addObject(object: DrawableObject): void;
  _removeObject(id: string): void;
  undo(): void;
  redo(): void;
  clear(): void;

  getSerializedState(): string;
  setSerializedState(serializedState: string): void;
}
