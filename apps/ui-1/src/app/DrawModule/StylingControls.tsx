import Tooltip from "@/components/Tooltip";

import StrokeWidthIcon from "@/icons/StrokeWidthIcon";
import type { DrawingEngine } from "@repo/drawable";
import { useEditor } from "@repo/drawable/react";

const StylingControls = ({ engine }: { engine: DrawingEngine }) => {
  const editorState = useEditor(engine);

  const sizes = [0.001, 0.002, 0.003, 0.004, 0.005];

  return (
    <>
      {sizes.map((size) => (
        <Tooltip key={size} content={`Width ${size}`}>
          <button
            className={`cursor-pointer rounded-sm border p-2 ${editorState.style.strokeWidth === size ? "bg-gray-300" : ""}`}
            onClick={() => engine.setStrokeWidth(size)}
          >
            <StrokeWidthIcon strokeWidth={size} />
          </button>
        </Tooltip>
      ))}
    </>
  );
};

export default StylingControls;
