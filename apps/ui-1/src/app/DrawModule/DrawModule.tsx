import { useMemo } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

import Tooltip from "@/components/Tooltip";
import SharpBorder from "@/components/SharpBorder";

import PolygonWithMarkersIcon from "@/icons/PolygonWithMarkersIcon";
import LineSegmentIcon from "@/icons/LineSegmentIcon";
import UndoIcon from "@/icons/UndoIcon";
import RedoIcon from "@/icons/RedoIcon";

import { createDrawingEngine } from "@repo/drawable";
import { Drawable, useEditor } from "@repo/drawable/react";

import TotalArea from "./TotalArea";
import DrawingData from "./DrawingData";
import DrawnData from "./DrawnData";

const DrawModule = () => {
  const width = 500;
  const height = 550;
  const engine = useMemo(() => createDrawingEngine(), []);
  const editorState = useEditor(engine);

  console.log("editorState has changed", editorState);

  return (
    <div>
      <SharpBorder className="mb-8 w-1/2 px-2 py-4 text-3xl font-semibold">
        <h1>Drawing Canvas</h1>
      </SharpBorder>
      <div className="flex gap-10">
        {/* <SharpBorder className={`mb-4 max-h-[${height}px] px-2 py-4`}> */}
        <SharpBorder className={`mb-4 max-h-137.5 px-2 py-4`}>
          <Drawable engine={engine} width={width} height={height} />
        </SharpBorder>

        <div>
          <h3 className="pb-2 text-lg font-semibold">Controls</h3>
          <div className="border" />

          <div className="flex gap-2 py-3">
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
            <div className="mx-1 border border-gray-500" />
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
          </div>
          <DrawingData engine={engine} />
        </div>
        <div className="ml-auto w-[400px]">
          <h3 className="pb-2 text-lg font-semibold">Data</h3>
          <div className="border" />
          <TotalArea engine={engine} />
          <DrawnData engine={engine} />
        </div>
      </div>
    </div>
  );
};
export default DrawModule;
