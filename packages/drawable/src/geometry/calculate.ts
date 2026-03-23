import { Point, Points } from "./types";

/**
 * Round a number to n decimal places.
 *
 * @param num The number to be rounded
 * @param n The number of decimal places to round to (default is 4)
 * @returns The rounded number
 */
export const roundToNDecimalPlaces = (num: number, n: number = 4): number => {
  const factor = Math.pow(10, n);
  return Math.round(num * factor) / factor;
};

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param startPoint The starting point
 * @param endPoint The ending point
 * @returns The Euclidean distance between the two points
 */
export const calculateEuclideanDistance = (
  startPoint: Point,
  endPoint: Point,
): number => {
  const width = startPoint.x - endPoint.x;
  const height = startPoint.y - endPoint.y;
  const distance = Math.hypot(width, height);
  return roundToNDecimalPlaces(distance);
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
  area = Math.abs(area) / 2;
  return roundToNDecimalPlaces(area); // Round to 4 decimal places
};

export const calculateAreaOfCircle = (radius: number): number => {
  const area = Math.PI * radius * radius;
  return roundToNDecimalPlaces(area);
};
