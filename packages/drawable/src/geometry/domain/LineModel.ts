import { LineModel, Point } from "../types";

// Assume end point is the same as start point if not provided
interface CreateLineModel {
  start: Point;
  end?: Point;
}
export const createLineModel = ({
  start,
  end = start,
}: CreateLineModel): LineModel => {
  return {
    id: crypto.randomUUID(),
    type: "line",
    start,
    end,
    length: 0,
    style: {
      strokeWidth: 2,
      strokeColor: "#1d12e3",
    },
  };
};
