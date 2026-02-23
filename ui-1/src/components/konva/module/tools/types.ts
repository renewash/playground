// drawing/tools/types.ts

import { type DrawingEngine } from "../core/engine";

export interface ToolContext {
  engine: DrawingEngine;
  getPointerPosition(): { x: number; y: number } | null;
}

export interface DrawingTool {
  onPointerDown?(e: PointerEvent, ctx: ToolContext): void;
  onPointerMove?(e: PointerEvent, ctx: ToolContext): void;
  onPointerUp?(e: PointerEvent, ctx: ToolContext): void;
  onKeyDown?(e: KeyboardEvent, ctx: ToolContext): void;
}
