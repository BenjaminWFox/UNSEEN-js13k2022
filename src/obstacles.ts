import { Sprite } from 'kontra';
import { data as D } from './data';

const obstacleWidth = D.refWidth * 0.25;
const obstacleHeight = obstacleWidth * 10;

export function makeObstacle(startX: number, startY: number) {
  return Sprite({
    x: startX, // starting x,y position of the sprite
    y: startY,
    color: 'teal', // fill color of the sprite rectangle
    width: obstacleWidth, // width and height of the sprite rectangle
    height: obstacleHeight,
    dy: 0, // move the sprite 2px to the right every frame
    dx: D.scrollSpeed,
  });
}

export function makeStartingObstacles() {
  const startX1 = D.width * 0.75;
  const startY1 = D.height / 2 + obstacleHeight / 2;
  const startX2 = D.width * 1.1;
  const startY2 = D.height / 2 - obstacleHeight;

  D.obstacles.push(makeObstacle(startX1, startY1));
  D.obstacles.push(makeObstacle(startX2, startY2));
}

export function makeNewObstacle() {
  // // const startX = D.width - (obstacleWidth * 3);
  // const startX = D.width * .75;
  // const startY = D.height / 2 - (obstacleHeight / 2);
  // D.obstacles.push(makeObstacle(startX, startY))
}
