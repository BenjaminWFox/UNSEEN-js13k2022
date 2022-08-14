import { Sprite } from 'kontra';
import { data as D, RND, isCollision } from './data';

const obstacleWidth = D.refWidth * 0.25;
const obstacleHeight = obstacleWidth * 10;
const obstacleMaxY = D.height - obstacleHeight - (20 * D.ratio);
const obstacleMinY = 20 * D.ratio

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
  const startY2 = D.height / 2 - obstacleHeight * 1.5;

  D.obstacles.push(makeObstacle(startX1, startY1));
  D.obstacles.push(makeObstacle(startX2, startY2));
}

export function makeNewObstacle() {
  const xPos = D.width + (obstacleWidth * 4 * D.ratio);
  const yPos = RND(obstacleMinY, obstacleMaxY);

  let obstacle = makeObstacle(xPos, yPos);
  let isObstructed = false;

  D.objectives.forEach((objective) => {
    if (isCollision(objective, obstacle, false, (objective.width * .5 * D.ratio))) {
      console.log('IS COLLIDING', objective.x, objective.y, obstacle.x, obstacle.y);
      while (isCollision(objective, obstacle, false, (objective.width * .5 * D.ratio))) {
        obstacle.y -= (20 * D.ratio)
        console.log('ADJUSTING HEIGHT', obstacle.y);
        if (obstacle.y < obstacleMinY) {
          obstacle.y = obstacleMaxY
        }
      }
    }
  })

  D.obstacles.push(obstacle);
}
