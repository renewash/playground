import { ObjectTable } from "./types";
import { LABEL_HEIGHT_DEFAULT, LABEL_WIDTH_DEFAULT } from "../constants";
import {
  calculateEuclideanDistance,
  calculateArea,
} from "../geometry/calculate";

import { DrawableObject, ModelTypes, Point } from "../geometry/types";

export const getArea = (obj: DrawableObject): number => {
  let area: number = 0;
  switch (obj.type) {
    case "lineSegment":
      area = calculateArea([obj.start, obj.end]);
      break;
    case "polygonSegment":
    case "freeDraw":
      area = calculateArea(obj.points);
      break;
    default: {
      // Exhaustiveness check
      throw new Error(
        `Area calculation not supported for type ${(obj as DrawableObject).type}`,
      );
    }
  }

  return area;
};

export const getTotalArea = (
  objects: ObjectTable,
  targetTypes?: ModelTypes[],
): number => {
  const totalArea = Object.values(objects).reduce((total, obj) => {
    if (targetTypes && !targetTypes.includes(obj.type)) {
      return total; // Skip if the object's type is not in the targetTypes list
    }

    return total + getArea(obj);
  }, 0);

  return totalArea;
};

export const getLength = (obj: DrawableObject): number => {
  let length: number = 0;
  switch (obj.type) {
    case "lineSegment":
      length = calculateEuclideanDistance(obj.start, obj.end);
      break;
    default:
      throw new Error(`Length calculation not supported for type ${obj.type}`);
  }
  return length;
};

export const deriveLabelPosition = (
  obj: DrawableObject,
  width: number = LABEL_WIDTH_DEFAULT,
  height: number = LABEL_HEIGHT_DEFAULT,
): Point => {
  const offSetX = width / 4;
  const offSetY = height * 1.5;
  const originPoint = { x: 0, y: 0 };

  switch (obj.type) {
    case "lineSegment":
      return { x: obj.start.x - offSetX, y: obj.start.y - offSetY };
    case "freeDraw":
      if (obj.points.length < 2) return originPoint;
      return { x: obj.points[0]!.x - offSetX, y: obj.points[0]!.y - offSetY };
    case "polygonSegment":
      if (obj.points.length < 2) return originPoint;
      return { x: obj.points[0]!.x - offSetX, y: obj.points[0]!.y - offSetY };

    default:
      console.warn(
        `Default position calculation not implemented for type ${obj}. Returning {x: 0, y: 0}.`,
      );
      return originPoint;
  }
};
