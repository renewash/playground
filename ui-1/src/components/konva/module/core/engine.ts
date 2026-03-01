// drawing/core/engine.ts

import type {
  StrokeModel,
  CircleModel,
  LineModel,
  TwoPointLineModel,
  Listener,
  DrawingState,
  DrawingEngine,
} from "./types";

/**
 * Holds internal state of canvas and defines mutation logic.
 * @param initial
 * @returns
 */
export function createDrawingEngine(
  initial?: Partial<DrawingState>,
): DrawingEngine {
  let state: DrawingState = {
    objects: {},
    childToParentMap: {},
    inProgressObject: null,
    mode: "idle",
    tool: "freeDraw",
    ...initial,
  };

  const listeners = new Set<Listener>();
  const emit = () =>
    listeners.forEach((l) => {
      return l();
    });

  const setState = (next: DrawingState) => {
    state = next;
    emit();
  };

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getInProgressObject() {
      return state.inProgressObject;
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

      state.inProgressObject = line;
      state.mode = "drawing";
      emit();
    },

    endStraightline(point) {
      if (
        state.inProgressObject === null ||
        state.inProgressObject.type !== "line"
      )
        return;

      state.inProgressObject.end = point;
      state.mode = "idle";
      emit();
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

      state.inProgressObject = line;
      state.mode = "drawing";
      emit();
    },

    endTwoPointline(point, radius) {
      if (
        state.inProgressObject === null ||
        state.inProgressObject.type !== "twoPointLine"
      )
        return;

      state.inProgressObject.end = point;
      state.inProgressObject.radius = radius ?? state.inProgressObject.radius;
      state.mode = "idle";
      emit();
    },

    createCircle(center, radius) {
      const circle: CircleModel = {
        id: crypto.randomUUID(),
        type: "circle",
        center,
        radius,
      };
      state.inProgressObject = circle;
      state.mode = "drawing";
      state.tool = "circle";
      emit();
    },

    setCircle(center, radius) {
      if (!state.inProgressObject || state.inProgressObject.type !== "circle")
        return;

      state.inProgressObject.center = center;
      state.inProgressObject.radius = radius;

      emit();
    },

    createStroke(point) {
      const stroke: StrokeModel = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [...point],
      };

      state.inProgressObject = stroke;
      state.mode = "drawing";
      emit();
    },

    appendPointToStroke(point) {
      if (!state.inProgressObject || state.inProgressObject.type !== "stroke")
        return;

      state.inProgressObject.points.push(...point);
      emit();
    },

    setStroke(points) {
      if (!state.inProgressObject || state.inProgressObject.type !== "stroke")
        return;

      state.inProgressObject.points = points;
      emit();
    },

    commitObject() {
      if (!state.inProgressObject) return;
      const { inProgressObject } = state;
      const { id } = inProgressObject;

      setState({
        ...state,
        objects: { ...state.objects, [id]: inProgressObject },
        childToParentMap: { ...state.childToParentMap, [id]: null },
        inProgressObject: null,
        mode: "idle",
      });
      emit();
    },

    cancelShape() {
      setState({
        ...state,
        inProgressObject: null,
        mode: "idle",
      });
    },

    undo() {
      if (!state.objects.length) return;
      // TODO: Implement undo
    },

    redo() {
      // TODO: Implement redo
    },

    clear() {
      setState({
        ...state,
        objects: {},
        childToParentMap: {},
        inProgressObject: null,
        mode: "idle",
      });
    },
  };
}
