import { Point, Points } from "./types";

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param startPoint
 * @param endPoint
 * @returns the Euclidean distance between the two points
 */
export const calculateEuclideanDistance = (
  startPoint: Point,
  endPoint: Point,
): number => {
  const width = startPoint.x - endPoint.x;
  const height = startPoint.y - endPoint.y;
  return Math.hypot(width, height);
};

/**
 * Calculates the area of any polygon defined by an array of points using the shoelace formula
 *
 * @param points an array of numbers representing the x and y coordinates of the polygon vertices in the format [{x1, y1}, {x2, y2}, ..., {xn, yn}]
 * @returns the area of the polygon
 * @throws an error if the points array does not contain an even number of elements
 */
export const calculateArea = (points: Points): number => {
  const n = points.length;

  if (n < 3) return 0; // Not a polygon

  let area = 0;

  for (let i = 0; i < n; i++) {
    const curr = points[i]!;
    const next = points[(i + 1) % n]!;
    area += curr.x * next.y - next.x * curr.y;
  }
  return Math.abs(area) / 2;
};

export const calculateAreaOfCircle = (radius: number): number => {
  return Math.PI * radius * radius;
};
