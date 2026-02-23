// import { Stage, Layer, Line } from "react-konva";

// const KonvaCanvas = (options) => {
//   const state = getStateFromSomewhere() ?? {};
//   const engine = useDrawingEngine({ ...options, ...state });

//   return (
//     <div>
//       <Stage {...engine.stageProps}>
//         <Layer ref={engine.layerRef}>
//           {engine.strokes.map((stroke, index) => (
//             <Line
//               key={index}
//               points={stroke.points}
//               stroke="black"
//               strokeWidth={2}
//               lineCap="round"
//               lineJoin="round"
//             />
//           ))}
//           {
//             <Line
//               ref={engine.currentLineRef}
//               points={engine.currentStroke.points}
//               stroke="red"
//               strokeWidth={2}
//               lineCap="round"
//               lineJoin="round"
//             />
//           }
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default KonvaCanvas;
