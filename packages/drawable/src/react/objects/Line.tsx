import { Line } from "react-konva";
import type { DrawableObject, FreeFormLineModel } from "../..";

export const FreeDraw = ({
  model,
}: {
  model: DrawableObject | FreeFormLineModel | null;
}) => {
  if (!model || model.type != "freeDraw") return null;

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
