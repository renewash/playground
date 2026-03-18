import Tooltip from "@/components/Tooltip";

import type { DrawingEngine } from "@repo/drawable";
import { useEffect } from "react";

const SaveControls = ({ engine }: { engine: DrawingEngine }) => {
  useEffect(() => {
    onCancel();
  }, [engine]);
  //   const editorState = useEditor(engine);

  const onSave = () => {
    const serialized = engine.getSerializedState();
    localStorage.setItem("drawingState", serialized);
  };

  const onCancel = () => {
    const serialized = localStorage.getItem("drawingState");
    if (serialized) {
      engine.setSerializedState(serialized);
    }
  };
  return (
    <>
      <Tooltip content={"Save"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300`}
          onClick={onSave}
        >
          Save
        </button>
      </Tooltip>
      <Tooltip content={"Cancel"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-300`}
          onClick={onCancel}
        >
          Cancel
        </button>
      </Tooltip>
    </>
  );
};

export default SaveControls;
