import Tooltip from "@/components/Tooltip";

import UndoIcon from "@/icons/UndoIcon";
import RedoIcon from "@/icons/RedoIcon";
import type { DrawingEngine } from "@repo/drawable";
import { useEditor } from "@repo/drawable/react";

const EditorControls = ({ engine }: { engine: DrawingEngine }) => {
  const editorState = useEditor(engine);

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
      <Tooltip content={"Reset"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300`}
          onClick={() => engine.clear()}
        >
          Reset
        </button>
      </Tooltip>
      <Tooltip content={"Toggle Editable"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300 ${editorState.editable ? "bg-gray-300" : ""}`}
          onClick={() => engine.toggleEditable()}
        >
          {editorState.editable ? "Edit On" : "Edit Off"}
        </button>
      </Tooltip>
    </>
  );
};

export default EditorControls;
