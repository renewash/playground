import useDrawingStore from "./drawingStore";
import { Line } from "react-konva";

const KonvaStatic = () => {
  const { draftStrokes } = useDrawingStore();
  return (
    <>
      {draftStrokes.map((stroke, index) => (
        <Line
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
};

export default KonvaStatic;
