// drawing/core/engine.ts

import type { Listener, DrawingState, DrawingEngine } from "./types";

import { DrawableObject } from "../geometry/types";
import { createLineModel } from "../geometry/domain/LineModel";
import { createCircleModel } from "../geometry/domain/CircleModel";
import { createTwoPointLineModel } from "../geometry/domain/TwoPointLineModel";
import { createFreeFormLineModel } from "../geometry/domain/FreeFormLineModel";
import { getArea, getLength } from "./measure";
import { version } from "react";

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
    tool: "line",
    ...initial,
  };

  let inProgressUpdates: number = 0;
  let inProgressObject: DrawableObject | null = null;

  let transientSnapshot = {
    version: inProgressUpdates,
    inProgressObject,
  };

  const listeners = new Set<Listener>();
  const transientListeners = new Set<Listener>();

  const emit = () => listeners.forEach((l) => l());
  const emitInProgressUpdates = () => {
    inProgressUpdates++;
    if (!inProgressObject) {
      transientSnapshot = { version: inProgressUpdates, inProgressObject };
      transientListeners.forEach((l) => l());
    }

    if ("area" in inProgressObject) {
      inProgressObject.area = getArea(inProgressObject);
    }
    if ("length" in inProgressObject) {
      inProgressObject.length = getLength(inProgressObject);
    }

    // only update version so that inProgressObject reference is preserved for better performance in react-konva.
    transientSnapshot = { version: inProgressUpdates, inProgressObject };
    transientListeners.forEach((l) => l());
  };

  return {
    getState() {
      return state;
    },

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
      state.mode = "drawing";

      emitInProgressUpdates();
    },

    endStraightline(point) {
      if (inProgressObject === null || inProgressObject.type !== "line") return;

      inProgressObject.end = point;
      state.mode = "idle";

      emitInProgressUpdates();
    },

    createTwoPointline(start, radius) {
      inProgressObject = createTwoPointLineModel({ start, radius });
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
      inProgressObject = createCircleModel({ center, radius });
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

    createFreeFormLine(point) {
      inProgressObject = createFreeFormLineModel({ points: point });
      state.mode = "drawing";
      emitInProgressUpdates();
    },

    appendPointToFreeFormLine(point) {
      if (!inProgressObject || inProgressObject.type !== "freeFormLine") return;

      inProgressObject.points.push(...point);
      emitInProgressUpdates();
    },

    setFreeFormLine(points) {
      if (!inProgressObject || inProgressObject.type !== "freeFormLine") return;
      inProgressObject.points = points;
      emitInProgressUpdates();
    },

    commitObject() {
      if (!inProgressObject) return;
      const { id } = inProgressObject;

      if ("area" in inProgressObject) {
        inProgressObject.area = getArea(inProgressObject);
      }
      if ("length" in inProgressObject) {
        inProgressObject.length = getLength(inProgressObject);
      }

      state = {
        ...state,
        objects: { ...state.objects, [id]: inProgressObject },
        childToParentMap: { ...state.childToParentMap, [id]: null },
        mode: "idle",
      };
      emit();

      inProgressObject = null;
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
