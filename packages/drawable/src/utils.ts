import { Points } from "./geometry/types";

export const flattenPointsTo1DArray = (points: Points): number[] => {
  const flattened: number[] = [];
  for (const point of points) {
    flattened.push(point.x, point.y);
  }
  return flattened;
};

export const flattenPointsTo2DArray = (points: Points): number[][] => {
  const flattened: number[][] = [];
  for (const point of points) {
    flattened.push([point.x, point.y]);
  }
  return flattened;
};

export const flatArrayToPoints = (flatArr: number[]): Points => {
  const n = flatArr.length;
  if (n % 2 !== 0) {
    throw new Error("Flat array must contain an even number of elements");
  }
  const points: Points = [];
  for (let i = 0; i < n; i += 2) {
    points.push({ x: flatArr[i]!, y: flatArr[i + 1]! });
  }
  return points;
};
