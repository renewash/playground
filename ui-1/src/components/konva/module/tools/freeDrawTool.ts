// drawing/tools/freeDrawTool.ts

import { type DrawingTool } from "./types";

export function createFreeDrawTool(): DrawingTool {
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
