import { calculateArea } from "../calculate";
import { FreeDrawModel } from "../types";

interface CreateFreeDrawModel {
  points: number[];
}

export const createFreeDrawModel = ({
  points,
}: CreateFreeDrawModel): FreeDrawModel => {
  const area = calculateArea(points);
  return {
    id: crypto.randomUUID(),
    type: "freeDraw",
    points: points ?? [],
    area,
    style: {
      strokeWidth: 2,
      strokeColor: "#1d12e3",
    },
  };
};
