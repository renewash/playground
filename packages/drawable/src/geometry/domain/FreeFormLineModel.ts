import { calculateArea } from "../../geometry/calculate";
import { FreeFormLineModel } from "../types";

interface CreateFreeFormLineModel {
  points: number[];
}

export const createFreeFormLineModel = ({
  points,
}: CreateFreeFormLineModel): FreeFormLineModel => {
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
