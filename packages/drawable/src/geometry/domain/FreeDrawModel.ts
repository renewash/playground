import { calculateArea } from "../calculate";
import type { FreeDrawModel, Points, ShapeStyle } from "../types";
import config from "../../config";
interface CreateFreeDrawModel {
  points: Points;
  style?: ShapeStyle;
}

export const createFreeDrawModel = ({
  points,
  style = config.defaultDrawableObjectStyle,
}: CreateFreeDrawModel): FreeDrawModel => {
  const area = calculateArea(points);
  return {
    id: crypto.randomUUID(),
    type: "freeDraw",
    points,
    area,
    style,
  };
};
