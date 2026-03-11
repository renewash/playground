export { createDrawingEngine } from "./core/engine";

export { getArea, getLength, calculateDefaultPosition } from "./core/measure";

// === Domain ===
export { createCircleModel } from "./geometry/domain/CircleModel";
export { createLineSegmentModel } from "./geometry/domain/LineSegmentModel";
export { createFreeDrawModel } from "./geometry/domain/FreeDrawModel";

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
  EditorState,
} from "./core/types";

export type {
  Point,
  DrawableObject,
  FreeDrawModel,
  LineModel,
  LineSegmentModel,
  CircleModel,
  LineWithMarkersModel,
} from "./geometry/types";

export type { DrawingTool, ToolContext } from "./tools/types";
