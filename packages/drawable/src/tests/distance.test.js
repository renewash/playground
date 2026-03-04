import { describe, expect, test } from "vitest";
import {
  calculateEuclideanDistance,
  calculateArea,
  polygonArea,
} from "../geometry/calculate.js";

describe("distance", () => {
  test("calculates the distance between two points", () => {
    const pointA = [0, 0];
    const pointB = [3, 4];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  test("calculates the distance between two points with negative coordinates", () => {
    const pointA = [-1, -1];
    const pointB = [-4, -5];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });

  test("calculates the distance between two identical points", () => {
    const pointA = [2, 2];
    const pointB = [2, 2];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(0);
  });

  test("calculates points in decimal coordinates", () => {
    const pointA = [1.5, 2.5];
    const pointB = [4.5, 6.5];
    expect(calculateEuclideanDistance(pointA, pointB)).toBe(5);
  });
});

describe("area", () => {
  test("calculates the area of a triangle", () => {
    const points = [0, 0, 4, 0, 2, 3];
    expect(calculateArea(points)).toBe(6);
  });

  test("calculates the area of a square", () => {
    const points = [0, 0, 2, 0, 2, 2, 0, 2];
    expect(calculateArea(points)).toBe(4);
  });

  test("calculates the area of a rectangle", () => {
    const points = [0, 0, 4, 0, 4, 2, 0, 2];
    expect(calculateArea(points)).toBe(8);
  });

  test("calculates the area of an irregular polygon", () => {
    const points = [7, 4, 3, 7, 1, 1, -3, 5, 4, -3];
    expect(calculateArea(points)).toBe(33.5);
  });

  test("calculates the area of a line", () => {
    const points = [1, 1, 2, 2, 6, 6, -3, -3];
    expect(calculateArea(points)).toBe(0);
  });

  test("calculates the area of a polygon with less than 3 points", () => {
    const points = [1, 1, 2, 2];
    expect(calculateArea(points)).toBe(0);
  });

  // TODO: if change to point / vector objects, need to update this test
  test("throws an error for a polygon with an odd number of coordinates", () => {
    const points = [1, 1, 2, 2, 3];
    expect(() => calculateArea(points)).toThrow();
  });

  test("overlaps with polygonArea function", () => {
    const points = [22, 12, 33, 71, 55, 31, -3, 5, 4, -3, 31, 34];
    expect(calculateArea(points)).toBe(753);
  });
});
