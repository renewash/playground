import { memo } from "react";
import useDrawingStore from "./drawingStore";
import { Line } from "react-konva";

export const KonvacommittedShapes = memo(() => {
  const committedStrokes = useDrawingStore((s) => s.committedStrokes);

  return (
    <>
      {committedStrokes.map((stroke, index) => (
        <Line
          closed={true}
          key={index}
          points={stroke}
          stroke="green"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </>
  );
});

export const KonvaDraftShapes = memo(() => {
  const draftStrokes = useDrawingStore((s) => s.draftStrokes);
  return (
    <>
      {draftStrokes.map((stroke, index) => (
        <Line
          closed={true}
          key={index}
          points={stroke}
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </>
  );
});

export const KonvaCurrentShape = ({ stroke }: { stroke: number[] }) => {
  return (
    <>
      {stroke && (
        <Line
          points={stroke}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  );
};
