import { type ReactNode } from "react";
import KonvaDrawable from "@/components/konva/KonvaDrawable";
import { Zoomable, ZoomControls } from "@/components/Camera";
import useDrawingStore from "@/components/konva/drawingStore";
import KonvaControls from "@/components/konva/KonvaControls";

const ComB = ({ children }: { children?: ReactNode }) => {
  const store = useDrawingStore();
  console.log(store);
  const width = 400;
  const height = 400;

  return (
    <div className="m-2 rounded border border-gray-600 p-2">
      <div>Component B</div>
      <div>test</div>
      <div className="flex flex-row gap-2">
        <Zoomable>
          <KonvaDrawable width={width} height={height} className="absolute" />
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
        <KonvaControls />
      </div>
      {children}
    </div>
  );
};

export default ComB;
