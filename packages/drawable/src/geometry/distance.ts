export const distance = (startPoint, endPoint) => {
  const width = startPoint[0] - endPoint[0];
  const height = startPoint[1] - endPoint[1];
  return Math.hypot(width, height);
};

console.log(distance([0, 0], [5, 5]));
