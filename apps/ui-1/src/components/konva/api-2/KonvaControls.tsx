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
