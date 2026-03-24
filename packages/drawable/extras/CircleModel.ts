import type { CircleModel, Point, ShapeStyle } from "../types";
import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../../constants";

interface CreateCircleModel {
  center: Point;
  radius: number;
  style?: ShapeStyle;
}

export const createCircleModel = ({
  center,
  radius,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreateCircleModel): CircleModel => {
  return {
    id: crypto.randomUUID(),
    type: "circle",
    center,
    radius,
    style,
  };
};
