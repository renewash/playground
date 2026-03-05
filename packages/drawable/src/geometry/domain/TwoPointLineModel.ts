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
  return {
    id: crypto.randomUUID(),
    type: "twoPointLine",
    start,
    end,
    radius,
    length: 0,
  };
};
