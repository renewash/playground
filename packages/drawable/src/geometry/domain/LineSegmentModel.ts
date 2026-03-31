import { getLength } from "../../core/measure";
import { LineSegmentModel, Point, ShapeStyle } from "../types";
import { TWO_POINT_LINE_RADIUS_DEFAULT } from "../../constants";
import config from "../../config";

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
  style = config.defaultDrawableObjectStyle,
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
