import { Sprite, GameLoop, initKeys, keyPressed, KText, initPointer, pointerPressed, getPointer } from 'kontra';
import { CSprite, data as D, getStats, isCollision, resetData, RND, setStats } from './data';
import { makeStartingObjectives, makeObjectiveSet, makeDisplayObjective } from './objectives';
import { makeStartingObstacles, makeNewObstacle } from './obstacles';
import { makeSprites, bird, crowSprite, makeTinybird } from './sprites';
import { zzfx } from './zzfx';
import { addCoilItems, setAvailable, setupItems, setupStore } from './store';

const sounds = {
  pickup: () => zzfx(...[0.25, , 4, 0.01, , 0.09, 1, 1.39, -41, -1.7, , , , , 3, , 0.01, 0.41, 0.04]),
  flap: () => zzfx(...[0.05, , 562, 0.04, , 0.07, 4, 0.26, 6.4, , 88, 0.22, , , 4.8, 0.2, , 0.26, 0.01]),
  breakOuch: () => zzfx(...[0.5, 0, 222, 0.02, 0.1, 0.11, 4, 0.45, -1.5, , , , , 2, , 0.2, , 0.61, 0.2, 0.11]),
  breakMiss: () => zzfx(...[0.5, , 150, , 0.08, 0.13, 4, 2.84, 0.1, , , , 0.07, 1.7, , 0.1, 0.09, 0.8, 0.08, 0.2]),
  miss: () => zzfx(...[0.25, , 259, 0.04, 0.06, 0.09, , 0.25, 12, , , , , 0.7, , , , 0.86, 0.1]),
  end: () => zzfx(...[1, 0, 5, , 0.28, 0.07, 2, 0.17, , , , , 0.01, 0.4, , 0.9, 0.15, 0.24, 0.07, 0.05]),
};

let displayDollar: Sprite;
let displayBird: CSprite;

function setCSSHeightVar() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const screens = document.getElementById('wrapper');
  if (screens) {
    screens.style.maxWidth = `${D.canvas.offsetWidth}px`;
    screens.style.minWidth = `${D.canvas.offsetWidth}px`;
    screens.style.height = `${D.canvas.offsetHeight}px`;
    screens.style.left = `${D.canvas.offsetLeft}px`;
    screens.style.top = `${D.canvas.offsetTop}px`;
  }
}

function showElement(elId: string, doShow: boolean, displayType = 'block') {
  const el = document.getElementById(elId);
  if (el) {
    el.style.display = doShow ? displayType : 'none';
  }
}

function renderItem(parent: HTMLElement, content: string) {
  const el = document.createElement('p');
  el.classList.add('stat');
  el.innerHTML = content;
  parent.appendChild(el);
}

function renderStats() {
  const stats = getStats();
  const wrapper = document.getElementById('statItems')!;
  wrapper.innerHTML = '';

  renderItem(wrapper, `High Score:<br/>${stats.highScore}`);
  renderItem(wrapper, `Times Played:<br/>${stats.plays}`);
  renderItem(wrapper, `Money Earned:<br/>${stats.earned}`);
  renderItem(wrapper, `Windows Broken:<br/>${stats.breaks}`);
}

function setDomStuff() {
  const playBtn = document.getElementById('playBtn');
  const shopBtn = document.getElementById('shopBtn');
  const statBtn = document.getElementById('statBtn');
  const fsBtn = document.getElementById('fs');
  renderStats();

  playBtn?.addEventListener('click', () => {
    startGame();
  });
  shopBtn?.addEventListener('click', () => {
    D.setShopping();
    setupItems();
    D.context.clearRect(0, 0, D.canvas.width, D.canvas.height);
    showElement('store', true, 'flex');
    showElement('stats', false);
    setAvailable();
  });
  statBtn?.addEventListener('click', () => {
    D.setShopping();
    D.context.clearRect(0, 0, D.canvas.width, D.canvas.height);
    showElement('store', false, 'flex');
    showElement('stats', true);
    renderStats();
  });
  fsBtn?.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  });
}

window.addEventListener('resize', () => {
  console.log('RESIZE');
  setCSSHeightVar();
});

window.addEventListener('fullscreenchange', () => {
  console.log('FULLSCREEN');
  setCSSHeightVar();
});

