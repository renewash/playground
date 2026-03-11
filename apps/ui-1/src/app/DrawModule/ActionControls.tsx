import Tooltip from "@/components/Tooltip";

import UndoIcon from "@/icons/UndoIcon";
import RedoIcon from "@/icons/RedoIcon";
import type { DrawingEngine } from "@repo/drawable";

const EditorControls = ({ engine }: { engine: DrawingEngine }) => {
  return (
    <>
      <Tooltip content={"Undo"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300`}
          onClick={() => engine.undo()}
        >
          <UndoIcon />
        </button>
      </Tooltip>
      <Tooltip content={"Redo"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300`}
          onClick={() => engine.redo()}
        >
          <RedoIcon />
        </button>
      </Tooltip>
    </>
  );
};

export default EditorControls;
