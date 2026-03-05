import type { CircleModel, Point } from "../types";

interface CreateCircleModel {
  center: Point;
  radius: number;
}

export const createCircleModel = ({
  center,
  radius,
}: CreateCircleModel): CircleModel => {
  return {
    id: crypto.randomUUID(),
    type: "circle",
    center,
    radius,
    area: 0,
  };
};
