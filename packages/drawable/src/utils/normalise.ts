/**
 * Denormalise point to original image size
 *
 * @param x
 * @param y
 * @param param2
 * @returns
 */
export const denormalisePoint = (
  x: number,
  y: number,
  { imageWidth, imageHeight }: { imageWidth: number; imageHeight?: number },
): number[] => {
  if (imageHeight === undefined) {
    imageHeight = imageWidth;
  }

  const denormalizedX = x * imageWidth;
  const denormalizedY = y * imageHeight;
  return [denormalizedX, denormalizedY];
};

/**
 * Denormalise all points to original image size
 *
 * @param points
 * @param param1
 * @returns
 */
export const denormaliseAllPoints = (
  points: number[],
  { imageWidth, imageHeight }: { imageWidth: number; imageHeight?: number },
): number[] => {
  if (imageHeight === undefined) {
    return points.map((point) => point * imageWidth);
  }

  return points.map((point, index) =>
    index % 2 === 0 ? point * imageWidth : point * imageHeight,
  );
};

/**
 * Normalise point to original image size
 * @param x
 * @param y
 * @param param2
 * @returns
 */
export const normalisePoint = (
  x: number,
  y: number,
  { imageWidth, imageHeight }: { imageWidth: number; imageHeight?: number },
): number[] => {
  if (imageHeight === undefined) {
    imageHeight = imageWidth;
  }

  const normalizedX = x / imageWidth;
  const normalizedY = y / imageHeight;
  return [normalizedX, normalizedY];
};

/**
 * Normalise all points to original image size
 *
 * @param points
 * @param param1
 * @returns
 */
export const normaliseAllPoints = (
  points: number[],
  { imageWidth, imageHeight }: { imageWidth: number; imageHeight?: number },
): number[] => {
  if (imageHeight === undefined) {
    return points.map((point) => point / imageWidth);
  }

  return points.map((point, index) =>
    index % 2 === 0 ? point / imageWidth : point / imageHeight,
  );
};
