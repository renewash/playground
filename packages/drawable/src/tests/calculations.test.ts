import { describe, expect, it } from "vitest";
import {
  calculateEuclideanDistance,
  calculateArea,
} from "../geometry/calculate.js";

import { getArea, calculateDefaultPosition } from "../core/measure.js";
import {
  createCircleModel,
  createFreeDrawModel,
  createLineSegmentModel,
  Point,
} from "..";

describe("distance calculations", () => {
  it("calculates the distance between two points", () => {
    const pointA: Point = [0, 0];
    const pointB: Point = [3, 4];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  it("calculates the distance between two points with negative coordinates", () => {
    const pointA: Point = [-1, -1];
    const pointB: Point = [-4, -5];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  it("calculates the distance between two identical points", () => {
    const pointA: Point = [2, 2];
    const pointB: Point = [2, 2];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0);
  });

  it("calculates points in decimal coordinates", () => {
    const pointA: Point = [1.5, 2.5];
    const pointB: Point = [4.5, 6.5];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });
});

describe("area calculations", () => {
  it("calculates the area of a triangle", () => {
    const points = [0, 0, 4, 0, 2, 3];
    expect(calculateArea(points)).toBe(6);
  });

  it("calculates the area of a square", () => {
    const points = [0, 0, 2, 0, 2, 2, 0, 2];
    expect(calculateArea(points)).toBe(4);
  });

  it("calculates the area of a rectangle", () => {
    const points = [0, 0, 4, 0, 4, 2, 0, 2];
    expect(calculateArea(points)).toBe(8);
  });

  it("calculates the area of an irregular polygon", () => {
    const points = [7, 4, 3, 7, 1, 1, -3, 5, 4, -3];
    expect(calculateArea(points)).toBe(33.5);
  });

  it("calculates the area of a line", () => {
    const points = [1, 1, 2, 2, 6, 6, -3, -3];
    expect(calculateArea(points)).toBe(0);
  });

  it("calculates the area of a polygon with less than 3 points", () => {
    const points = [1, 1, 2, 2];
    expect(calculateArea(points)).toBe(0);
  });

  // TODO: if change to point / vector objects, need to update this test
  it("throws an error for a polygon with an odd number of coordinates", () => {
    const points = [1, 1, 2, 2, 3];
    expect(() => calculateArea(points)).toThrow();
  });

  it("calculates the area of a polygon with overlapping areas", () => {
    const points = [22, 12, 33, 71, 55, 31, -3, 5, 4, -3, 31, 34];
    expect(calculateArea(points)).toBe(753);
  });
});

describe("default position calculations ", () => {
  it("calculates default position for line segment", () => {
    // const obj = createCircleModel({ center: [3, 3], radius: 10 });
    const lineSegment = createLineSegmentModel({
      start: [3, 3],
      end: [10, 10],
    });
    const position = calculateDefaultPosition(lineSegment, 100, 30);
    expect(position).toEqual([3 - 100 / 10, 3 - 30]);
  });

  it("calculates default position for free draw", () => {
    const freeDraw = createFreeDrawModel({
      points: [3, 3, 4, 4, 5, 5],
    });
    const position = calculateDefaultPosition(freeDraw, 100, 30);
    expect(position).toEqual([3 - 100 / 10, 3 - 30]);
  });
});

describe("Area of different shapes", () => {
  it("calculates the area of a circle with radius 1", () => {
    expect(
      getArea(createCircleModel({ center: [0, 0], radius: 1 })),
    ).toBeCloseTo(Math.PI);
  });

  it("calculates the area of a circle with radius 5", () => {
    expect(
      getArea(createCircleModel({ center: [0, 0], radius: 5 })),
    ).toBeCloseTo(25 * Math.PI);
  });

  it("calculates the area of a free draw shape", () => {
    const freeDraw = createFreeDrawModel({
      points: [0, 0, 4, 0, 2, 3],
    });
    expect(getArea(freeDraw)).toBe(6);
  });

  it("calculates the area of a line segment (should be 0)", () => {
    const lineSegment = createLineSegmentModel({
      start: [0, 0],
      end: [4, 0],
    });
    expect(getArea(lineSegment)).toBe(0);
  });
});
