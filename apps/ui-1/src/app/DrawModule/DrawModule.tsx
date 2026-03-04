import { KonvaDrawingCanvas } from "@/components/konva/api-2/KonvaDrawProd";
import { useMemo, useState } from "react";
import SharpBorder from "@/components/SharpBorder";
import {
  createFreeDrawTool,
  createTwoPointLineTool,
  type DrawingTool,
} from "@repo/drawable";

const DrawModule = () => {
  const width = 600;
  const height = 600;
  const freeTool = useMemo(() => createFreeDrawTool(), []);
  const twoPointLineTool = useMemo(() => createTwoPointLineTool(), []);

  const [tool, setTool] = useState<DrawingTool>(twoPointLineTool);
  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
  };

  return (
    <div>
      <SharpBorder className="mb-4 w-1/2 px-2 py-4 text-3xl font-semibold">
        <h1>Drawing Canvas</h1>
      </SharpBorder>
      <div className="flex gap-5">
        <SharpBorder className="mb-4 px-2 py-4">
          <KonvaDrawingCanvas tool={tool} width={width} height={height} />
        </SharpBorder>

        <div>
          <h3 className="pb-2 text-lg font-semibold">Controls</h3>
          <div className="flex gap-2">
            {/* <KonvaCancelButton className="cursor-pointer rounded-sm border p-2" />
          <KonvaApplyButton className="cursor-pointer rounded-sm border p-2" /> */}
          </div>
          <div className="flex gap-2 py-3">
            <button
              className={`cursor-pointer rounded-sm border p-2 ${tool === freeTool ? "bg-gray-300" : ""}`}
              onClick={() => handleToolChange(freeTool)}
            >
              Use Free Draw
            </button>
            <button
              className={`cursor-pointer rounded-sm border p-2 ${tool === twoPointLineTool ? "bg-gray-300" : ""}`}
              onClick={() => handleToolChange(twoPointLineTool)}
            >
              Use Two Point Line
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DrawModule;
