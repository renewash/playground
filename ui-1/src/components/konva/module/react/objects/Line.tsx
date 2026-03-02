import { Line } from "react-konva";
import type { DrawableObject, StrokeModel } from "../../core/types";

export const FreeFormLine = ({
  model,
}: {
  model: DrawableObject | StrokeModel | null;
}) => {
  if (!model || model.type != "stroke") return;

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
