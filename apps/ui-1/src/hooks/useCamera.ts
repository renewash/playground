import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

import { SCROLL_CLICK_ID } from "@/constants";
import { type Point, type PointAsPercentage } from "@/types";

export type CameraParams = {
  defaultZoomLevel?: number;
  defaultX?: number;
  defaultY?: number;
  min?: number;
  max?: number;
  step?: number;
  panPrecision?: number;
};

export type CameraFeatures = {
  MIN_ZOOM_LEVEL: number;
  MAX_ZOOM_LEVEL: number;
  zoomLevel: number;
  panBy: Point;
  zoomAsPercentage: string;
  panByAsPercentage: PointAsPercentage;
  grabbed: boolean;
  getPanBy: () => Point;
  setZoomLevel: Dispatch<SetStateAction<number>>;
  setPanBy: Dispatch<SetStateAction<Point>>;
  zoomTo: (factor: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  panLeft: () => void;
  panRight: () => void;
  panTop: () => void;
  panBottom: () => void;
  zoomWithCtrlScroll: (e: WheelEvent) => void;
  grabView: (e: PointerEvent) => void;
  grabAndDrag: (e: PointerEvent) => void;
  releaseGrab: (e: PointerEvent) => void;
  viewportRef: RefObject<HTMLDivElement | null>;
};

export const useCamera = ({
  defaultZoomLevel = 1,
  defaultX = 0,
  defaultY = 0,
  min = 1,
  max = 3,
  step = 0.1,
  panPrecision = 5,
}: CameraParams): CameraFeatures => {
  const [zoomLevel, setZoomLevel] = useState(defaultZoomLevel);
  const [panBy, setPanBy] = useState<Point>({ x: defaultX, y: defaultY });

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const zoomTo = useCallback(
    (nextZoom: number) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        setZoomLevel(nextZoom);
        return;
      }

      const { scrollLeft, scrollTop, clientWidth, clientHeight } = viewport;

      // viewport center in content space
      const centerX = scrollLeft + clientWidth / 2;
      const centerY = scrollTop + clientHeight / 2;

      const clampedZoom = Math.min(max, Math.max(min, nextZoom));
      const ratio = clampedZoom / zoomLevel;

      setZoomLevel(clampedZoom);

      // adjust scroll after scale is applied
      requestAnimationFrame(() => {
        viewport.scrollLeft = centerX * ratio - clientWidth / 2;
        viewport.scrollTop = centerY * ratio - clientHeight / 2;
      });
    },
    [zoomLevel, min, max],
  );

  const zoomIn = () => zoomTo(zoomLevel + step);
  const zoomOut = () => zoomTo(zoomLevel - step);

  const resetZoom = () => setZoomLevel(defaultZoomLevel);

  const zoomAsPercentage = `${Math.round(zoomLevel * 100)}%`;

  const panByAsPercentage = {
    x: `${(panBy.x * 100).toFixed(2)}%`,
    y: `${(panBy.y * 100).toFixed(2)}%`,
  };

  const panStep = 100 / panPrecision;

  const panLeft = () => {
    viewportRef.current?.scrollBy({ left: -panStep, behavior: "smooth" });
  };

  const panRight = () => {
    viewportRef.current?.scrollBy({ left: panStep, behavior: "smooth" });
  };

  const panTop = () => {
    viewportRef.current?.scrollBy({ top: -panStep, behavior: "smooth" });
  };

  const panBottom = () => {
    viewportRef.current?.scrollBy({ top: panStep, behavior: "smooth" });
  };

  const getPanBy = (): Point => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: 0, y: 0 };

    const {
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
    } = viewport;

    return {
      x: scrollLeft / (scrollWidth - clientWidth), // 0..1
      y: scrollTop / (scrollHeight - clientHeight), // 0..1
    };
  };

  const zoomWithCtrlScroll = (e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();

    // Trackpad: deltaY is small & continuous
    // Mouse wheel: deltaY is larger & discrete
    const zoomDelta = -e.deltaY * 0.005;

    zoomTo(zoomLevel + zoomDelta);
  };

  const [grabbed, setGrabbed] = useState(false);

  // TODO: make the grab button configurable
  const assignedGrabButton = SCROLL_CLICK_ID;

  const grabView = (e: PointerEvent) => {
    if (e.button !== assignedGrabButton) return;

    setGrabbed(true);
  };

  const grabAndDrag = (e: PointerEvent) => {
    const viewport = viewportRef.current;
    if (!grabbed || !viewport) return;

    viewport.scrollLeft -= e.movementX;
    viewport.scrollTop -= e.movementY;
  };

  const releaseGrab = (e: PointerEvent) => {
    if (e.button !== assignedGrabButton) return;
    setGrabbed(false);
  };

  return {
    MIN_ZOOM_LEVEL: min,
    MAX_ZOOM_LEVEL: max,
    zoomLevel,
    panBy,
    zoomAsPercentage,
    panByAsPercentage,
    grabbed,
    getPanBy,
    setZoomLevel,
    setPanBy,
    zoomTo,
    zoomIn,
    zoomOut,
    resetZoom,
    panLeft,
    panRight,
    panTop,
    panBottom,
    zoomWithCtrlScroll,
    grabView,
    grabAndDrag,
    releaseGrab,
    viewportRef,
  };
};

export const CameraContext = createContext<CameraFeatures | null>(null);

export const useCameraContext = (): CameraFeatures => {
  const ctx = useContext(CameraContext);
  if (!ctx)
    throw new Error("useCameraContext must be used within a CameraProvider");
  return ctx;
};

export const deriveViewingDimensions = (
  zoomLevel: CameraFeatures["zoomLevel"],
) => {
  /**
   * Diagram not to scale. It should be a square. Outer box = image
   *
   *   __________ outWidth (outer width) _______________  _
   *  |                                               | | gapTop (gap Top)
   *  |   ________ inWidth (inner width) __________   | _
   *  |  |                                         |  |
   *  |  |                                         |  |
   *  | inHeight (inner height)                    |  |
   *  |  |--------------  (Viewbox)   -------------|  | outHeight (outer height)
   *  |  |                                         |  |
   *  |  |                                         |  |
   *  |  |_________________________________________|  | _
   *  |                                               | | gapBottom (gap bottom)
   *  |_______________________________________________| _
   *
   */

  // viewbox has an inverted relationship with zoomLevel.
  // E.g 3x scale/zoom = 0.33 viewboxSize of total imageSize.
  // viewboxSize = inWitdh = inHeight
  const viewboxSize = 1 / zoomLevel;

  // how many viewboxes can fit in the width / height of image
  const viewboxesFittable = zoomLevel;

  // how many viewboxes can fit in (gapLeft + gapRight) or (gapTop + gapBottom) of image
  const viewboxesFittableInSideGaps = viewboxesFittable - 1;

  // how many viewboxes can fit in gapLeft / gapRight / gapTop / gapBottom of image
  const translateThreshold = viewboxesFittableInSideGaps / 2;

  return {
    translateThreshold,
    viewboxSize,
    viewboxesFittable,
    viewboxesFittableInSideGaps,
  };
};
