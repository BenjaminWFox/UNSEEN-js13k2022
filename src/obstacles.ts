import { Sprite } from "kontra";
import { data as D } from './data';

const obstacleWidth = D.refWidth * .25
const obstacleHeight = obstacleWidth * 10;

export function makeObstacle(startX: number, startY: number) {
  return Sprite({
    x: startX,        // starting x,y position of the sprite
    y: startY,
    color: 'teal',  // fill color of the sprite rectangle
    width: obstacleWidth,     // width and height of the sprite rectangle
    height: obstacleHeight,
    dy: 0,          // move the sprite 2px to the right every frame
    dx: D.scrollSpeed
  });
}

export function makeNewObstacle() {
  // const startX = D.width - (obstacleWidth * 3);
  const startX = 400;
  const startY = D.height / 2 - (obstacleHeight / 2);
  
  D.obstacles.push(makeObstacle(startX, startY))
}
