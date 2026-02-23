// drawing/tools/freeDrawTool.ts

import { type DrawingTool } from "./types";

export function createFreeDrawTool(): DrawingTool {
  // free draw tool doesn't require DOM event e, thus we can ignore it with _
  return {
    onPointerDown(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      ctx.engine.startStroke([pos.x, pos.y]);
    },

    onPointerMove(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      ctx.engine.appendPoint([pos.x, pos.y]);
    },

    onPointerUp(_, ctx) {
      ctx.engine.commitStroke();
    },
  };
}
