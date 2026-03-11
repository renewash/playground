// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";
import { calculateDefaultPosition } from "../core/measure";
import { Point } from "../geometry/types";
import { TWO_POINT_LINE_RADIUS_DEFAULT } from "../constants";

export function createPolygonSegmentTool(): DrawingTool {
  let firstPoint: Point | null = null;

  return {
    type: "polygonSegment",
    onPointerDown(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;

      if (!firstPoint) {
        firstPoint = [pos.x, pos.y];
        ctx.engine.createPolygonSegment(
          [...firstPoint, ...firstPoint],
          TWO_POINT_LINE_RADIUS_DEFAULT,
        );
        return;
      }

      // check if click is same as last point, if so ignore (prevents creating duplicate points on click)
      const object = ctx.engine.getInProgressObject();
      const invalidObject =
        !object || object.type !== "polygonSegment" || object.points.length < 4;

      if (invalidObject) {
        console.warn(
          "Invalid object state in polygon segment tool. Expected a polygon segment with at least 2 points.",
        );
        return;
      }
      const lastPoint = object.points[object.points.length - 3];
      const penultimatePoint = object.points[object.points.length - 4];
      const currentPointSameAsLastPoint =
        penultimatePoint === pos.x && lastPoint === pos.y;

      if (currentPointSameAsLastPoint) return;

      ctx.engine.replaceLastPointOfPolygonSegment([pos.x, pos.y]);
      ctx.engine.appendPointToPolygonSegment([pos.x, pos.y]);
    },

    onPointerMove(_, ctx) {
      if (!firstPoint) return;

      const pos = ctx.getPointerPosition();
      if (!pos) return;

      ctx.engine.replaceLastPointOfPolygonSegment([pos.x, pos.y]);
    },

    onDoubleClick(_, ctx) {
      if (!firstPoint) return;

      const pos = ctx.getPointerPosition();
      if (!pos) return;

      const object = ctx.engine.getInProgressObject();
      // if (?.type !== "polygonSegment") {

      if (
        !object ||
        object.type !== "polygonSegment" ||
        object.points.length < 4
      )
        return;

      ctx.engine.removeLastPointOfPolygonSegment();
      ctx.engine.appendPointToPolygonSegment([pos.x, pos.y]);

      ctx.engine.commitObject();
      firstPoint = null;
    },

    renderPreview(group, obj, ctx) {
      // TODO: use ctx to allow labels to be boundary aware

      if (obj.type !== "polygonSegment") return;

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

      const { style } = ctx.engine.getEditorState();
      const strokeColor = style.strokeColor || "black";
      const strokeWidth = style.strokeWidth || 1;

      const line = new Konva.Line({
        points: obj.points,
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
