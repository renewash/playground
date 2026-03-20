// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";
import { calculateDefaultPosition } from "../core/measure";
import { Point } from "../geometry/types";
import {
  LABEL_PADDING_DEFAULT,
  LABEL_FONT_SIZE_DEFAULT,
  TWO_POINT_LINE_RADIUS_DEFAULT,
} from "../constants";

export function createPolygonSegmentTool(): DrawingTool {
  const DOUBLE_CLICK_THRESHOLD = 250; // milliseconds
  let lastClickTime = 0;
  let lastClickPos: Point = { x: -10, y: -10 };
  let firstPoint: Point | null = null;

  const handleSingleClick = (ctx: any) => {
    const pos = ctx.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;

    if (!firstPoint) {
      firstPoint = { x, y };

      // create a temporary line (using currentLastPoint) to show:
      // real time preview of line as user moves their pointer
      const currentLastPoint = { x, y };
      ctx.engine.createPolygonSegment(
        [firstPoint, currentLastPoint],
        TWO_POINT_LINE_RADIUS_DEFAULT,
      );

      return;
    }

    // check if click is same as last point, if so ignore (prevents creating duplicate points on click)
    const object = ctx.engine.getInProgressObject();
    const n = object.points.length;

    const invalidObject = !object || object.type !== "polygonSegment" || n < 2;

    if (invalidObject) {
      console.warn(
        "Invalid object state in polygon segment tool. Expected a polygon segment with at least 2 points.",
      );
      return;
    }

    const lastMarker = object.points[n - 2]!;
    const currentPointSameAsLastMarker =
      lastMarker.x === x && lastMarker.y === y;

    if (currentPointSameAsLastMarker) return;
    ctx.engine.replaceLastPointOfPolygonSegment({ x, y });
    ctx.engine.appendPointToPolygonSegment({ x, y });

    return;
  };

  const handleDoubleClick = (ctx: any) => {
    if (!firstPoint) return;

    const pos = ctx.getPointerPosition();
    if (!pos) return;

    const object = ctx.engine.getInProgressObject();
    const n = object.points.length;

    if (!object || object.type !== "polygonSegment") return;

    const lastMarker = object.points[n - 2];
    const { x, y } = pos;

    if (lastMarker.x !== x && lastMarker.y !== y) {
      return;
    }

    if (n <= 3) return;
    ctx.engine.removeLastPointOfPolygonSegment();

    ctx.engine.commitObject();
    firstPoint = null;
  };

  return {
    type: "polygonSegment",
    onPointerDown(_, ctx) {
      const now = performance.now();
      const timeDiffBetweenClicks = now - lastClickTime;

      const curPos = ctx.getPointerPosition();
      if (!curPos) return;

      // Only when clicks are close enough AND both clicks are at the same position is a double click considered
      // Using a manual implementation as browsers trigger both "pointerdown" and "dblclick" events during a double click
      if (
        timeDiffBetweenClicks <= DOUBLE_CLICK_THRESHOLD &&
        curPos.x === lastClickPos.x &&
        curPos.y === lastClickPos.y
      ) {
        handleDoubleClick(ctx);
      } else {
        handleSingleClick(ctx);
      }

      lastClickPos = curPos;
      lastClickTime = now;
    },

    onPointerMove(_, ctx) {
      if (!firstPoint) return;

      const pos = ctx.getPointerPosition();
      if (!pos) return;

      // update last point for real time preview as user moves pointer
      ctx.engine.replaceLastPointOfPolygonSegment({ x: pos.x, y: pos.y });
    },

    // TODO: remove this once new implementation of double click is verified to work well
    // onDoubleClick(_, ctx) {
    //   if (!firstPoint) return;

    //   const pos = ctx.getPointerPosition();
    //   if (!pos) return;

    //   const object = ctx.engine.getInProgressObject();
    //   // if (?.type !== "polygonSegment") {

    //   if (
    //     !object ||
    //     object.type !== "polygonSegment" ||
    //     object.points.length < 3
    //   )
    //     return;

    //   ctx.engine.replaceLastPointOfPolygonSegment({ x: pos.x, y: pos.y });
    //   ctx.engine.commitObject();
    //   firstPoint = null;
    // },

    renderPreview(group, obj, ctx) {
      // TODO: use ctx to allow labels to be boundary aware

      if (obj.type !== "polygonSegment") return;

      const position = calculateDefaultPosition(obj);
      const value = String(obj["area"]);

      const label = new Konva.Label({ x: position.x, y: position.y });
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
      const strokeWidth = style.strokeWidth || 0.003;

      const line = new Konva.Line({
        points: obj.points.flatMap((point) => [point.x, point.y]),
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        lineCap: "round",
        lineJoin: "round",
      });

      group.add(label).add(line);
      // group.add(line);
    },
  };
}
