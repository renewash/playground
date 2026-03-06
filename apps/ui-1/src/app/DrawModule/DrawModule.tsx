import { useMemo, useState } from "react";
import SharpBorder from "@/components/SharpBorder";

import { createDrawingEngine, type ToolType } from "@repo/drawable";
import { Drawable } from "@repo/drawable/react";

import TotalArea from "./TotalArea";
import DrawingData from "./DrawingData";
import DrawnData from "./DrawnData";

const DrawModule = () => {
  const width = 400;
  const height = 550;
  const engine = useMemo(() => createDrawingEngine(), []);

  const [tool, setTool] = useState(engine.getTool().type);

  const handleToolChange = (newTool: ToolType) => {
    engine.useTool(newTool);
    setTool(newTool);
  };

  return (
    <div>
      <SharpBorder className="mb-4 w-1/2 px-2 py-4 text-3xl font-semibold">
        <h1>Drawing Canvas</h1>
      </SharpBorder>
      <div className="flex gap-5">
        {/* <SharpBorder className={`mb-4 max-h-[${height}px] px-2 py-4`}> */}
        <SharpBorder className={`mb-4 max-h-137.5 px-2 py-4`}>
          <Drawable engine={engine} width={width} height={height} />
        </SharpBorder>

        <div>
          <h3 className="pb-2 text-lg font-semibold">Controls</h3>

          <div className="flex gap-2 py-3">
            <button
              className={`cursor-pointer rounded-sm border p-2 ${tool === "freeFormLine" ? "bg-gray-300" : ""}`}
              onClick={() => handleToolChange("freeFormLine")}
            >
              Use Free Draw
            </button>
            <button
              className={`cursor-pointer rounded-sm border p-2 ${tool === "twoPointLine" ? "bg-gray-300" : ""}`}
              onClick={() => handleToolChange("twoPointLine")}
            >
              Use Two Point Line
            </button>
          </div>
          <TotalArea engine={engine} />
          <DrawingData engine={engine} />
          <DrawnData engine={engine} />
        </div>
      </div>
    </div>
  );
};
export default DrawModule;
