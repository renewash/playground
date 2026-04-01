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

import { createLineSegmentModel } from "../geometry/domain/LineSegmentModel";
import { createFreeDrawModel } from "../geometry/domain/FreeDrawModel";
import { createPolygonSegmentModel } from "../geometry/domain/PolygonSegment";

import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";
import { createPolygonSegmentTool } from "../tools/polygonSegmentTool";

import config from "../config";

// Architecture
// Engine (single source of truth and mutations)
// ├── Tools (handle user input and call engine APIs)
// ├── Geometry (models + calculations)
// ├── History (undo/redo)
// └── UI (renderer, e.g. React/Konva)

// Concepts

// Transient state (`inProgressObject`)
// Mutable, used during drawing

// Committed state (`objects`)
// Immutable snapshots stored in history

// Unidirectional flow:
// Tool → Engine → State → UI

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
    showLabels: false,
    style: { ...config.defaultDrawableObjectStyle },
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

    setState(newState) {
      const validNewState = this._verifyState(newState);

      if (!validNewState) {
        console.error("Attempted to set invalid state:", newState);
        return;
      }

      history.clear();
      this.cancelDrawing();
      state = { ...newState };

      emit();
    },

    _verifyState(newState) {
      // Basic verification to prevent setting malformed state
      if (
        typeof newState !== "object" ||
        newState === null ||
        !("objects" in newState) ||
        !("childToParentMap" in newState)
      ) {
        return false;
      }
      return true;
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

    setStrokeOpacity(opacity) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          strokeOpacity: opacity,
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

    setFillColor(color) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          fillColor: color,
        },
      };
      emitEditorUpdate();
    },

    setEditable(editable) {
      editorState = {
        ...editorState,
        editable,
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
    setShowLabels(show) {
      editorState = {
        ...editorState,
        showLabels: show,
        style: {
          ...editorState.style,
        },
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
      editorState = {
        ...editorState,
        mode: "drawing",
      };
      emitEditorUpdate();
    },

    _stopDrawing() {
      editorState = {
        ...editorState,
        mode: "idle",
      };
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

    getCommittedObjects() {
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

    createLineSegment(start, radius) {
      if (editorState.editable === false) return;

      inProgressObject = createLineSegmentModel({
        start,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endLineSegment(point, radius) {
      if (editorState.editable === false) return;

      if (inProgressObject === null || inProgressObject.type !== "lineSegment")
        return;

      inProgressObject.end = point;
      inProgressObject.radius = inProgressObject.radius ?? radius;

      inProgressObject.length = getLength(inProgressObject);

      emitInProgressUpdates();
    },

    createFreeFormLine(points) {
      if (editorState.editable === false) return;

      inProgressObject = createFreeDrawModel({
        points,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToFreeFormLine(point) {
      if (editorState.editable === false) return;

      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;

      inProgressObject.points.push(point);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    setFreeFormLine(points) {
      if (editorState.editable === false) return;

      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;

      inProgressObject.points = points;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    createPolygonSegment(points, radius) {
      if (editorState.editable === false) return;

      inProgressObject = createPolygonSegmentModel({
        points,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToPolygonSegment(point) {
      if (editorState.editable === false) return;

      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points.push(point);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    setPolygonSegment(points, radius) {
      if (editorState.editable === false) return;

      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points = points;
      inProgressObject.radius = inProgressObject.radius ?? radius;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    replaceLastPointOfPolygonSegment(point) {
      if (editorState.editable === false) return;

      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      const n = inProgressObject.points.length;
      if (n < 2) return;

      inProgressObject.points[n - 1] = point;
      inProgressObject.area = getArea(inProgressObject);
      emitInProgressUpdates();
    },

    removeLastPointOfPolygonSegment() {
      if (editorState.editable === false) return;

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

      // Deep clone inProgressObject, reduces risks of mutations to commited objects
      // ensuring history commands have immutable state
      const clone = structuredClone(inProgressObject);
      history.execute(new AddObjectCommand(clone), this);
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
      emitInProgressUpdates();
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
