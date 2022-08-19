import { Sprite } from 'kontra';
import { data as D, RND, isCollision, CSprite } from './data';
import { windowSheet } from './sprites';

const obstacleWidth = 45;
const obstacleHeight = 155;
const obstacleMaxY = D.height - obstacleHeight - 20 * D.ratio;
const obstacleMinY = 20 * D.ratio;

export function makeObstacle(startX: number, startY: number) {
  const s = new CSprite({
    x: startX, // starting x,y position of the sprite
    y: startY,
    // color: 'teal', // fill color of the sprite rectangle
    width: obstacleWidth, // width and height of the sprite rectangle
    height: obstacleHeight,
    dy: 0, // move the sprite 2px to the right every frame
    dx: D.scrollSpeed,
    animations: windowSheet?.animations,
    enabled: true,
  });

  s.playAnimation('whole');

  return s;
}

export function makeStartingObstacles() {
  const startX1 = D.width;
  const startY1 = D.height / 2 + obstacleHeight / 2;
  const startX2 = D.width * 1.35;
  const startY2 = D.height / 2 - obstacleHeight * 1.5;

  D.obstacles.push(makeObstacle(startX1, startY1));
  D.obstacles.push(makeObstacle(startX2, startY2));
}

export function makeNewObstacle() {
  const xPos = D.width + obstacleWidth * 4 * D.ratio;
  const yPos = RND(obstacleMinY, obstacleMaxY);

  let obstacle = makeObstacle(xPos, yPos);

  D.objectives.forEach((objective) => {
    if (isCollision(objective, obstacle, false, objective.width * 0.5 * D.ratio)) {
      while (isCollision(objective, obstacle, false, objective.width * 0.5 * D.ratio)) {
        obstacle.y -= 20 * D.ratio;
        if (obstacle.y < obstacleMinY) {
          obstacle.y = obstacleMaxY;
        }
      }
    }
  });

  D.obstacles.push(obstacle);
}
