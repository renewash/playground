import { KonvaProvider } from "@/components/konva/module";
import {
  KonvaCancelButton,
  KonvaApplyButton,
} from "@/components/konva/KonvaControls";
import { KonvaDrawingCanvas } from "@/components/konva/api-1/KonvaDrawProd";
import { useMemo, useState } from "react";
import { createFreeDrawTool } from "@/components/konva/module/tools/freeDrawTool";
import { createDrawingEngine } from "@/components/konva/module/core/engine";
import { createTwoPointLineTool } from "@/components/konva/module/tools/twoPointLineTool";
import type { DrawingTool } from "@/components/konva/module/tools/types";

const DrawProdA = () => {
  const width = 400;
  const height = 400;
  const engine = useMemo(() => createDrawingEngine(), []);
  const freeTool = useMemo(() => createFreeDrawTool(), []);
  const twoPointLineTool = useMemo(() => createTwoPointLineTool(), []);

  const [tool, setTool] = useState<DrawingTool>(twoPointLineTool);
  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
  };

  return (
    <KonvaProvider>
      <div className="flex gap-5">
        <KonvaDrawingCanvas
          engine={engine}
          tool={tool}
          width={width}
          height={height}
        />
        <div>
          <h3 className="pb-2 text-lg font-semibold">Controls</h3>
          <div className="flex gap-2">
            <KonvaCancelButton className="cursor-pointer rounded-sm border p-2" />
            <KonvaApplyButton className="cursor-pointer rounded-sm border p-2" />
          </div>
          <div className="flex gap-2 py-3">
            <button
              className="cursor-pointer rounded-sm border p-2"
              onClick={() => handleToolChange(freeTool)}
            >
              Use Free Draw
            </button>
            <button
              className="cursor-pointer rounded-sm border p-2"
              onClick={() => handleToolChange(twoPointLineTool)}
            >
              Use Two Point Line
            </button>
          </div>
        </div>
      </div>
    </KonvaProvider>
  );
};
export default DrawProdA;
