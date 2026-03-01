// drawing/tools/types.ts

import { type DrawingEngine } from "../core/types";

export interface ToolContext {
  engine: DrawingEngine;
  getPointerPosition(): { x: number; y: number } | null;
  // setActiveLinePoints(points: number[]): void;
  // syncActiveLineWithEngine(): void;
}

// define an interface for drawing tools
// isolates the drawing logic from react and konva
// ctx contains engine and additional helper functions
export interface DrawingTool {
  onPointerDown?(e: PointerEvent, ctx: ToolContext): void;
  onPointerMove?(e: PointerEvent, ctx: ToolContext): void;
  onPointerUp?(e: PointerEvent, ctx: ToolContext): void;
  onKeyDown?(e: KeyboardEvent, ctx: ToolContext): void;
}
