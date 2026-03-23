import { calculateArea } from "../calculate";
import type { FreeDrawModel, Points, ShapeStyle } from "../types";
import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../../constants";
import { flattenPointsTo1DArray } from "../../utils";
interface CreateFreeDrawModel {
  points: Points;
  pixelPoints?: number[]; // Caches points as flat array for rendering optimization
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
  const pixelPoints = flattenPointsTo1DArray(points);
  return {
    id: crypto.randomUUID(),
    type: "freeDraw",
    points: points ?? [],
    pixelPoints,
    area,
    style,
  };
};
