// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";
import { deriveLabelPosition } from "../core/measure";
import { LABEL_FONT_SIZE_DEFAULT, LABEL_PADDING_DEFAULT } from "../constants";

export function createFreeDrawTool(): DrawingTool {
  // free draw tool doesn't require DOM event e, thus we can ignore it with _
  return {
    type: "freeDraw",
    onPointerDown(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;
      ctx.engine.createFreeFormLine([{ x, y }]);
    },

    onPointerMove(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;
      ctx.engine.appendPointToFreeFormLine({ x, y });
    },

    onPointerUp(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;

      ctx.engine.appendPointToFreeFormLine({ x, y });
      ctx.engine.commitObject();
    },

    renderPreview(group, obj, ctx) {
      // TODO: use ctx to allow labels to be boundary aware

      if (obj.type !== "freeDraw") return;

      const { x, y } = deriveLabelPosition(obj);
      const value = String(obj["area"]);

      const label = new Konva.Label({ x, y });
      const tag = new Konva.Tag({ opacity: 1 });
      const text = new Konva.Text({
        text: value,
        fontSize: LABEL_FONT_SIZE_DEFAULT,
        padding: LABEL_PADDING_DEFAULT,
      });

      label.add(tag);
      label.add(text);

      const { style } = ctx.engine.getEditorState();
      const strokeColor = style.strokeColor || "black";
      const strokeWidth = style.strokeWidth || 0.002;

      const line = new Konva.Line({
        points: obj.points.flatMap((point) => [point.x, point.y]),
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        lineCap: "round",
        lineJoin: "round",
      });
      group.add(label);
      group.add(line);
    },
  };
}
