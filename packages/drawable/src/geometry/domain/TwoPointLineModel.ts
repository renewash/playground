import { getLength } from "../../core/measure";
import { TwoPointLineModel, Point } from "../types";

const TWO_POINT_LINE_RADIUS_DEFAULT = 3;

interface CreateTwoPointLineModel {
  start: Point;
  end?: Point;
  radius?: number;
}
export const createTwoPointLineModel = ({
  start,
  end = start, // Assume end = start point if not provided
  radius = TWO_POINT_LINE_RADIUS_DEFAULT,
}: CreateTwoPointLineModel): TwoPointLineModel => {
  const obj: TwoPointLineModel = {
    id: crypto.randomUUID(),
    type: "twoPointLine",
    start,
    end,
    radius,
    length: 0,
  };

  obj.length = getLength(obj);
  return obj;
};
