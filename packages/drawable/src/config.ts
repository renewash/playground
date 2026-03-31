import {
  STROKE_WIDTH_DEFAULT,
  STROKE_COLOR_DEFAULT,
  STROKE_COLOR_OPACITY_DEFAULT,
  FILL_COLOR_DEFAULT,
  TWO_POINT_LINE_RADIUS_DEFAULT,
  LABEL_WIDTH_DEFAULT,
  LABEL_HEIGHT_DEFAULT,
  LABEL_FONT_SIZE_DEFAULT,
  LABEL_PADDING_DEFAULT,
} from "./constants";

const config = {
  defaultDrawableObjectStyle: {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
    strokeOpacity: STROKE_COLOR_OPACITY_DEFAULT,
    fillColor: FILL_COLOR_DEFAULT,
  },
  twoPointLineRadiusDefault: TWO_POINT_LINE_RADIUS_DEFAULT,
  labelDefault: {
    width: LABEL_WIDTH_DEFAULT,
    height: LABEL_HEIGHT_DEFAULT,
    fontSize: LABEL_FONT_SIZE_DEFAULT,
    padding: LABEL_PADDING_DEFAULT,
  },
};

export default config;
