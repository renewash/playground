import { useMemo } from "react";

import { createDrawingEngine } from "@repo/drawable";
import { Drawable } from "@repo/drawable/react";

import SharpBorder from "@/components/SharpBorder";
import TotalArea from "./TotalArea";
import DrawingData from "./DrawingData";
import DrawnData from "./DrawnData";
import ShapeControls from "./ShapeControls";
import ColorPicker from "./ColorPicker";
import ActionControls from "./ActionControls";

const DrawModule = () => {
  const width = 500;
  const height = 550;
  const engine = useMemo(() => createDrawingEngine(), []);

  return (
    <div>
      <SharpBorder className="mb-8 w-1/2 px-2 py-4 text-3xl font-semibold">
        <h1>Drawing Canvas</h1>
      </SharpBorder>

      {/* ====== Canvas ====== */}
      <div className="flex gap-10">
        {/* <SharpBorder className={`mb-4 max-h-[${height}px] px-2 py-4`}> */}
        <SharpBorder className={`mb-4 max-h-137.5`}>
          <Drawable engine={engine} width={width} height={height} />
        </SharpBorder>

        {/* ====== Controls ====== */}
        <div>
          <h3 className="pb-2 text-lg font-semibold">Controls</h3>
          <div className="border" />
          <div className="flex gap-2 py-3">
            <ShapeControls engine={engine} />
          </div>
          <div className="flex gap-2 py-3">
            <ActionControls engine={engine} />
          </div>

          <div className="py-3">
            <ColorPicker engine={engine} />
          </div>
          <DrawingData engine={engine} />
        </div>

        {/* ====== Data ====== */}
        <div className="ml-auto w-100">
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
