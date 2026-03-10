import { Line } from "react-konva";
import type { DrawableObject, FreeFormLineModel } from "../../core/types";

export const FreeDraw = ({
  model,
}: {
  model: DrawableObject | FreeFormLineModel | null;
}) => {
  if (!model || model.type != "freeDraw") return;

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
