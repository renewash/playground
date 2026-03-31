import { Points, PolygonSegmentModel, ShapeStyle } from "../types";
import { TWO_POINT_LINE_RADIUS_DEFAULT } from "../../constants";
import { calculateArea } from "../calculate";
import config from "../../config";

interface CreatePolygonSegmentModel {
  points: Points;
  radius?: number;
  style?: ShapeStyle;
}
export const createPolygonSegmentModel = ({
  points,
  radius = TWO_POINT_LINE_RADIUS_DEFAULT,
  style = config.defaultDrawableObjectStyle,
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
