// drawing/tools/lineSegmentTool.ts

import type { DrawingTool, ToolContext } from "./types";
import type { Point } from "../geometry/types";
import Konva from "konva";

export function createLineSegmentTool(): DrawingTool {
  let firstPoint: Point | null = null;

  return {
    type: "lineSegment",
    onPointerDown(_, ctx: ToolContext) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;

      const { x, y } = pos;

      if (!firstPoint) {
        // Store first point on first click
        firstPoint = { x, y };
        ctx.engine.createLineSegment(firstPoint);
      } else {
        ctx.engine.endLineSegment({ x, y });
        ctx.engine.commitObject();

        // Reset for next line
        firstPoint = null;
      }
    },

    // show a live preview of line as user moves mouse after first click
    onPointerMove(_, ctx: ToolContext) {
      if (!firstPoint) return;

      const pos = ctx.getPointerPosition();
      if (!pos) return;

      const secondPoint: Point = { x: pos.x, y: pos.y };

      // set up active stroke points to be the line between firstPoint and current mouse position
      ctx.engine.endLineSegment(secondPoint);
    },

    // onPointerUp(_, ctx: ToolContext) {
    //   // Nothing needed on pointer up for this tool
    // },

    renderPreview(group, obj, ctx) {
      if (obj.type !== "lineSegment") return;
      const { start, end, radius } = obj;

      const { style } = ctx.engine.getEditorState();
      const strokeColor = style.strokeColor || "black";
      const strokeWidth = style.strokeWidth || 1;

      const line = new Konva.Line({
        points: [start.x, start.y, end.x, end.y],
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        lineCap: "round",
        lineJoin: "round",
      });

      const startCircle = new Konva.Circle({
        x: start.x,
        y: start.y,
        radius,
        stroke: strokeColor,
      });

      const endCircle = new Konva.Circle({
        x: end.x,
        y: end.y,
        radius,
        stroke: strokeColor,
      });

      group.add(line);
      group.add(startCircle);
      group.add(endCircle);
    },
  };
}
