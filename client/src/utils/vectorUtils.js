export const normalizeVector = (x, y) => [x / getVectorLength(x, y), y / getVectorLength(x, y)];
export const getVectorLength = (endX, endY, startX = 0, startY = 0) =>
  Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
