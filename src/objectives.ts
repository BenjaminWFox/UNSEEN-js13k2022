import { Sprite } from "kontra";
import { data as D } from './data';

const objectiveWidth = D.refWidth * .25
const objectiveHeight = objectiveWidth;

export function makeObjective(startX: number, startY: number) {
  return Sprite({
    x: startX,        // starting x,y position of the sprite
    y: startY,
    color: 'yellow',  // fill color of the sprite rectangle
    width: objectiveWidth,     // width and height of the sprite rectangle
    height: objectiveHeight,
    dy: 0,          // move the sprite 2px to the right every frame
    dx: D.scrollSpeed
  });
}

export function makeStartingObstacles() {
  const startX1 = D.width / 2;
  const startY1 = 100 * D.ratio;
  const startX2 = D.width / 2;
  const startY2 = 100 * D.ratio;
  
  for (let i = 0; i < 10; i += 1) {
    const sX1 = (startX1 + (objectiveWidth * 4 * i))
    const sX2 = (startX2 + (objectiveWidth * 4 * i))

    D.objectives.push(makeObjective(sX1, startY1))
    D.objectives.push(makeObjective(sX2, startY2))
  }
}

export function makeObjectiveCollection() {
  const startX = D.width / 2;
  const startY = 100 * D.ratio;
  for (let i = 0; i < 10; i += 1) {
    const sX = (startX + (objectiveWidth * 4 * i))

    D.objectives.push(makeObjective(sX, startY))
  }
}
