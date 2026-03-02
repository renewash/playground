// drawing/core/engine.ts

import type {
  StrokeModel,
  CircleModel,
  LineModel,
  TwoPointLineModel,
  DrawableObject,
  Listener,
  DrawingState,
  DrawingEngine,
} from "./types";

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
    mode: "idle",
    tool: "freeDraw",
    ...initial,
  };

  let inProgressObject: DrawableObject | null = null;

  const listeners = new Set<Listener>();
  const transientListeners = new Set<Listener>();

  const emit = () => listeners.forEach((l) => l());
  const emitInProgressUpdates = () => transientListeners.forEach((l) => l());

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    subscribeTransient(listener) {
      transientListeners.add(listener);
      return () => transientListeners.delete(listener);
    },

    getInProgressObject() {
      return inProgressObject;
    },

    getCommitedObjects() {
      return state.objects;
    },

    getParentId(nodeId) {
      if (nodeId in state.childToParentMap === false) {
        return null;
      }

      return state.childToParentMap[nodeId];
    },

    getNode(nodeId) {
      if (nodeId in state.objects === false) {
        return null;
      }
      return state.objects[nodeId];
    },

    createStraightline(point) {
      const line: LineModel = {
        id: crypto.randomUUID(),
        type: "line",
        start: point,
        end: point,
      };

      inProgressObject = line;
      state.mode = "drawing";
      emitInProgressUpdates();
    },

    endStraightline(point) {
      if (inProgressObject === null || inProgressObject.type !== "line") return;

      inProgressObject.end = point;
      state.mode = "idle";
      emitInProgressUpdates();
    },

    createTwoPointline(point, radius) {
      const fixedRadius = 3;
      const line: TwoPointLineModel = {
        id: crypto.randomUUID(),
        type: "twoPointLine",
        start: point,
        end: point,
        radius: radius ?? fixedRadius,
      };

      inProgressObject = line;
      state.mode = "drawing";
      emitInProgressUpdates();
    },

    endTwoPointline(point, radius) {
      if (inProgressObject === null || inProgressObject.type !== "twoPointLine")
        return;

      inProgressObject.end = point;
      inProgressObject.radius = radius ?? inProgressObject.radius;
      state.mode = "idle";
      emitInProgressUpdates();
    },

    createCircle(center, radius) {
      const circle: CircleModel = {
        id: crypto.randomUUID(),
        type: "circle",
        center,
        radius,
      };
      inProgressObject = circle;
      state.mode = "drawing";
      state.tool = "circle";
      emitInProgressUpdates();
    },

    setCircle(center, radius) {
      if (!inProgressObject || inProgressObject.type !== "circle") return;

      inProgressObject.center = center;
      inProgressObject.radius = radius;

      emitInProgressUpdates();
    },

    createStroke(point) {
      const stroke: StrokeModel = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [...point],
      };

      inProgressObject = stroke;
      state.mode = "drawing";
      emitInProgressUpdates();
    },

    appendPointToStroke(point) {
      if (!inProgressObject || inProgressObject.type !== "stroke") return;

      inProgressObject.points.push(...point);
      emitInProgressUpdates();
    },

    setStroke(points) {
      if (!inProgressObject || inProgressObject.type !== "stroke") return;
      inProgressObject.points = points;
      emitInProgressUpdates();
    },

    commitObject() {
      if (!inProgressObject) return;
      const { id } = inProgressObject;

      state = {
        ...state,
        objects: { ...state.objects, [id]: inProgressObject },
        childToParentMap: { ...state.childToParentMap, [id]: null },
        mode: "idle",
      };
      emit();

      inProgressObject = null;
      console.log("commit null");
      emitInProgressUpdates();
    },

    cancelShape() {
      inProgressObject = null;
      emit();
    },

    undo() {
      // TODO: Implement undo
    },

    redo() {
      // TODO: Implement redo
    },

    clear() {
      state = {
        ...state,
        objects: {},
        childToParentMap: {},
        mode: "idle",
      };
      emit();

      inProgressObject = null;
      emitInProgressUpdates();
    },
  };
}
