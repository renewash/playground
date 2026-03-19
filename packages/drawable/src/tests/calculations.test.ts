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
    const pointA: Point = { x: 0, y: 0 };
    const pointB: Point = { x: 3, y: 4 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  it("calculates the distance between two points with negative coordinates", () => {
    const pointA: Point = { x: -1, y: -1 };
    const pointB: Point = { x: -4, y: -5 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  it("calculates the distance between two identical points", () => {
    const pointA: Point = { x: 2, y: 2 };
    const pointB: Point = { x: 2, y: 2 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0);
  });

  it("calculates points in decimal coordinates", () => {
    const pointA: Point = { x: 1.5, y: 2.5 };
    const pointB: Point = { x: 4.5, y: 6.5 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });
});

describe("area calculations", () => {
  it("calculates the area of a triangle", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 3 },
    ];
    expect(calculateArea(points)).toBe(6);
  });

  it("calculates the area of a square", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(calculateArea(points)).toBe(4);
  });

  it("calculates the area of a rectangle", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(calculateArea(points)).toBe(8);
  });

  it("calculates the area of an irregular polygon", () => {
    const points = [
      { x: 7, y: 4 },
      { x: 3, y: 7 },
      { x: 1, y: 1 },
      { x: -3, y: 5 },
      { x: 4, y: -3 },
    ];
    expect(calculateArea(points)).toBe(33.5);
  });

  it("calculates the area of a line", () => {
    const points = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 6, y: 6 },
      { x: -3, y: -3 },
    ];
    expect(calculateArea(points)).toBe(0);
  });

  it("calculates the area of a polygon with less than 3 points", () => {
    const points = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    expect(calculateArea(points)).toBe(0);
  });

  it("calculates the area of a polygon with overlapping areas", () => {
    const points = [
      { x: 22, y: 12 },
      { x: 33, y: 71 },
      { x: 55, y: 31 },
      { x: -3, y: 5 },
      { x: 4, y: -3 },
      { x: 31, y: 34 },
    ];
    expect(calculateArea(points)).toBe(753);
  });
});

describe("default position calculations ", () => {
  it("calculates default position for line segment", () => {
    // const obj = createCircleModel({ center: [3, 3], radius: 10 });
    const lineSegment = createLineSegmentModel({
      start: { x: 3, y: 3 },
      end: { x: 10, y: 10 },
    });
    const position = calculateDefaultPosition(lineSegment, 100, 30);
    expect(position).toEqual({ x: 3 - 100 / 10, y: 3 - 30 });
  });

  it("calculates default position for free draw", () => {
    const freeDraw = createFreeDrawModel({
      points: [
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
      ],
    });
    const position = calculateDefaultPosition(freeDraw, 100, 30);
    expect(position).toEqual({ x: 3 - 100 / 10, y: 3 - 30 });
  });
});

describe("Area of different shapes", () => {
  it("calculates the area of a circle with radius 1", () => {
    expect(
      getArea(createCircleModel({ center: { x: 0, y: 0 }, radius: 1 })),
    ).toBeCloseTo(Math.PI);
  });

  it("calculates the area of a circle with radius 5", () => {
    expect(
      getArea(createCircleModel({ center: { x: 0, y: 0 }, radius: 5 })),
    ).toBeCloseTo(25 * Math.PI);
  });

  it("calculates the area of a free draw shape", () => {
    const freeDraw = createFreeDrawModel({
      points: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 3 },
      ],
    });
    expect(getArea(freeDraw)).toBe(6);
  });

  it("calculates the area of a line segment (should be 0)", () => {
    const lineSegment = createLineSegmentModel({
      start: { x: 0, y: 0 },
      end: { x: 4, y: 0 },
    });
    expect(getArea(lineSegment)).toBe(0);
  });
});
