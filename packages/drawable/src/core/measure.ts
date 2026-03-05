import {
  calculateEuclideanDistance,
  calculateArea,
  calculateAreaOfCircle,
} from "../geometry/calculate";

import { DrawableObject } from "../geometry/types";

export const getArea = (obj: DrawableObject) => {
  switch (obj.type) {
    case "circle":
      return calculateAreaOfCircle(obj.radius);
    case "line":
    case "twoPointLine":
      return calculateArea([...obj.start, ...obj.end]);
    case "freeFormLine":
      return calculateArea(obj.points);
    default:
      throw new Error(`Area calculation not supported for type ${obj.type}`);
  }
};

export const getLength = (obj: DrawableObject) => {
  switch (obj.type) {
    case "line":
    case "twoPointLine":
      return calculateEuclideanDistance(obj.start, obj.end);

    default:
      throw new Error(`Length calculation not supported for type ${obj.type}`);
  }
};

export const deriveMeasurements = (obj: DrawableObject) => {
  if ("area" in obj) {
    obj.area = getArea(obj);
  }
  if ("length" in obj) {
    obj.length = getLength(obj);
  }
  return obj;
};
