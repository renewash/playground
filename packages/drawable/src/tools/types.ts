// drawing/tools/types.ts

import type { DrawingEngine } from "../core/types";
import type { DrawableObject } from "../geometry/types";
import Konva from "konva";

export interface ToolContext {
  engine: DrawingEngine;
  getPointerPosition(): { x: number; y: number } | null;
}

// define an interface for drawing tools
// isolates the drawing logic from react and konva
// ctx contains engine and additional helper functions
export interface DrawingTool {
  type: string;
  onPointerDown?(e: PointerEvent, ctx: ToolContext): void;
  onPointerMove?(e: PointerEvent, ctx: ToolContext): void;
  onPointerUp?(e: PointerEvent, ctx: ToolContext): void;
  onKeyDown?(e: KeyboardEvent, ctx: ToolContext): void;
  onDoubleClick?(e: MouseEvent, ctx: ToolContext): void;

  renderPreview?(
    group: Konva.Group,
    obj: DrawableObject,
    ctx: ToolContext,
  ): void;
}
