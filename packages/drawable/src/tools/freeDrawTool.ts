// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";

export function createFreeDrawTool(): DrawingTool {
  // free draw tool doesn't require DOM event e, thus we can ignore it with _
  return {
    onPointerDown(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      ctx.engine.createFreeFormLine([pos.x, pos.y]);
    },

    onPointerMove(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      ctx.engine.appendPointToFreeFormLine([pos.x, pos.y]);
    },

    onPointerUp(_, ctx) {
      ctx.engine.commitObject();
    },

    renderPreview(group, obj) {
      if (obj.type !== "freeFormLine") return;

      const line = new Konva.Line({
        points: obj.points,
        stroke: "blue",
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
      });

      group.add(line);
    },
  };
}
