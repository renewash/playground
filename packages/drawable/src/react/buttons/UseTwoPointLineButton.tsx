import { type DrawingEngine } from "../..";

export const UseTwoPointLineButton = ({
  engine,
  ...rest
}: {
  engine: DrawingEngine;
  [key: string]: any;
}) => {
  const handleToggleLineTool = () => {
    engine.useTool("twoPointLine");
  };
  return (
    <button {...rest} onClick={handleToggleLineTool}>
      Use Two Point Line Tool
    </button>
  );
};

export default UseTwoPointLineButton;
