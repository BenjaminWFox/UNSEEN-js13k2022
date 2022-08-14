import { Sprite, GameLoop, initKeys, keyPressed, KText, initPointer, pointerPressed, getPointer } from 'kontra';
import { data as D } from './data';
import { makeStartingObjectives, makeDebugObjectives } from './objectives';
import { makeStartingObstacles, makeNewObstacle } from './obstacles';

initKeys();
initPointer();

console.log('This is my game running!', D.canvas, D.canvas.width, D.canvas.height, D.height);

console.log(D.maxDyUp, D.maxDyDown, D.maxDyUpChange, D.maxDyDownChange);

console.log('DATA', D);

const birdWidth = D.refWidth;
const birdHeight = birdWidth / 2;
let bird = Sprite({
  x: (birdWidth * 3), // starting x,y position of the sprite
  y: (D.height / 2 - birdHeight / 2),
  color: 'red', // fill color of the sprite rectangle
  width: birdWidth, // width and height of the sprite rectangle
  height: birdHeight,
  dy: -20 * D.ratio, // move the sprite 2px to the right every frame
});

makeStartingObjectives();
makeDebugObjectives();
makeStartingObstacles();

const distanceText = KText({
  text: '',
  font: `${D.font}`,
  color: 'white',
  x: 20 * D.ratio,
  y: 20 * D.ratio,
  textAlign: 'left',
  anchor: { x: 0, y: 0 },
});

function renderStats() {
  // distanceText.text = `Distance: ${D.distance} Pickups: ${D.pickups} Speed: ${D.scrollSpeed}`;
  distanceText.text = `Distance: ${D.distance} Pickups: ${D.pickups}`;
  distanceText.render();
}

function isCollision(sprite: Sprite, beLenient: boolean) {
  const leniency = beLenient ? 0.5 : 0;

  if (sprite.x > bird.x + bird.width || sprite.x + sprite.width < bird.x + bird.width * leniency) {
    return false;
  }

  if (sprite.y + sprite.height < bird.y || sprite.y > bird.y + bird.height) {
    return false;
  }

  return true;
}

function isPickup(sprite: Sprite) {
  return isCollision(sprite, false);
}

function isGameOver(sprite: Sprite) {
  return isCollision(sprite, true);
}

let loop = GameLoop({
  // create the main game loop
  update: function () {
    // update the game state
    D.scrollSpeed = D.baseSpeed + D.baseSpeed * (D.distance / 10000);
    D.distance = Math.round(D.distance - D.scrollSpeed);

    /**
     * Loop to detect collision with Obstacles
     */
    for (let i = 0; i < D.obstacles.length; i += 1) {
      const sprite = D.obstacles[i];

      if (sprite.x < 0 - sprite.width) {
        D.obstacles.splice(i, 1);
        i -= 1;

        continue;
      }

      if (isGameOver(sprite)) {
        gameOver();

        continue;
      }

      if (sprite.dx !== D.scrollSpeed) {
        sprite.dx = D.scrollSpeed;
      }

      sprite.update();
    }

    /**
     * Loop to detect pickups w/ objectives
     */
    for (let i = 0; i < D.objectives.length; i += 1) {
      const sprite = D.objectives[i];

      if (sprite.x < 0 - sprite.width) {
        D.objectives.splice(i, 1);
        i -= 1;

        continue;
      }

      if (isPickup(sprite)) {
        D.pickups += 1;

        D.objectives.splice(i, 1);
        i -= 1;

        continue;
      }

      if (sprite.dx !== D.scrollSpeed) {
        sprite.dx = D.scrollSpeed;
      }

      sprite.update();
    }

    /**
     * Move the bird up or down
     *
     * Keep the bird between top & bottom canvas bounds
     *
     * Update the bird
     */
    if (
      (keyPressed('space') || pointerPressed('left') || (getPointer().touches as any).length > 0) &&
      bird.dy > D.maxDyUp
    ) {
      bird.dy -= D.maxDyUpChange;
    } else if (bird.dy < D.maxDyDown) {
      bird.dy += D.maxDyDownChange;
    }

    // this is birdWidth because that is birdHeight * 2
    if (bird.y > D.maxY) {
      bird.y = D.height - birdWidth;
      bird.dy = 0;
    } else if (bird.y < D.minY) {
      bird.y = birdHeight;
      bird.dy = 0;
    }

    bird.update();
  },
  render: function () {
    // render the game state
    D.context.fillStyle = 'blue';
    D.context.fillRect(0, 0, D.canvas.width, D.canvas.height);
    D.context.fillStyle = 'black';
    D.context.fillRect(0, D.canvas.height / 2, D.canvas.width, 1);

    bird.render();

    D.objectives.forEach((objective) => {
      objective.render();
    });

    D.obstacles.forEach((obstacle) => {
      obstacle.render();
    });

    renderStats();
  },
});

function gameOver() {
  D.playing = false;
  loop.stop();
}

export default loop;
