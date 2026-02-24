// drawing/core/engine.ts

import type {
  DrawingState,
  Point,
  Stroke,
  Shape,
  Shapes,
  ShapeData,
  Circle,
} from "./types";

type Listener = () => void;

export interface DrawingEngine {
  getState(): DrawingState;
  subscribe(listener: Listener): () => void;
  replaceActiveShape(data: ShapeData): void;
  start(point: Point): void;
  appendStrokeData(point: Point): void;
  updateCircle(center: Point, radius: number): void;
  getActiveShape(): DrawingState["activeShape"];
  getCommitedShapes(): Shapes;
  end(): void;
  cancelShape(): void;

  undo(): void;
  clear(): void;
}

export function createDrawingEngine(
  initial?: Partial<DrawingState>,
): DrawingEngine {
  let state: DrawingState = {
    shapes: [],
    activeShape: null,
    mode: "idle",
    tool: "freeDraw",
    ...initial,
  };

  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l());

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

    replaceActiveShape(data) {
      if (!state.activeShape) return;

      if ("points" in data) {
        state.activeShape.points = data.points;
      } else if ("center" in data && "radius" in data) {
        state.activeShape.center = data.center;
        state.activeShape.radius = data.radius;
      }

      emit();
    },

    start(data) {
      if (state.mode === "drawing") return;
      const newShape: Partial<Shape> = { id: crypto.randomUUID() };

      if (state.tool === "twoPointLine") {
        newShape[type] = "circle";
        newShape[center] = point;
        newShape[radius] = 0;
      } else {
        // const newShape = {
        //   id,
        //   type: "stroke",
        //   points: [...point],
        // };
      }

      setState({
        ...state,
        activeShape: newShape,
        mode: "drawing",
      });
    },

    appendStrokeData(point) {
      if (!state.activeShape || state.activeShape.type !== "stroke") return;

      state.activeShape.points.push(...point);
      emit();
    },

    updateCircle(center, radius) {
      if (!state.activeShape || state.activeShape.type !== "circle") return;

      state.activeShape.center = center;
      state.activeShape.radius = radius;

      emit(); // Only for state observers; renderer may optimize
    },

    getActiveShape() {
      return state.activeShape;
    },

    getCommitedShapes() {
      return state.shapes;
    },

    end() {
      if (!state.activeShape) return;

      setState({
        shapes: [...state.shapes, state.activeShape],
        activeShape: null,
        mode: "idle",
      });
    },

    cancelShape() {
      setState({
        ...state,
        activeShape: null,
        mode: "idle",
      });
    },

    undo() {
      if (!state.shapes.length) return;

      setState({
        ...state,
        shapes: state.shapes.slice(0, -1),
      });
    },

    clear() {
      setState({
        shapes: [],
        activeShape: null,
        mode: "idle",
      });
    },
  };
}
