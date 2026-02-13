import { CameraProvider, Zoomable } from "@/components/Camera";
import KonvaDrawable from "@/components/konva/KonvaDrawable";

const Draw = () => {
  const width = 400;
  const height = 400;
  return (
    <CameraProvider>
      <div className="h-full rounded border border-gray-600 px-2">
        <Zoomable>
          <KonvaDrawable width={width} height={height} className="absolute" />
          <img
            className="absolute"
            style={{ width, height }}
            src={`https://picsum.photos/${width}/${height}`}
            draggable={false}
          />
        </Zoomable>
      </div>
    </CameraProvider>
  );
};
export default Draw;
