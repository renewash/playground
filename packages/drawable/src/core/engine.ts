// drawing/core/engine.ts

import { getArea, getLength } from "./measure";
import History, { AddObjectCommand, DeleteObjectCommand } from "./history";

import type {
  Listener,
  DrawingState,
  DrawingEngine,
  EditorState,
  TransientSnapshot,
  ToolType,
  ToolSet,
} from "./types";

import { DrawableObject } from "../geometry/types";
import { createLineModel } from "../geometry/domain/LineModel";
import { createCircleModel } from "../geometry/domain/CircleModel";
import { createLineSegmentModel } from "../geometry/domain/LineSegmentModel";
import { createFreeDrawModel } from "../geometry/domain/FreeDrawModel";
import { createPolygonSegmentModel } from "../geometry/domain/PolygonSegment";

import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";
import { createPolygonSegmentTool } from "../tools/polygonSegmentTool";

import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../constants";

interface CreateDrawingEngineOptions {
  initialState?: Partial<DrawingState>;
  initialTool?: ToolType;
  editable?: boolean;
}

/**
 * Holds internal state of canvas and defines mutation logic.
 * This engine manages objects and drawings.
 * Objects are primatives (a single Konva shape) or composites shapes (multiple primatives) represented as a graph.
 * Transient objects holds the state of a drawing that is in progress, such as a line being drawn.
 *
 * @param initial - Optional starting state for the engine.
 * @returns A fresh DrawingEngine instance.
 */
export function createDrawingEngine({
  initialState = {},
  initialTool = "lineSegment",
  editable = true,
}: CreateDrawingEngineOptions = {}): DrawingEngine {
  let state: DrawingState = {
    objects: {},
    childToParentMap: {},
    ...initialState,
  };

  // TODO: fix design so tools are registered outside of the engine and this fallback is not necessary
  const toolSet: Partial<ToolSet> = {
    freeDraw: createFreeDrawTool(),
    lineSegment: createLineSegmentTool(),
    polygonSegment: createPolygonSegmentTool(),
  };

  let editorState: EditorState = {
    mode: "idle",
    tool: toolSet[initialTool] || createLineSegmentTool(),
    style: {
      strokeWidth: STROKE_WIDTH_DEFAULT,
      strokeColor: STROKE_COLOR_DEFAULT,
    },
    editable,
  };

  const history = new History();

  let inProgressUpdates: number = 0;
  let inProgressObject: DrawableObject | null = null;

  let transientSnapshot: TransientSnapshot = {
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

    setStrokeColor(color) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          strokeColor: color,
        },
      };
      emitEditorUpdate();
    },

    setStrokeWidth(width) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          strokeWidth: width,
        },
      };
      emitEditorUpdate();
    },

    toggleEditable() {
      editorState = {
        ...editorState,
        editable: !editorState.editable,
      };
      emitEditorUpdate();
    },

    getTool() {
      return editorState.tool;
    },

    pickTool(toolName) {
      const tool = toolName as keyof typeof toolSet;
      // TODO: fix design so this fallback is not necessary
      this.setTool(toolSet[tool] ?? createLineSegmentTool());
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
      inProgressObject = createLineModel({
        start: point,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endStraightline(point) {
      if (inProgressObject === null || inProgressObject.type !== "line") return;
      inProgressObject.end = point;

      emitInProgressUpdates();
    },

    createTwoPointline(start, radius) {
      inProgressObject = createLineSegmentModel({
        start,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endTwoPointline(point, radius) {
      if (inProgressObject === null || inProgressObject.type !== "lineSegment")
        return;

      inProgressObject.end = point;
      inProgressObject.radius = inProgressObject.radius ?? radius;

      inProgressObject.length = getLength(inProgressObject);

      emitInProgressUpdates();
    },

    createCircle(center, radius) {
      inProgressObject = createCircleModel({
        center,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    setCircle(center, radius) {
      if (!inProgressObject || inProgressObject.type !== "circle") return;

      inProgressObject.center = center;
      inProgressObject.radius = radius;

      emitInProgressUpdates();
    },

    createFreeFormLine(points) {
      inProgressObject = createFreeDrawModel({
        points,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToFreeFormLine(point) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;
      inProgressObject.area = getArea(inProgressObject);

      inProgressObject.points.push(point);
      inProgressObject.pixelPoints.push(point.x, point.y);

      emitInProgressUpdates();
    },

    setFreeFormLine(points) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;
      inProgressObject.points = points;
      inProgressObject.pixelPoints = points.flatMap((point) => [
        point.x,
        point.y,
      ]);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    createPolygonSegment(points, radius) {
      inProgressObject = createPolygonSegmentModel({
        points,
        radius,
        style: editorState.style,
      });
      emitInProgressUpdates();
    },

    appendPointToPolygonSegment(point) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points.push(point);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    setPolygonSegment(points, radius) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points = points;
      inProgressObject.radius = inProgressObject.radius ?? radius;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    replaceLastPointOfPolygonSegment(point) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      const n = inProgressObject.points.length;
      if (n < 2) return;

      inProgressObject.points[n - 1] = point;
      inProgressObject.area = getArea(inProgressObject);
      emitInProgressUpdates();
    },

    removeLastPointOfPolygonSegment() {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      const n = inProgressObject.points.length;
      if (n < 2) return;

      inProgressObject.points.pop();
      inProgressObject.area = getArea(inProgressObject);
      emitInProgressUpdates();
    },

    commitObject() {
      if (!inProgressObject) return;
      // TODO: deep clone inProgressObject to prevent future mutations from affecting the commited object
      // can do something like const finalized = finalizeObject(inProgressObject);
      history.execute(new AddObjectCommand(inProgressObject), this);
      emit();

      inProgressObject = null;
      this._stopDrawing();

      emitInProgressUpdates();
    },

    deleteObjectById(id) {
      const node = this.getNode(id);
      if (!node) {
        console.warn(`Attempting to delete non existent node with id ${id}`);
        return;
      }

      history.execute(new DeleteObjectCommand(node), this);
      emit();
    },

    cancelDrawing() {
      inProgressObject = null;
      this._stopDrawing();
      emit();
    },

    _addObject(object) {
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

    getSerializedState() {
      return JSON.stringify(state);
    },

    setSerializedState(serializedState) {
      try {
        const parsedState = JSON.parse(serializedState);
        state = {
          ...state,
          ...parsedState,
        };
        emit();
      } catch (e) {
        console.error("Failed to parse serialized state:", e);
      }
    },
  };
}
