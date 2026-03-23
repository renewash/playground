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
    const pointA: Point = { x: 0.0, y: 0.0 };
    const pointB: Point = { x: 0.3, y: 0.4 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0.5);
  });

  it("calculates the distance between two points with negative coordinates", () => {
    const pointA: Point = { x: -0.1, y: -0.1 };
    const pointB: Point = { x: -0.4, y: -0.5 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0.5);
  });

  it("calculates the distance between two identical points", () => {
    const pointA: Point = { x: 0.2, y: 0.2 };
    const pointB: Point = { x: 0.2, y: 0.2 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0);
  });

  it("calculates points in decimal coordinates", () => {
    const pointA: Point = { x: 0.15, y: 0.25 };
    const pointB: Point = { x: 0.45, y: 0.65 };
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0.5);
  });
});

describe("area calculations", () => {
  it("calculates the area of a triangle", () => {
    const points = [
      { x: 0.0, y: 0.0 },
      { x: 0.4, y: 0.0 },
      { x: 0.2, y: 0.3 },
    ];
    expect(calculateArea(points)).toBe(0.06);
  });

  it("calculates the area of a square", () => {
    const points = [
      { x: 0.0, y: 0.0 },
      { x: 0.2, y: 0.0 },
      { x: 0.2, y: 0.2 },
      { x: 0.0, y: 0.2 },
    ];
    expect(calculateArea(points)).toBe(0.04);
  });

  it("calculates the area of a rectangle", () => {
    const points = [
      { x: 0.0, y: 0.0 },
      { x: 0.4, y: 0.0 },
      { x: 0.4, y: 0.2 },
      { x: 0.0, y: 0.2 },
    ];
    expect(calculateArea(points)).toBe(0.08);
  });

  it("calculates the area of an irregular polygon", () => {
    const points = [
      { x: 0.7, y: 0.4 },
      { x: 0.3, y: 0.7 },
      { x: 0.1, y: 0.1 },
      { x: -0.3, y: 0.5 },
      { x: 0.4, y: -0.3 },
    ];
    expect(calculateArea(points)).toBe(0.335);
  });

  it("calculates the area of a line", () => {
    const points = [
      { x: 0.1, y: 0.1 },
      { x: 0.2, y: 0.2 },
      { x: 0.6, y: 0.6 },
      { x: -0.3, y: -0.3 },
    ];
    expect(calculateArea(points)).toBe(0);
  });

  it("calculates the area of a polygon with less than 3 points", () => {
    const points = [
      { x: 0.1, y: 0.1 },
      { x: 0.2, y: 0.2 },
    ];
    expect(calculateArea(points)).toBe(0);
  });

  it("calculates the area of a polygon with overlapping areas", () => {
    const points = [
      { x: 0.22, y: 0.12 },
      { x: 0.33, y: 0.71 },
      { x: 0.55, y: 0.31 },
      { x: -0.3, y: 0.5 },
      { x: 0.4, y: -0.3 },
      { x: 0.31, y: 0.34 },
    ];
    expect(calculateArea(points)).toBe(0.1389);
  });
});

describe("default position calculations ", () => {
  it("calculates default position for line segment", () => {
    // const obj = createCircleModel({ center: [3, 3], radius: 10 });
    const lineSegment = createLineSegmentModel({
      start: { x: 0.3, y: 0.3 },
      end: { x: 0.1, y: 0.1 },
    });
    const position = calculateDefaultPosition(lineSegment);
    expect(position).toEqual({ x: 0.3 - 0.1 / 4, y: 0.3 - 0.03 * 1.5 });
  });

  it("calculates default position for free draw", () => {
    const freeDraw = createFreeDrawModel({
      points: [
        { x: 0.3, y: 0.3 },
        { x: 0.4, y: 0.4 },
        { x: 0.5, y: 0.5 },
      ],
    });
    const position = calculateDefaultPosition(freeDraw);
    expect(position).toEqual({ x: 0.3 - 0.1 / 4, y: 0.3 - 0.03 * 1.5 });
  });
});

describe("Area of different shapes", () => {
  it("calculates the area of a circle with radius 1", () => {
    expect(
      getArea(createCircleModel({ center: { x: 0.0, y: 0.0 }, radius: 1 })),
    ).toBeCloseTo(Math.PI);
  });

  it("calculates the area of a circle with radius 5", () => {
    expect(
      getArea(createCircleModel({ center: { x: 0.0, y: 0.0 }, radius: 5 })),
    ).toBeCloseTo(25 * Math.PI);
  });

  it("calculates the area of a free draw shape", () => {
    const freeDraw = createFreeDrawModel({
      points: [
        { x: 0.0, y: 0.0 },
        { x: 0.4, y: 0.0 },
        { x: 0.2, y: 0.3 },
      ],
    });
    expect(getArea(freeDraw)).toBe(0.06);
  });

  it("calculates the area of a line segment (should be 0)", () => {
    const lineSegment = createLineSegmentModel({
      start: { x: 0.0, y: 0.0 },
      end: { x: 0.4, y: 0.0 },
    });
    expect(getArea(lineSegment)).toBe(0);
  });
});
