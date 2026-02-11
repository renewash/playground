import Konva from "konva";
import KonvaFreeDrawingTool from "@/components/konva/KonvaFreeDrawingTool";
import { useEffect, useRef } from "react";
import useDrawingStore from "@/components/konva/drawingStore";

/**
 * Hook to connect drawing logic to React
 *
 * @param stageRef
 * @param layerRef
 */
const useDrawing = (
  stageRef: React.RefObject<Konva.Stage | null>,
  layerRef: React.RefObject<Konva.Layer | null>,
) => {
  const { applyDraft } = useDrawingStore();
  const toolRef = useRef<KonvaFreeDrawingTool | null>(null);

  // TODO: configure to allow tool changes.
  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;

    toolRef.current = new KonvaFreeDrawingTool(layer, {
      onStrokeEnd() {
        applyDraft();
      },
    });

    const getPos = () => stage.getPointerPosition();

    const start = () => {
      const pos = getPos();
      if (pos) toolRef.current?.start(pos);
    };

    const move = () => {
      const pos = getPos();
      if (pos) toolRef.current?.move(pos);
    };

    const end = () => {
      toolRef.current?.end();
    };

    stage.on("mousedown touchstart", start);
    stage.on("mousemove touchmove", move);
    stage.on("mouseup touchend", end);

    return () => {
      stage.off("mousedown touchstart", start);
      stage.off("mousemove touchmove", move);
      stage.off("mouseup touchend", end);
    };
  }, [stageRef, layerRef, applyDraft]);
};

export default useDrawing;
