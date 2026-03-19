import { Points, PolygonSegmentModel, ShapeStyle } from "../types";
import {
  STROKE_COLOR_DEFAULT,
  STROKE_WIDTH_DEFAULT,
  TWO_POINT_LINE_RADIUS_DEFAULT,
} from "../../constants";
import { calculateArea } from "../..";

interface CreatePolygonSegmentModel {
  points: Points;
  radius?: number;
  style?: ShapeStyle;
}
export const createPolygonSegmentModel = ({
  points,
  radius = TWO_POINT_LINE_RADIUS_DEFAULT,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreatePolygonSegmentModel): PolygonSegmentModel => {
  const area = calculateArea(points);

  const obj: PolygonSegmentModel = {
    id: crypto.randomUUID(),
    type: "polygonSegment",
    points,
    radius,
    area,
    style,
  };

  return obj;
};
