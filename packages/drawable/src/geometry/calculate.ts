export const calculateEuclideanDistance = (startPoint, endPoint): number => {
  const width = startPoint[0] - endPoint[0];
  const height = startPoint[1] - endPoint[1];
  return Math.hypot(width, height);
};

export const calculateArea = (points: number[]): number => {
  const n = points.length;
  if (n % 2 !== 0) {
    throw new Error("Points array must contain an even number of elements.");
  }

  let area = 0;

  if (n < 6) {
    return 0; // Not a polygon
  }

  for (let i = 0; i < n - 2; i += 2) {
    const currX = points[i];
    const currY = points[i + 1];
    const nextX = points[i + 2];
    const nextY = points[i + 3];
    area += currX * nextY - nextX * currY;
  }

  // close the polygon: last point to first
  const xLast = points[n - 2];
  const yLast = points[n - 1];
  const xFirst = points[0];
  const yFirst = points[1];
  area += xLast * yFirst - xFirst * yLast;

  return Math.abs(area / 2);
};
