import { Line } from "react-konva";
import type { DrawableObject, FreeFormLineModel } from "../..";

export const FreeFormLine = ({
  model,
}: {
  model: DrawableObject | FreeFormLineModel | null;
}) => {
  if (!model || model.type != "freeFormLine") return null;

  return (
    <Line
      points={model.points}
      stroke="red"
      strokeWidth={7}
      lineCap="round"
      lineJoin="round"
    />
  );
};
