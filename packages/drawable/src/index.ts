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
export { createTwoPointLineTool } from "./tools/twoPointLineTool";

// === Types ===
export type {
  Point,
  ToolType,
  DrawingMode,
  DrawableObject,
  ObjectTable,
  ChildToParentMap,
  Listener,
  FreeFormLineModel,
  LineModel,
  TwoPointLineModel,
  CircleModel,
  LineWithMarkersModel,
  DrawingState,
  DrawingEngine,
} from "./core/types";

export type { DrawingTool, ToolContext } from "./tools/types";
