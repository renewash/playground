// drawing/core/engine.ts

import History, { AddObjectCommand, DeleteObjectCommand } from "./history";

import type {
  Listener,
  DrawingState,
  DrawingEngine,
  EditorState,
} from "./types";

import { DrawableObject } from "../geometry/types";
import { createLineModel } from "../geometry/domain/LineModel";
import { createCircleModel } from "../geometry/domain/CircleModel";
import { createLineSegmentModel } from "../geometry/domain/LineSegmentModel";
import { createFreeFormLineModel } from "../geometry/domain/FreeFormLineModel";
import { getArea, getLength } from "./measure";
import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";

/**
 * Holds internal state of canvas and defines mutation logic.
 * This engine manages objects and drawings.
 * Objects are primatives (a single Konva shape) or composites shapes (multiple primatives) represented as a graph.
 * Transient objects holds the state of a drawing that is in progress, such as a line being drawn.
 *
 * @param initial - Optional starting state for the engine.
 * @returns A fresh DrawingEngine instance.
 */
export function createDrawingEngine(
  initial?: Partial<DrawingState>,
): DrawingEngine {
  let state: DrawingState = {
    objects: {},
    childToParentMap: {},
    ...initial,
  };

  let editorState: EditorState = {
    mode: "idle",
    tool: createLineSegmentTool(),
    style: {
      strokeWidth: 3,
      strokeColor: "#8e2d9a",
    },
  };

  const toolSet = {
    freeDraw: createFreeDrawTool(),
    lineSegment: createLineSegmentTool(),
  };

  const history = new History();

  let inProgressUpdates: number = 0;
  let inProgressObject: DrawableObject | null = null;

  let transientSnapshot = {
    version: inProgressUpdates,
    inProgressObject,
  };

  const listeners = new Set<Listener>();
  const editorListeners = new Set<Listener>();
  const transientListeners = new Set<Listener>();

  const emit = () => listeners.forEach((l) => l());
  const emitEditorUpdate = () => editorListeners.forEach((l) => l());
  const emitInProgressUpdates = () => {
    inProgressUpdates++;

    // only update version so that inProgressObject reference is preserved for better performance in react-konva.
    transientSnapshot = { version: inProgressUpdates, inProgressObject };
    transientListeners.forEach((l) => l());
  };

  return {
    getState() {
      return state;
    },

    getEditorState() {
      return editorState;
    },

    getTool() {
      return editorState.tool;
    },

    pickTool(toolName) {
      this.setTool(toolSet[toolName]);
    },

    setTool(tool) {
      editorState = {
        ...editorState,
        tool,
      };
      emitEditorUpdate();
    },

    _startDrawing() {
      editorState.mode = "drawing";
      emitEditorUpdate();
    },

    _stopDrawing() {
      editorState.mode = "idle";
      emitEditorUpdate();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    subscribeEditor(listener) {
      editorListeners.add(listener);
      return () => editorListeners.delete(listener);
    },

    subscribeTransient(listener) {
      transientListeners.add(listener);
      return () => transientListeners.delete(listener);
    },

    getInProgressObject() {
      return inProgressObject;
    },
    getTransientSnapshot() {
      return transientSnapshot;
    },

    getCommitedObjects() {
      return state.objects;
    },

    getParentId(nodeId) {
      if (nodeId in state.childToParentMap === false) {
        return null;
      }

      return state.childToParentMap[nodeId] ?? null;
    },

    getNode(nodeId) {
      if (nodeId in state.objects === false) {
        return null;
      }
      return state.objects[nodeId] ?? null;
    },

    createStraightline(point) {
      inProgressObject = createLineModel({ start: point });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endStraightline(point) {
      if (inProgressObject === null || inProgressObject.type !== "line") return;
      inProgressObject.end = point;

      this._stopDrawing();
      emitInProgressUpdates();
    },

    createTwoPointline(start, radius) {
      inProgressObject = createLineSegmentModel({ start, radius });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endTwoPointline(point, radius) {
      if (inProgressObject === null || inProgressObject.type !== "lineSegment")
        return;

      inProgressObject.end = point;
      inProgressObject.radius = inProgressObject.radius ?? radius;

      inProgressObject.length = getLength(inProgressObject);

      this._stopDrawing();
      emitInProgressUpdates();
    },

    createCircle(center, radius) {
      inProgressObject = createCircleModel({ center, radius });

      this._startDrawing();
      emitInProgressUpdates();
    },

    setCircle(center, radius) {
      if (!inProgressObject || inProgressObject.type !== "circle") return;

      inProgressObject.center = center;
      inProgressObject.radius = radius;

      emitInProgressUpdates();
    },

    createFreeFormLine(point) {
      inProgressObject = createFreeFormLineModel({ points: point });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToFreeFormLine(point) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;
      inProgressObject.area = getArea(inProgressObject);

      inProgressObject.points.push(...point);
      emitInProgressUpdates();
    },

    setFreeFormLine(points) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;
      inProgressObject.points = points;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    commitObject() {
      if (!inProgressObject) return;
      this.addObject(inProgressObject);

      inProgressObject = null;
      emitInProgressUpdates();
    },

    addObject(object) {
      if (!object) {
        console.warn("Attempting to add null object");
        return;
      }

      const { id } = object;

      if ("area" in object) {
        object.area = getArea(object);
      }
      if ("length" in object) {
        object.length = getLength(object);
      }

      state = {
        ...state,
        objects: { ...state.objects, [id]: object },
        childToParentMap: { ...state.childToParentMap, [id]: null },
      };
      history.execute(new AddObjectCommand(object), this);

      emit();
    },

    deleteObjectById(id) {
      const node = this.getNode(id);
      history.execute(new DeleteObjectCommand(node), this);
      emit();
    },

    cancelShape() {
      inProgressObject = null;
      this._stopDrawing();
      emit();
    },

    _addObject(object) {
      const { id } = object;

      state = {
        ...state,
        objects: { ...state.objects, [id]: object },
        childToParentMap: { ...state.childToParentMap, [id]: null },
      };
    },

    _removeObject(id) {
      const newObjects = { ...state.objects };
      delete newObjects[id];

      const newChildToParentMap = { ...state.childToParentMap };
      delete newChildToParentMap[id];

      state = {
        ...state,
        objects: newObjects,
        childToParentMap: newChildToParentMap,
      };
    },

    undo() {
      history.undo(this);
      emit();
    },

    redo() {
      history.redo(this);
      emit();
    },

    clear() {
      state = {
        ...state,
        objects: {},
        childToParentMap: {},
      };
      emit();

      inProgressObject = null;
      emitInProgressUpdates();
    },
  };
}
