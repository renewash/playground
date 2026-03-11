// drawing/core/types.ts

import {
  DrawableObject,
  Point,
  ModelTypes,
  ShapeStyle,
} from "../geometry/types";
import { DrawingTool } from "../tools/types";

export type ToolType = ModelTypes;
export type DrawingMode = "idle" | "drawing";

export type ObjectTable = Record<string, DrawableObject>;
export type ChildToParentMap = Record<string, string | null>;

export interface DrawingState {
  objects: ObjectTable;
  childToParentMap: ChildToParentMap;
}

export interface EditorState {
  mode: DrawingMode;
  tool: DrawingTool;
  style: ShapeStyle;
}

export type Listener = () => void;

export interface DrawingEngine {
  getState(): DrawingState;
  getEditorState(): EditorState;
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
  getCommitedObjects(): DrawingState["objects"];

  getParentId(nodeId: string): string | null;
  getNode(nodeId: string): DrawableObject | null;

  commitObject(): void;
  addObject(object: DrawableObject): void;
  deleteObjectById(id: string): void;

  // mutations to inProgressObject
  createStraightline(point: Point): void;
  endStraightline(point: Point): void;

  createTwoPointline(point: Point, radius?: number): void;
  endTwoPointline(point: Point, radius?: number): void;

  createCircle(center: Point, radius: number): void;
  setCircle(center: Point, radius: number): void;

  createFreeFormLine(point: Point): void;
  appendPointToFreeFormLine(point: Point): void;
  setFreeFormLine(points: number[]): void;

  cancelShape(): void;

  _addObject(object: DrawableObject): void;
  _removeObject(id: string): void;
  undo(): void;
  redo(): void;
  clear(): void;
}
