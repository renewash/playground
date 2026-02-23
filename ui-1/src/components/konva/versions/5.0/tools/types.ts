// drawing/tools/types.ts

import { type DrawingEngine } from "../core/engine";

export interface ToolContext {
  engine: DrawingEngine;
  getPointerPosition(): { x: number; y: number } | null;
  // setActiveLinePoints(points: number[]): void;
  // syncActiveLineWithEngine(): void;
}

// define an interface for drawing tools
// accepts dom events and a context object with the engine and helper functions
// isolates the drawing logic from the react component and konva event system
export interface DrawingTool {
  onPointerDown?(e: PointerEvent, ctx: ToolContext): void;
  onPointerMove?(e: PointerEvent, ctx: ToolContext): void;
  onPointerUp?(e: PointerEvent, ctx: ToolContext): void;
  onKeyDown?(e: KeyboardEvent, ctx: ToolContext): void;
}
