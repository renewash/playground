import useDrawingStore from "./drawingStore";
import { Line } from "react-konva";

const KonvaStatic = () => {
  const { document } = useDrawingStore();
  return (
    <>
      {document?.strokes.map((stroke, index) => (
        <Line
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
};

export default KonvaStatic;
