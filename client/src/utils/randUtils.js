export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (parseFloat(max) - parseFloat(min) + 1)) + parseFloat(min);
