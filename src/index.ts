import {
  Sprite,
  SpriteSheet,
  Animation,
  GameLoop,
  initKeys,
  keyPressed,
  KText,
  initPointer,
  pointerPressed,
  getPointer,
} from 'kontra';
import { data as D, isCollision, RND } from './data';
import { makeStartingObjectives, makeObjectiveSet } from './objectives';
import { makeStartingObstacles, makeNewObstacle } from './obstacles';
import { BuyButton, FlyButton } from './buttons';
import bodyImg from './images/body.svg';
import wingsImg from './images/wings.png';

function setCSSHeightVar() {
  console.log('setting style');
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', () => {
  setCSSHeightVar();
});

setCSSHeightVar();

initKeys();
initPointer();

const birdWidth = 100; // D.refWidth;
const birdHeight = birdWidth / 4;
let bird = Sprite({
  x: birdWidth * 3,
  y: D.height / 2 - birdHeight / 2,
  // color: 'red',
  width: birdWidth,
  height: birdHeight,
  dy: -20 * D.ratio,
});

let birdSprite: Sprite;
let wingSprite: Sprite;

const birdSvg = new Image();
birdSvg.src = bodyImg;
birdSvg.width = birdWidth;
birdSvg.height = birdHeight;
birdSvg.onload = function () {
  birdSprite = Sprite({
    x: birdWidth * 3,
    y: D.height / 2 - birdHeight / 2,
    image: birdSvg,
  });

  const birdSheetSvg = new Image();
  birdSheetSvg.src = wingsImg;
  birdSheetSvg.width = 600;
  birdSheetSvg.height = 130;
  birdSheetSvg.onload = function () {
    let spriteSheet = SpriteSheet({
      image: birdSheetSvg,
      frameWidth: 100,
      frameHeight: 130,
      animations: {
        fly: {
          frames: '0..5',
          frameRate: 30,
        },
        stop: {
          frames: '5',
          frameRate: 1,
        },
      },
    });
    wingSprite = Sprite({
      x: birdWidth * 3.5,
      y: birdSprite.y,
      anchor: { x: 0.5, y: 0.5 },
      animations: spriteSheet.animations,
    });
  };
};

function setBirdData(data: Record<string, any>) {
  Object.keys(data).forEach((k) => {
    bird[k] = data[k];

    if (birdSprite) {
      birdSprite[k] = data[k];
    }

    if (wingSprite) {
      if (k === 'y' && data.y !== D.maxY && data.y !== D.minY) {
        wingSprite.y = data.y - 200;
      } else {
        wingSprite[k] = data[k];
      }
    }
  });
}

// makeDebugObjectives();
makeStartingObjectives();
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

function isPickup(sprite: Sprite) {
  return isCollision(bird, sprite, false);
}

function isWindowCollision(sprite: Sprite) {
  return D.playing && isCollision(bird, sprite, true, -2 * D.ratio);
}

function updateGameScrolling() {
  // update the game state
  if (D.playing) {
    D.scrollSpeed = D.baseSpeed + D.baseSpeed * (D.distance / 10000);
    D.distance += 1;
  } else if (D.ending) {
    if (D.scrollSpeed < 0) {
      D.scrollSpeed = Math.min(D.scrollSpeed + D.taper, 0);
    }
    if (bird.dx > 0) {
      setBirdData({ dx: Math.max(bird.dx - D.taper, 0) });
      // bird.dx = Math.max(bird.dx - D.taper, 0);
    }
  }
}

function updateObjectives() {
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

  if (D.objectives.length && D.objectives.at(-1)!.x < D.width) {
    makeObjectiveSet();
  }
}

function updateObstacles() {
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

    if (isWindowCollision(sprite)) {
      windowCollision();
    }

    if (sprite.dx !== D.scrollSpeed) {
      sprite.dx = D.scrollSpeed;
    }

    sprite.update();
  }

  if (D.distance - D.lastObstacleSpawn > 150 && D.distance % 50 === 0) {
    D.canSpawnObstacle = true;
  }

  if (D.canSpawnObstacle && RND(1, 30) === 30) {
    D.canSpawnObstacle = false;
    D.lastObstacleSpawn = D.distance;

    makeNewObstacle();
  }
}

function updateBird() {
  /**
   * Move the bird up or down
   *
   * Keep the bird between top & bottom canvas bounds
   *
   * Update the bird
   */
  if (
    (keyPressed('space') || pointerPressed('left') || (getPointer().touches as any).length > 0) &&
    bird.dy > D.maxDyUp &&
    (D.playing || bird.dx > 2 * D.ratio)
  ) {
    // bird.dy -= D.maxDyUpChange;
    setBirdData({ dy: bird.dy - D.maxDyUpChange });
  } else if (bird.dy < D.maxDyDown) {
    // bird.dy += D.maxDyDownChange;
    setBirdData({ dy: bird.dy + D.maxDyDownChange });
  }

  // this is birdWidth because that is birdHeight * 2
  if (bird.y > D.maxY) {
    setBirdData({ y: D.maxY, dy: 0 });
    // bird.y = D.maxY;
    // bird.dy = 0;
  } else if (bird.y < D.minY) {
    setBirdData({ y: D.minY, dy: 0 });
    // bird.y = D.minY;
    // bird.dy = 0;
  }

  // birdSprite.dy = bird.dy;
  // birdSprite.y = bird.y;
  bird.update();
  if (birdSprite) {
    birdSprite.update();
  }
  if (wingSprite) {
    wingSprite.update();
  }
}

let loop = GameLoop({
  // create the main game loop
  update: function () {
    updateGameScrolling();

    if (D.playing || D.ending) {
      updateObjectives();

      updateObstacles();

      updateBird();
    }

    if (D.menuing) {
    }
  },
  render: function () {
    // render the game state
    D.context.fillStyle = 'blue';
    D.context.fillRect(0, 0, D.canvas.width, D.canvas.height);
    // D.context.fillStyle = 'black';
    // D.context.fillRect(0, D.canvas.height / 2, D.canvas.width, 1);

    bird.render();
    if (birdSprite) {
      birdSprite.render();
    }
    if (wingSprite) {
      wingSprite.render();
    }

    D.objectives.forEach((objective) => {
      objective.render();
    });

    D.obstacles.forEach((obstacle) => {
      obstacle.render();
    });

    renderStats();

    if (D.menuing) {
      FlyButton.render();
      BuyButton.render();
    }
  },
});

function windowCollision() {
  D.setEnding();
  // bird.dx = D.scrollSpeed * -.25; // Enable for forward-moving finish
  // bird.dx = D.scrollSpeed;
  setBirdData({ dx: D.scrollSpeed });
  if (wingSprite) {
    wingSprite.playAnimation('stop');
  }
  // birdSprite.dx = bird.dx;
  // loop.stop();
}

D.setPlaying();
export default loop.start();
