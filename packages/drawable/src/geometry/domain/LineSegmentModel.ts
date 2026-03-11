import { getLength } from "../../core/measure";
import { LineSegmentModel, Point, ShapeStyle } from "../types";
import {
  STROKE_COLOR_DEFAULT,
  STROKE_WIDTH_DEFAULT,
  TWO_POINT_LINE_RADIUS_DEFAULT,
} from "../../constants";

interface CreateLineSegmentModel {
  start: Point;
  end?: Point;
  radius?: number;
  style?: ShapeStyle;
}
export const createLineSegmentModel = ({
  start,
  end = start, // Assume end = start point if not provided
  radius = TWO_POINT_LINE_RADIUS_DEFAULT,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreateLineSegmentModel): LineSegmentModel => {
  const obj: LineSegmentModel = {
    id: crypto.randomUUID(),
    type: "lineSegment",
    start,
    end,
    radius,
    length: 0,
    style,
  };

  obj.length = getLength(obj);
  return obj;
};
