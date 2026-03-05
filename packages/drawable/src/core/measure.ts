import {
  calculateEuclideanDistance,
  calculateArea,
  calculateAreaOfCircle,
} from "../geometry/calculate";

import { DrawableObject } from "../geometry/types";

export const getArea = (obj: DrawableObject): number => {
  let area: number = 0;
  switch (obj.type) {
    case "circle":
      area = calculateAreaOfCircle(obj.radius);
      break;
    case "line":
    case "twoPointLine":
      area = calculateArea([...obj.start, ...obj.end]);
      break;
    case "freeFormLine":
      area = calculateArea(obj.points);
      break;
    default:
      throw new Error(`Area calculation not supported for type ${obj.type}`);
  }

  return Math.round(area * 100) / 100; // 2 d.p.
};

export const getLength = (obj: DrawableObject): number => {
  let length: number = 0;
  switch (obj.type) {
    case "line":
    case "twoPointLine":
      length = calculateEuclideanDistance(obj.start, obj.end);
      break;
    default:
      throw new Error(`Length calculation not supported for type ${obj.type}`);
  }
  return Math.round(length * 100) / 100; // 2 d.p.
};
