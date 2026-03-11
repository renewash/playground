import { PencilIcon } from "@heroicons/react/24/outline";

import Tooltip from "@/components/Tooltip";

import PolygonWithMarkersIcon from "@/icons/PolygonWithMarkersIcon";
import LineSegmentIcon from "@/icons/LineSegmentIcon";
import UndoIcon from "@/icons/UndoIcon";
import RedoIcon from "@/icons/RedoIcon";
import type { DrawingEngine } from "@repo/drawable";
import { useEditor } from "@repo/drawable/react";

const EditorControls = ({ engine }: { engine: DrawingEngine }) => {
  const editorState = useEditor(engine);

  return (
    <>
      <Tooltip content={"Free Draw"}>
        <button
          title="tooltip text"
          className={`cursor-pointer rounded-sm border p-2 ${editorState.tool.type === "freeDraw" ? "bg-gray-300" : ""}`}
          onClick={() => engine.pickTool("freeDraw")}
        >
          <PencilIcon className="size-6" />
        </button>
      </Tooltip>
      <Tooltip content={"Line Segment"}>
        <button
          className={`cursor-pointer rounded-sm border p-2 ${editorState.tool.type === "lineSegment" ? "bg-gray-300" : ""}`}
          onClick={() => engine.pickTool("lineSegment")}
        >
          <LineSegmentIcon />
        </button>
      </Tooltip>
      <button
        disabled
        className={`cursor-pointer rounded-sm border p-2 hover:bg-gray-600`}
        // onClick={() => handleToolChange("polygonWithMarkers")}
      >
        <PolygonWithMarkersIcon />
      </button>
    </>
  );
};

export default EditorControls;
