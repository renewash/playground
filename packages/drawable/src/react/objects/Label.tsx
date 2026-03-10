import { DrawableObject, Point } from "../../geometry/types";
import { Label as KonvaLabel, Tag, Text } from "react-konva";
import { calculateDefaultPosition } from "../../core/measure";

interface LabelProps<T extends DrawableObject> {
  object: T;
  value: string | ((model: T) => string);
  position?: Point;
  width?: number;
  height?: number;
}

/**
 * Create Labels for drawable objects.
 * Labels can be used to display information about the object, such as area, length, or any custom text.
 * The value can be a string or a function that takes the object model as an argument and returns a string.
 * Default position is above the start point of the object.
 *
 * @param param0
 * @returns JSX.Element
 *
 * @example
 * <Label object={object} value={(obj) => `Area: ${obj.area}`} /> or <Label object={object} value="This is a label" />
 * If position is not provided, it will default to the top of the start point of the object if possible, otherwise it will default to [0, 0].
 */
export const Label = <T extends DrawableObject>({
  object,
  value,
  position,
  width = 100,
  height = 30,
}: LabelProps<T>) => {
  const finalPosition =
    position ?? calculateDefaultPosition(object, width, height);
  const text = typeof value === "function" ? value(object) : value;

  return (
    <KonvaLabel
      x={finalPosition[0]}
      y={finalPosition[1]}
      width={width}
      height={height}
    >
      <Tag opacity={1} fill="white" />
      <Text text={text} fontSize={12} padding={2} />
    </KonvaLabel>
  );
};
