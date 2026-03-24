import { LineModel, Point, ShapeStyle } from "../types";
import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../../constants";

// Assume end point is the same as start point if not provided
interface CreateLineModel {
  start: Point;
  end?: Point;
  style?: ShapeStyle;
}
export const createLineModel = ({
  start,
  end = start,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreateLineModel): LineModel => {
  return {
    id: crypto.randomUUID(),
    type: "line",
    start,
    end,
    length: 0,
    style,
  };
};
