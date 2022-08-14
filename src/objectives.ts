import { Sprite } from 'kontra';
import { data as D } from './data';

const objectiveWidth = D.refWidth * 0.25;
const objectiveHeight = objectiveWidth;

export function makeObjective(startX: number, startY: number) {
  return Sprite({
    x: startX, // starting x,y position of the sprite
    y: startY,
    color: 'yellow', // fill color of the sprite rectangle
    width: objectiveWidth, // width and height of the sprite rectangle
    height: objectiveHeight,
    dy: 0, // move the sprite 2px to the right every frame
    dx: D.scrollSpeed,
  });
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function makeStraight(initialX?: number, initialY?: number) {
  const startX = initialX || D.width * 1.25;
  const startY = initialY || randomIntFromInterval(D.minY + (10 * D.ratio), D.maxY - (10*D.ratio));
  const offset = objectiveHeight / 2  ;

  for (let i = 0; i < 20; i += 1) {
    const sX = startX + objectiveWidth * 2  * i;
    const sY = i % 2 === 0 ? startY + offset : startY - offset

    D.objectives.push(makeObjective(sX, sY));
  }
}

export function makeDebugObjectives() {
  makeStraight(D.width / 2, D.height / 2 - objectiveHeight / 2);
}

export function makeStartingObjectives() {
  makeStraight(undefined, D.height / 2 - objectiveHeight / 2);
}
