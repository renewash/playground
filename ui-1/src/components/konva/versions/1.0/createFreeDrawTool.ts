// import Konva from "konva";
// import { type DrawingStore } from "@/components/konva/drawingStore";
// type Point = {
//   x: number;
//   y: number;
// };

// type Points = Point[];

// export type Stroke = {
//   KonvaPoints: number[];
// };

// const createFreeDrawTool = (
//   drawingStore: DrawingStore,
//   draftLayer: Konva.Layer,
//   layer: Konva.Layer,
// ) => {
//   let line = undefined;

//   const start = (pos: Point) => {
//     const points = [pos.x, pos.y];
//     drawingStore.updateDraft(points);
//     line = new Konva.Line({
//       points,
//       stroke: "red",
//       strokeWidth: 3,
//     });
//     draftLayer.add(line);
//   };

//   const move = (pos: Point) => {};

//   const end = () => {};

//   const apply = () => {};
//   const cancel = () => {};
//   const reset = () => {};

//   const transformPoints = () => {
//     const points: Points = [];

//     for (let i = 0; i < drawingStore.draftStrokes.length; i += 2) {
//       points.push({
//         x: drawingStore.draftStrokes[i],
//         y: drawingStore.draftStrokes[i + 1],
//       });
//     }

//     return points;
//   };

//   return { start, move, end, apply, cancel, reset, transformPoints };
// };

// export default createFreeDrawTool;
