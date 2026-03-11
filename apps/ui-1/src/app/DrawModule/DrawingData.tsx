import { useInProgressObject } from "@repo/drawable/react";
import ObjectInfoBox from "./ObjectInfoBox";
import { type DrawingEngine } from "@repo/drawable";

const DrawingData = ({ engine }: { engine: DrawingEngine }) => {
  const inProgressObject = useInProgressObject(engine);

  if (!inProgressObject) return null;
  return <ObjectInfoBox drawableObject={inProgressObject} engine={engine} />;
};

export default DrawingData;
