import { useEffect, useRef } from "react";
import Konva from "konva";
import useDrawing from "@/components/konva/useDrawing";

const KonvaDrawable = ({
  className = "",
  width = 300,
  height = 300,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    stageRef.current = new Konva.Stage({
      container: containerRef.current || undefined,
      width,
      height,
    });

    layerRef.current = new Konva.Layer();
    stageRef.current.add(layerRef.current);

    return () => {
      stageRef.current?.destroy();
      stageRef.current = null;
      layerRef.current = null;
    };
  }, [width, height]);

  useDrawing(stageRef, layerRef);

  return <div className={className + ` z-100`} ref={containerRef} />;
};

export default KonvaDrawable;
