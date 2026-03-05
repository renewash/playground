// import { KonvaDrawingCanvas } from "@/components/konva/api-2/KonvaDrawProd";
import { useMemo, useState } from "react";
import SharpBorder from "@/components/SharpBorder";
import {
  createDrawingEngine,
  createFreeDrawTool,
  createTwoPointLineTool,
  type DrawingTool,
} from "@repo/drawable";

import { Drawable, useScene, useInProgressObject } from "@repo/drawable/react";

const DrawModule = () => {
  const width = 600;
  const height = 600;
  const engine = useMemo(() => createDrawingEngine(), []);
  const freeTool = useMemo(() => createFreeDrawTool(), []);
  const twoPointLineTool = useMemo(() => createTwoPointLineTool(), []);

  const state = useScene(engine);
  const inProgressObject = useInProgressObject(engine);

  const [tool, setTool] = useState<DrawingTool>(twoPointLineTool);
  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
  };
  const area =
    inProgressObject && "area" in inProgressObject ? inProgressObject.area : 0;

  const length =
    inProgressObject && "length" in inProgressObject
      ? inProgressObject.length
      : 0;

  return (
    <div>
      <SharpBorder className="mb-4 w-1/2 px-2 py-4 text-3xl font-semibold">
        <h1>Drawing Canvas</h1>
      </SharpBorder>
      <div className="flex gap-5">
        <SharpBorder className="mb-4 px-2 py-4">
          <Drawable engine={engine} tool={tool} width={width} height={height} />
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
          {inProgressObject && (
            <div className="mb-4 rounded-sm border bg-yellow-50 p-2">
              <p className="font-semibold">In Progress Object</p>
              <p>ID: {inProgressObject.id}</p>
              <p>Type: {inProgressObject.type}</p>
              <p>Measurements: {area || length || "NA"}</p>
            </div>
          )}
          {Object.entries(state.objects).map(([id, obj]) => {
            const area = obj && "area" in obj ? obj.area : 0;
            const length = obj && "length" in obj ? obj.length : 0;

            return (
              <div key={id} className="mb-2 rounded-sm border p-2">
                <p>ID: {id}</p>
                <p>Type: {obj.type}</p>
                <p>Measurements: {area || length || "NA"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DrawModule;
