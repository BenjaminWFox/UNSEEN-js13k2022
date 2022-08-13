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

export function makeObjectiveCollection() {
  const startX = D.width / 2;
  const startY = 100;
  for (let i = 0; i < 10; i += 1) {
    const sX = (startX + (objectiveWidth * 4 * i))

    D.objectives.push(makeObjective(sX, startY))
  }
}
