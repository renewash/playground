import {
  calculateEuclideanDistance,
  calculateArea,
  calculateAreaOfCircle,
} from "../geometry/calculate";

import { DrawableObject, Point } from "../geometry/types";

export const getArea = (obj: DrawableObject): number => {
  let area: number = 0;
  switch (obj.type) {
    case "circle":
      area = calculateAreaOfCircle(obj.radius);
      break;
    case "line":
    case "lineSegment":
      area = calculateArea([...obj.start, ...obj.end]);
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

  return Math.round(area * 100) / 100; // 2 d.p.
};

export const getLength = (obj: DrawableObject): number => {
  let length: number = 0;
  switch (obj.type) {
    case "line":
    case "lineSegment":
      length = calculateEuclideanDistance(obj.start, obj.end);
      break;
    default:
      throw new Error(`Length calculation not supported for type ${obj.type}`);
  }
  return Math.round(length * 100) / 100; // 2 d.p.
};

export const calculateDefaultPosition = (
  obj: DrawableObject,
  width: number,
  height: number,
): Point => {
  const offSetX = width / 10;
  const offSetY = height;

  switch (obj.type) {
    case "lineSegment":
      return [obj.start[0] - offSetX, obj.start[1] - offSetY];
    case "freeDraw":
      if (obj.points.length < 2) return [0, 0];

      return [obj.points[0]! - offSetX, obj.points[1]! - offSetY];
    case "circle":
      return [obj.center[0], obj.center[1] - obj.radius - offSetY];
    default:
      return [0, 0];
  }
};
