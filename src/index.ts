import {
  Sprite,
  SpriteSheet,
  GameLoop,
  initKeys,
  keyPressed,
  KText,
  initPointer,
  pointerPressed,
  getPointer,
} from 'kontra';
import { CSprite, data as D, isCollision, resetData, RND } from './data';
import { makeStartingObjectives, makeObjectiveSet, makeDebugObjectives } from './objectives';
import { makeStartingObstacles, makeNewObstacle } from './obstacles';
import { makeSprites, bird, crowSprite } from './sprites';

function setCSSHeightVar() {
  const screens = document.getElementById('wrapper');
  if (screens) {
    screens.style.left = '0';
    screens.style.top = `${D.canvas.offsetTop}px`;
  }

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function showMenu(doShow: boolean) {
  const wrapper = document.getElementById('wrapper');
  if (wrapper) {
    wrapper.style.display = doShow ? 'block' : 'none';
  }
}

function setDomStuff() {
  const playBtn = document.getElementById('playBtn');
  playBtn?.addEventListener('click', () => {
    showMenu(false)
    startGame()
  })
}

window.addEventListener('resize', () => {
  setCSSHeightVar();
});

setCSSHeightVar();
setDomStuff();
initKeys();
initPointer();

function setBirdData(data: Record<string, any>) {
  Object.keys(data).forEach((k) => {
    if (k === 'y') {
      crowSprite.y = data.y - D.hitboxOffset;
      bird.y = data.y;
    } else {
      crowSprite[k] = data[k]
      bird[k] = data[k];
    }
  });
}

const distanceText = KText({
  text: '',
  font: `${D.font}`,
  color: 'white',
  x: 20,
  y: 20,
  textAlign: 'left',
  anchor: { x: 0, y: 0 },
});

function renderStats() {
  // distanceText.text = `Distance: ${D.distance} Pickups: ${D.pickups} Speed: ${D.scrollSpeed}`;
  distanceText.text = `Distance: ${D.distance} Pickups: ${D.pickups}`;
  distanceText.render();
}

function isPickup(sprite: CSprite) {
  return isCollision(bird, sprite, false);
}

function isWindowCollision(sprite: CSprite) {
  return D.playing && isCollision(bird, sprite, true, -2);
}

function updateGameScrolling() {
  // update the game state
  if (D.playing) {
    D.scrollSpeed = D.baseSpeed + D.baseSpeed * (D.distance / 5000);
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
      windowCollision(sprite, i);
    }

    if (sprite.dx !== D.scrollSpeed) {
      sprite.dx = D.scrollSpeed;
    }

    sprite.update();
  }

  if (D.distance - D.lastObstacleSpawn > 50 && D.distance % 25 === 0) {
    D.canSpawnObstacle = true;
  }

  if (D.canSpawnObstacle && RND(1, 40) === 40) {
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
    (D.playing || bird.dx > 2)
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

  if (bird.dx < 0) {
    bird.dx += .011;
  } else {
    bird.dx = 0;
  }

  if (D.ending && bird.y === D.maxY) {
    console.log(bird.y, D.maxY)
    crowSprite.playAnimation('stop');
  }

  bird.update();
  crowSprite.update();
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
    // Create gradient
    // var grd = D.context.createLinearGradient(D.canvas.width / 2, 0,  D.canvas.width / 2, D.canvas.height);
    // grd.addColorStop(0, "black");
    // grd.addColorStop(1, "blue");
    // D.context.fillStyle = grd;
    // D.context.fillRect(0, 0, D.canvas.width, D.canvas.height);

    // Fill with solid
    // D.context.fillStyle = 'indigo';
    // D.context.fillRect(0, 0, D.canvas.width, D.canvas.height);

    // render the debug line
    // D.context.fillStyle = 'black';
    // D.context.fillRect(0, D.canvas.height / 2, D.canvas.width, 1);

    crowSprite.render();

    D.objectives.forEach((objective) => {
      objective.render();
    });

    D.obstacles.forEach((obstacle) => {
      obstacle.render();
    });

    bird.render();

    renderStats();
  },
});

function windowCollision(sprite: CSprite, index: number) {
  // bird.dx = D.scrollSpeed * -.25; // Enable for forward-moving finish
  // bird.dx = D.scrollSpeed;
  sprite.playAnimation('break');
  
  if (D.powerups.life > 0) {
    D.powerups.life -= 1;
    sprite.enabled = false;
  } else {
    D.setEnding();
    showMenu(true)

    setBirdData({ dx: D.scrollSpeed / 5 });
    crowSprite.playAnimation('hit');
  }
  // loop.stop();
}

function startGame() {
  resetData();

  setBirdData({
    x: D.birdStartX,
    y: D.birdStartY,
    dy: D.birdStartDy,
    dx: 0,
  })

  crowSprite.playAnimation('fly');

  D.setPlaying();

  makeStartingObjectives();
  makeStartingObstacles();

  loop.start()
}

makeSprites();
