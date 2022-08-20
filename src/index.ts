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
import { CSprite, data as D, getStats, isCollision, resetData, RND, setStats } from './data';
import { makeStartingObjectives, makeObjectiveSet, makeDebugObjectives, makeDisplayObjective } from './objectives';
import { makeStartingObstacles, makeNewObstacle } from './obstacles';
import { makeSprites, bird, crowSprite, dollarImg, makeTinybird } from './sprites';
import { setAvailable, setupStore } from './store';

let displayDollar: Sprite;
let displayBird: CSprite;

function setCSSHeightVar() {
  const screens = document.getElementById('wrapper');
  if (screens) {
    screens.style.maxWidth = `${D.canvas.offsetWidth}px`
    screens.style.minWidth = `${D.canvas.offsetWidth}px`
    screens.style.height = `${D.canvas.offsetHeight}px`
    screens.style.left = `${D.canvas.offsetLeft}`;
    screens.style.top = `${D.canvas.offsetTop}px`;
  }

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function showElement(elId: string, doShow: boolean, displayType = 'block') {
  const el = document.getElementById(elId);
  if (el) {
    el.style.display = doShow ? displayType : 'none';
  }
}

function setDomStuff() {
  const playBtn = document.getElementById('playBtn');
  const shopBtn = document.getElementById('shopBtn');
  playBtn?.addEventListener('click', () => {
    startGame()
  })
  shopBtn?.addEventListener('click', () => {
    D.setShopping();
    D.context.clearRect(0, 0, D.canvas.width, D.canvas.height);
    showElement('store', true, 'flex');
    setAvailable();
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

const moneyText = KText({
  text: '',
  font: `20px Arial`,
  color: 'white',
  x: 60,
  y: 52,
  textAlign: 'left',
  anchor: { x: 0, y: 0 },
});

const livesText = KText({
  text: '0',
  font: `20px Arial`,
  color: 'white',
  x: 60,
  y: 75,
  textAlign: 'left',
  anchor: { x: 0, y: 0 },
});

function renderStats() {
  distanceText.text = `${String(D.distance).padStart(5, '0')}m`;
  moneyText.text = `${D.pickups}`;
  livesText.text = D.powerups.life.toString();
  distanceText.render();
  moneyText.render();
  displayDollar.render();
  livesText.render();
  displayBird.render();
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

function windowCollision(sprite: CSprite, index: number) {
  // bird.dx = D.scrollSpeed * -.25; // Enable for forward-moving finish
  // bird.dx = D.scrollSpeed;
  sprite.playAnimation('break');

  if (D.powerups.life > 0) {
    D.powerups.life -= 1;
    sprite.enabled = false;
  } else {
    D.setEnding();
    setBirdData({ dx: D.scrollSpeed / 5 });
    crowSprite.playAnimation('hit');
  }
}

function endCurrentRun() {
  const stats = getStats();
  crowSprite.playAnimation('stop');
  setStats({
    money: stats.money + D.pickups,
    highScore: D.distance,
  })
  showElement('wrapper', true)
  D.setMenuing();
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
    (keyPressed('space') || pointerPressed('left') || (getPointer().touches as any).length > 0)
    && bird.dy > D.maxDyUp &&
    (D.playing || bird.dx > 2)
  ) {
    setBirdData({ dy: bird.dy - D.maxDyUpChange });
  } else if (bird.dy < D.maxDyDown) {
    setBirdData({ dy: bird.dy + D.maxDyDownChange });
  }

  if (bird.y > D.maxY) {
    setBirdData({ y: D.maxY, dy: 0 });
  } else if (bird.y < D.minY) {
    setBirdData({ y: D.minY, dy: 0 });
  }

  if (bird.dx < 0) {
    bird.dx += .011;
  } else {
    bird.dx = 0;
    bird.x = Math.round(bird.x);
  }

  if (D.ending && bird.y === D.maxY) {
    endCurrentRun();
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
    if (!D.shopping) {

      crowSprite.render();

      D.objectives.forEach((objective) => {
        objective.render();
      });

      D.obstacles.forEach((obstacle) => {
        obstacle.render();
      });

      bird.render();

      renderStats();
    }
  },
});

function startGame() {
  showElement('wrapper', false)
  showElement('store', false)

  resetData();

  setBirdData({
    x: D.birdStartX,
    y: D.birdStartY,
    dy: D.birdStartDy,
    dx: 0,
  })

  crowSprite.playAnimation('fly');

  D.setPlaying();

  loop.start()

  makeStartingObjectives();
  makeStartingObstacles();

  displayDollar = makeDisplayObjective();
  displayBird = makeTinybird();
}

setupStore();
makeSprites(startGame);
