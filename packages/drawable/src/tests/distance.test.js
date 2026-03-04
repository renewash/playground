import { describe, expect, test } from "vitest";
import { distance } from "../geometry/distance.js";

describe("distance", () => {
  // test("calculates the distance between two points", () => {
  //   const pointA = { x: 0, y: 0 };
  //   const pointB = { x: 3, y: 4 };
  //   expect(distance(pointA, pointB)).toBe(5);
  // });

  // test("calculates the distance between two points with negative coordinates", () => {
  //   const pointA = { x: -1, y: -1 };
  //   const pointB = { x: -4, y: -5 };
  //   expect(distance(pointA, pointB)).toBe(5);
  // });

  // test("calculates the distance between two identical points", () => {
  //   const pointA = { x: 2, y: 2 };
  //   const pointB = { x: 2, y: 2 };
  //   expect(distance(pointA, pointB)).toBe(0);
  // });

  test("calculates the distance between two points", () => {
    const pointA = [0, 0];
    const pointB = [3, 4];
    expect(distance(pointA, pointB)).toBe(5);
  });

  test("calculates the distance between two points with negative coordinates", () => {
    const pointA = [-1, -1];
    const pointB = [-4, -5];
    expect(distance(pointA, pointB)).toBe(5);
  });

  test("calculates the distance between two identical points", () => {
    const pointA = [2, 2];
    const pointB = [2, 2];
    expect(distance(pointA, pointB)).toBe(0);
  });
});
