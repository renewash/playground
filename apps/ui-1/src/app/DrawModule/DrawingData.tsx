import { useInProgressObject } from "@repo/drawable/react";
import ObjectInfoBox from "./ObjectInfoBox";

const DrawingData = ({ engine }) => {
  const inProgressObject = useInProgressObject(engine);

  if (!inProgressObject) return null;
  return <ObjectInfoBox drawableObject={inProgressObject} />;
};

export default DrawingData;
