import { DrawableObject, Point } from "../../geometry/types";
import { Label, Tag, Text } from "react-konva";

const Laybal = ({
  object,
  position,
  customValue,
  keyToUse = [],
  width = 100,
  height = 30,
}: {
  object: DrawableObject;
  position?: Point;
  customValue?: string;
  keyToUse?: string[];
  width?: number;
  height?: number;
}) => {
  return <Label></Label>;
};

export default Laybal;
