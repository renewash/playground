import { Line } from "react-konva";
import type { DrawableObject, FreeDrawModel } from "../..";

export const FreeDraw = ({
  model,
}: {
  model: DrawableObject | FreeDrawModel | null;
}) => {
  if (!model || model.type !== "freeDraw") return null;
  return (
    <Line
      points={model.points.flatMap((point) => [point.x, point.y])}
      stroke={model.style.strokeColor}
      strokeWidth={model.style.strokeWidth}
      fill={model.style.fillColor}
      lineCap="round"
      lineJoin="round"
      closed={true}
    />
  );
};
