import Tooltip from "@/components/Tooltip";

import StrokeWidthIcon from "@/icons/StrokeWidthIcon";
import type { DrawingEngine } from "@repo/drawable";
import { useEditor } from "@repo/drawable/react";

const StylingControls = ({ engine }: { engine: DrawingEngine }) => {
  const editorState = useEditor(engine);

  const sizes = [1, 2, 3, 4, 5];

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
