/**
 * Получить рандомное число от 0 до max
 * @type {(max: number) => number}
 * @param max - Верхний лимит (невключительно)
 */
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

export default getRandomInt;
