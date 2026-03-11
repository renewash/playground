import { getLength } from "../../core/measure";
import { LineSegmentModel, Point } from "../types";

const TWO_POINT_LINE_RADIUS_DEFAULT = 3;

interface CreateLineSegmentModel {
  start: Point;
  end?: Point;
  radius?: number;
}
export const createLineSegmentModel = ({
  start,
  end = start, // Assume end = start point if not provided
  radius = TWO_POINT_LINE_RADIUS_DEFAULT,
}: CreateLineSegmentModel): LineSegmentModel => {
  const obj: LineSegmentModel = {
    id: crypto.randomUUID(),
    type: "lineSegment",
    start,
    end,
    radius,
    length: 0,
    style: {
      strokeWidth: 2,
      strokeColor: "#1d12e3",
    },
  };

  obj.length = getLength(obj);
  return obj;
};
