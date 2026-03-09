// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";
import { calculateDefaultPosition } from "../core/measure";

export function createFreeDrawTool(): DrawingTool {
  // free draw tool doesn't require DOM event e, thus we can ignore it with _
  return {
    type: "freeDraw",
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

      const position = calculateDefaultPosition(obj, 100, 30);
      const value = String(obj["area"]);

      const label = new Konva.Label({ x: position[0], y: position[1] });
      const tag = new Konva.Tag({ opacity: 1 });
      const text = new Konva.Text({
        text: value,
        fontSize: 12,
        padding: 2,
      });

      label.add(tag);
      label.add(text);

      const line = new Konva.Line({
        points: obj.points,
        stroke: "green",
        strokeWidth: 3,
        lineCap: "round",
        lineJoin: "round",
      });
      group.add(label).add(line);
      // group.add(line);
    },
  };
}
