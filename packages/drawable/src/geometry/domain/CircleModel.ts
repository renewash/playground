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
    style: {
      strokeWidth: 2,
      strokeColor: "#1d12e3",
    },
  };
};