// @ts-ignore
if (document.monetization) {
  // @ts-ignore
  document.monetization.addEventListener('monetizationpending', () => console.log('hi'));
  // @ts-ignore
  document.monetization.addEventListener('monetizationstart', () => {
    const stats = getStats();
    const coilMain = document.getElementById('coilMain')!;
    const coilNew = document.getElementById('coilNew')!;

    coilMain.style.display = 'block';

    addCoilItems();

    if (!stats.coil) {
      setStats({
        coil: true,
        money: stats.money + 600,
        earned: stats.earned + 600,
      });
    } else {
      coilNew.style.display = 'none';
    }
  });
} else {
  console.log('No monetization');
}

// @ts-ignore
// document.monetization.dispatchEvent(new Event('monetizationstart'));

window.addEventListener('load', () => {
  console.log('load');
  setCSSHeightVar();
  setDomStuff();
  initKeys();
  initPointer();
});

function setBirdData(data: Record<string, any>) {
  Object.keys(data).forEach((k) => {
    if (k === 'y') {
      crowSprite.y = data.y - D.hitboxOffset;
      bird.y = data.y;
    } else {
      crowSprite[k] = data[k];
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

function renderGameInfo() {
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
  return isCollision(bird, sprite, false, 15 + D.powerups.money + D.powerups.magnate);
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

      sprite.enabled = false;
      sprite.goTo(bird);

      continue;
    } else if (sprite.isMoving && sprite.isAt()) {
      D.objectives.splice(i, 1);
      i -= 1;

      sounds.pickup();
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
      windowCollision(sprite);
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

function windowCollision(sprite: CSprite) {
  // bird.dx = D.scrollSpeed * -.25; // Enable for forward-moving finish
  // bird.dx = D.scrollSpeed;
  if (D.powerups.civics && RND(0, 9) >= 5) {
    console.log('Barrel roll!');
    sounds.miss();
    sprite.enabled = false;
  } else if (D.powerups.sabotage && RND(0, 9) >= 5) {
    console.log('Not today!');
    sounds.breakMiss();
    sprite.enabled = false;
    sprite.playAnimation('break');
    D.brokenWindowsInRun += 1;
  } else if (D.powerups.life > 0) {
    console.log('Oh, ouch!');
    D.powerups.life -= 1;
    sprite.enabled = false;
    sounds.breakMiss();
    sprite.playAnimation('break');
    D.brokenWindowsInRun += 1;
  } else {
    console.log('Ahh dangit!');
    D.setEnding();
    setBirdData({ dx: D.scrollSpeed / 5 });
    crowSprite.playAnimation('hit');
    sounds.breakOuch();
    sprite.playAnimation('break');
    D.brokenWindowsInRun += 1;
  }
}

function endCurrentRun() {
  const stats = getStats();
  crowSprite.playAnimation('stop');
  sounds.end();
  setStats({
    money: stats.money + D.pickups,
    earned: stats.earned + D.pickups,
    plays: stats.plays + 1,
    breaks: stats.breaks + D.brokenWindowsInRun,
    highScore: D.distance,
  });
  showElement('wrapper', true);
  D.setMenuing();
}

let frameTrack = 0;
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
    bird.dx += 0.011;
  } else {
    bird.dx = 0;
    bird.x = Math.round(bird.x);
  }

  if (D.ending && bird.y === D.maxY) {
    endCurrentRun();
  }

  if (D.playing) {
    if (frameTrack === 20) {
      sounds.flap();
      frameTrack = 0;
    } else {
      frameTrack += 1;
    }
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

      renderGameInfo();
    }
  },
});

function startGame() {
  showElement('wrapper', false);
  showElement('store', false);
  showElement('stats', false);

  resetData();

  setBirdData({
    x: D.birdStartX,
    y: D.birdStartY,
    dy: D.birdStartDy,
    dx: 0,
  });

  crowSprite.playAnimation('fly');

  D.setPlaying();

  loop.start();

  // makeDebugObjectives();
  makeStartingObjectives();
  makeStartingObstacles();

  displayDollar = makeDisplayObjective();
  displayBird = makeTinybird();
}

setupStore();
makeSprites();
// makeSprites(startGame);
