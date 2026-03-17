import { useMemo, type ReactNode } from "react";
import { Zoomable, ZoomControls } from "@/components/Camera";
import { createDrawingEngine } from "@repo/drawable";
import { Drawable } from "@repo/drawable/react";
// import useDrawingStore from "@/components/konva/drawingStore";
// import KonvaControls from "@/components/konva/KonvaControls";

const ComB = ({ children }: { children?: ReactNode }) => {
  // const store = useDrawingStore();
  const width = 400;
  const height = 400;
  const engine = useMemo(() => createDrawingEngine(), []);

  return (
    <div className="m-2 rounded border border-gray-600 p-2">
      <div>Component B as</div>
      <div>test</div>
      <div className="flex flex-row gap-2">
        <Zoomable>
          <div style={{ width, height }} className="absolute z-1000">
            <Drawable width={width} height={height} engine={engine} />
          </div>

          <img
            className="absolute"
            style={{ width, height }}
            src={`https://picsum.photos/${width}/${height}`}
            draggable={false}
          />
        </Zoomable>
        <div>
          <ZoomControls />
        </div>
        {/* <KonvaControls /> */}
      </div>
      {children}
    </div>
  );
};

export default ComB;
