// drawing/tools/twoPointLineTool.ts
import type { DrawingTool, ToolContext } from "./types";
import type { Point } from "../core/types";

export function createTwoPointLineTool(): DrawingTool {
  let firstPoint: Point | null = null;

  return {
    onPointerDown(_, ctx: ToolContext) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;

      if (!firstPoint) {
        // Store first point on first click
        firstPoint = [pos.x, pos.y];
        ctx.engine.createTwoPointline(firstPoint);
      } else {
        ctx.engine.endTwoPointline([pos.x, pos.y]);
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

      const secondPoint: Point = [pos.x, pos.y];

      // set up active stroke points to be the line between firstPoint and current mouse position
      ctx.engine.endTwoPointline(secondPoint);
    },

    // onPointerUp(_, ctx: ToolContext) {
    //   // Nothing needed on pointer up for this tool
    // },
  };
}
