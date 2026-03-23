import { calculateArea } from "../calculate";
import type { FreeDrawModel, Points, ShapeStyle } from "../types";
import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../../constants";
interface CreateFreeDrawModel {
  points: Points;
  style?: ShapeStyle;
}

export const createFreeDrawModel = ({
  points,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreateFreeDrawModel): FreeDrawModel => {
  const area = calculateArea(points);
  return {
    id: crypto.randomUUID(),
    type: "freeDraw",
    points: points ?? [],
    area,
    style,
  };
};
