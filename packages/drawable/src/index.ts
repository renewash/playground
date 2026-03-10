export { createDrawingEngine } from "./core/engine";

// === Geometry ===
export {
  calculateArea,
  calculateEuclideanDistance,
} from "./geometry/calculate";
export {
  normalisePoint,
  normaliseAllPoints,
  denormalisePoint,
  denormaliseAllPoints,
} from "./geometry/normalise";

// === Tools ===
export { createFreeDrawTool } from "./tools/freeDrawTool";
export { createLineSegmentTool } from "./tools/lineSegmentTool";

// === Types ===
export type {
  ToolType,
  DrawingMode,
  ObjectTable,
  ChildToParentMap,
  Listener,
  DrawingState,
  DrawingEngine,
} from "./core/types";

export type {
  Point,
  DrawableObject,
  FreeFormLineModel,
  LineModel,
  LineSegmentModel,
  CircleModel,
  LineWithMarkersModel,
} from "./geometry/types";

export type { DrawingTool, ToolContext } from "./tools/types";
