// import { useKonvaContext } from "@/components/konva/module";

// export const KonvaCancelButton = ({
//   onClick,
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
//   const { store } = useKonvaContext();

//   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     store.clearDocument();
//     onClick?.(e);
//   };

//   return (
//     <button onClick={handleClick} {...rest}>
//       Cancel
//     </button>
//   );
// };

// export const KonvaApplyButton = ({
//   onClick,
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
//   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     onClick?.(e);
//   };

//   //   const hasChanges = draftStrokes.length === 0;
//   return (
//     <button onClick={handleClick} {...rest}>
//       Apply
//     </button>
//   );
// };

// // export const KonvaResetButton = ({ onClick, ...rest }: any) => {
// //   const { store } = useKonvaContext();

// //   const handleClick = (e: any) => {
// //     reset();
// //     onClick?.(e);
// //   };

// //   return (
// //     <Button
// //       disabled={draftStrokes.length === 0}
// //       onClick={handleClick}
// //       {...rest}
// //     >
// //       <ArrowPathIcon className="stroke-dfu-brand-secondary" />
// //       Reset
// //     </Button>
// //   );
// // };

// // const KonvaControls = () => {
// //   return (
// //     <div className="flex h-12 flex-row gap-3">
// //       <button
// //         className="cursor-pointer rounded-md border px-3 py-1.5 hover:bg-amber-500"
// //         // onClick={clearDraft}
// //       >
// //         clear
// //       </button>
// //       <button
// //         className="cursor-pointer rounded-md border px-3 py-1.5 hover:bg-green-500"
// //         // onClick={applyDraft}
// //       >
// //         apply
// //       </button>
// //       <button
// //         className="-3 cursor-pointer rounded-md border py-1.5 hover:bg-blue-500"
// //         // onClick={reset}
// //       >
// //         reset
// //       </button>
// //     </div>
// //   );
// // };

// // export default KonvaControls;
