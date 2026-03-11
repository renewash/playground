import { Circle, Line } from "react-konva";
import type { DrawableObject, PolygonSegmentModel } from "../../geometry/types";

const PolygonSegment = ({
  model,
}: {
  model: DrawableObject | PolygonSegmentModel | null;
}) => {
  if (!model || model.type !== "polygonSegment") return null;

  const { radius } = model;
  const { strokeColor, strokeWidth } = model.style;

  return (
    <>
      <Line
        points={model.points}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        closed={true}
      />
      {model.points
        .reduce((acc: number[][], _, i) => {
          if (i % 2 === 0) {
            const x = model.points[i];
            const y = model.points[i + 1];
            if (typeof x === "number" && typeof y === "number") {
              acc.push([x, y]);
            }
          }
          return acc;
        }, [])
        .map((point) => (
          <Circle
            key={`${point[0]}-${point[1]}`}
            x={point[0]}
            y={point[1]}
            radius={radius}
            stroke={strokeColor}
          />
        ))}
    </>
  );
};

export default PolygonSegment;
