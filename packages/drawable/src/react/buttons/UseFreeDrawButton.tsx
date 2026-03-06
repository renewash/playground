import { type DrawingEngine } from "../..";

export const UseFreeDrawButton = ({
  engine,
  ...rest
}: {
  engine: DrawingEngine;
  [key: string]: any;
}) => {
  const handleToggleLineTool = () => {
    engine.useTool("freeFormLine");
  };
  return (
    <button {...rest} onClick={handleToggleLineTool}>
      Use Free Draw Tool
    </button>
  );
};

export default UseFreeDrawButton;
