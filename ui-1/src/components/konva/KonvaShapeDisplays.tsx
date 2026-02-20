import { memo } from "react";
// import useDrawingStore from "./drawingStore";
import { Line } from "react-konva";
import { type Stroke } from "@/components/konva/module/types";
import { useKonvaContext } from "./module";

export const KonvacommittedShapes = memo(() => {
  // const committedStrokes = useDrawingStore((s) => s.committedStrokes);

  return (
    <>
      {/* {committedStrokes.map((stroke, index) => (
        <Line
          closed={true}
          key={index}
          points={stroke}
          stroke="green"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      ))} */}
    </>
  );
});

export const KonvaDraftShapes = memo(() => {
  // const draftStrokes = useDrawingStore((s) => s.draftStrokes);
  const { drawingState } = useKonvaContext();
  const strokes = drawingState.document.strokes;
  // const strokes = [[]];

  return (
    <>
      {strokes.map((stroke, index) => (
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

// export const KonvaDraftShapes = ({ strokes }: { strokes: Stroke[] }) => {
//   console.log("these are the KonvaDraftShapes");
//   return (
//     <>
//       {strokes.map((stroke, index) => (
//         <Line
//           closed={true}
//           key={index}
//           points={stroke}
//           stroke="red"
//           strokeWidth={2}
//           lineCap="round"
//           lineJoin="round"
//         />
//       ))}
//     </>
//   );
// };

export const KonvaCurrentShape = ({ stroke }: { stroke: Stroke }) => {
  // console.log("this is stroke", stroke);
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
