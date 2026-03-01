// import { CameraProvider, Zoomable } from "@/components/Camera";
// import KonvaDrawable from "@/components/konva/KonvaDrawable";
// import { KonvaProvider } from "@/components/konva/module";
// import {
//   KonvaCancelButton,
//   KonvaApplyButton,
// } from "@/components/konva/KonvaControls";
// const Draw = () => {
//   const width = 400;
//   const height = 400;
//   return (
//     <CameraProvider>
//       <KonvaProvider>
//         <Zoomable>
//           <div className="h-full rounded border border-gray-600 px-2">
//             <KonvaDrawable width={width} height={height} className="absolute" />
//             <img
//               className="absolute"
//               style={{ width, height }}
//               src={`https://picsum.photos/${width}/${height}`}
//               draggable={false}
//             />
//           </div>
//         </Zoomable>
//         <div>
//           <div>controls</div>
//           <div className="flex gap-2">
//             <KonvaCancelButton />
//             <KonvaApplyButton />
//           </div>
//         </div>
//       </KonvaProvider>
//     </CameraProvider>
//   );
// };
// export default Draw;
