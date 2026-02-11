import {
  CameraContext,
  useCamera,
  useCameraContext,
  type CameraParams,
} from "@/hooks/useCamera";
import { useEffect, type ReactNode } from "react";

export const CameraProvider = ({
  children,
  options = {},
}: {
  children: ReactNode;
  options?: CameraParams;
}) => {
  const camera = useCamera(options);

  // provide camera to CameraContext so that it can be used in useCameraContext
  return <CameraContext value={camera}>{children}</CameraContext>;
};

export const Zoomable = ({
  children,
  width = 400,
  height = 400,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) => {
  const {
    zoomLevel,
    viewportRef,
    zoomTo,
    zoomWithCtrlScroll,
    grabView,
    grabAndDrag,
    releaseGrab,
    grabbed,
  } = useCameraContext();

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    // allows zooming with ctrl + scroll
    el.addEventListener("wheel", zoomWithCtrlScroll, { passive: false });

    // allows grab and drag panning using scroll wheel
    el.addEventListener("pointerdown", grabView);
    el.addEventListener("pointermove", grabAndDrag);
    el.addEventListener("pointerup", releaseGrab);

    return () => {
      el.removeEventListener("wheel", zoomWithCtrlScroll);
      el.removeEventListener("pointerdown", grabView);
      el.removeEventListener("pointermove", grabAndDrag);
      el.removeEventListener("pointerup", releaseGrab);
    };
  }, [
    grabAndDrag,
    grabView,
    releaseGrab,
    viewportRef,
    zoomLevel,
    zoomTo,
    zoomWithCtrlScroll,
  ]);
  return (
    <div
      ref={viewportRef}
      className="overflow-auto"
      style={{ cursor: grabbed ? "grabbing" : "crosshair" }}
    >
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          // required to resolve issue of extra whitespace when zooming out
          width,
          height,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ZoomControls = () => {
  const { zoomAsPercentage, zoomIn, zoomOut, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } =
    useCameraContext();

  const zoomOutDisabled = zoomAsPercentage === `${MIN_ZOOM_LEVEL * 100}%`;
  const zoomInDisabled = zoomAsPercentage === `${MAX_ZOOM_LEVEL * 100}%`;
  return (
    <div className="space-between flex flex-row">
      <button
        onClick={zoomOut}
        className={`rounded-md border px-3 py-1.5 ${zoomOutDisabled ? "opacity-40" : "cursor-pointer"}`}
        disabled={zoomOutDisabled}
      >
        -
      </button>

      <div className="w-16 px-2 py-1 text-center">{zoomAsPercentage}</div>

      <button
        onClick={zoomIn}
        className={`rounded-md border px-3 py-1.5 ${zoomInDisabled ? "opacity-40" : "cursor-pointer"}`}
        disabled={zoomInDisabled}
      >
        +
      </button>
    </div>
  );
};
