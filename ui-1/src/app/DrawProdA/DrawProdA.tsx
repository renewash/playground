import { CameraProvider, Zoomable } from "@/components/Camera";
// import KonvaDrawable from "@/components/konva/KonvaDrawable";
import { KonvaProvider } from "@/components/konva/module";
import {
  KonvaCancelButton,
  KonvaApplyButton,
} from "@/components/konva/KonvaControls";
import { KonvaDrawingCanvas } from "@/components/konva/api-1/KonvaDrawProd";
import { useMemo } from "react";
import { createFreeDrawTool } from "@/components/konva/module/tools/freeDrawTool";
import { createDrawingEngine } from "@/components/konva/module/core/engine";

const DrawProdA = () => {
  const width = 400;
  const height = 400;
  const engine = useMemo(() => createDrawingEngine(), []);
  const tool = useMemo(() => createFreeDrawTool(), []);

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
        </div>
      </div>
    </KonvaProvider>
  );
};
export default DrawProdA;
