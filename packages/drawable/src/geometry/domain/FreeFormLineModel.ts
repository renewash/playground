import { FreeFormLineModel, Point } from "../types";

interface CreateFreeFormLineModel {
  points: number[];
}

export const createFreeFormLineModel = ({
  points,
}: CreateFreeFormLineModel): FreeFormLineModel => {
  return {
    id: crypto.randomUUID(),
    type: "freeFormLine",
    points: points ?? [],
  };
};
