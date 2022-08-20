import { init, Sprite, SpriteClass } from 'kontra';

interface Stats {
    money: number;
    highScore: number;
    purchases: Record<string, string>;
}

const stats: Stats = {
  money: 0,
  highScore: 0,
  purchases: {},
}

export function getStats(): Stats {
  const result = JSON.parse(window.localStorage.getItem('js13k22-unseen-stats') || JSON.stringify(stats));

  console.log('GOT STATS', result);

  return result;
}

export function setStats(statsToSet: Partial<Stats>) {
  const current = getStats();

  current.money = statsToSet?.money || current.money;
  current.highScore = statsToSet.highScore && statsToSet.highScore > current.highScore ? statsToSet.highScore : current.highScore;
  
  if (statsToSet.purchases) {
    current.purchases = {
      ...current.purchases,
      ...statsToSet.purchases,
    }
  }
  
  console.log('SETTING STATS', current);

  window.localStorage.setItem('js13k22-unseen-stats', JSON.stringify(current));
}

export interface CSprite extends Sprite {
  enabled: boolean;
}

export class CSprite extends SpriteClass {
  constructor(properties: Record<string, any>) {
    super(properties);
    this.enabled = properties.enabled === false || true;
  }
}
let { canvas, context } = init();

export function RND(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isCollision(spriteA: CSprite, spriteB: CSprite, ignoreBack: boolean, expandArea = 0) {
  if (!spriteA.enabled || !spriteB.enabled) {
    return false;
  }

  const ignore = ignoreBack ? 0.75 : 0;
  const bIsRightOfA = spriteB.x > spriteA.x + spriteA.width + expandArea;
  const bIsLeftOfA = spriteB.x + spriteB.width < spriteA.x - expandArea + spriteA.width * ignore;

  if (bIsRightOfA || bIsLeftOfA) {
    return false;
  }

  const bIsAboveA = spriteB.y + spriteB.height < spriteA.y - expandArea;
  const bIsBelowA = spriteB.y > spriteA.y + spriteA.height + expandArea;

  if (bIsAboveA || bIsBelowA) {
    return false;
  }

  return true;
}

function initData() {
  /**
   * All settings are initially tested based off a starting width of 1600px
   */
  let width = canvas.width;
  const height = canvas.height;
  const ratio = 1;
  const maxDyUp = -width / 250; // 200 for agility?
  const maxDyDown = width / 250;
  const stats = getStats();

  canvas.width = width;
  canvas.height = height;

  let initialData = {
    playing: false,
    menuing: true,
    ending: false,
    shopping: false,
    ratio,
    width,
    height,
    maxDyUp: maxDyUp,
    maxDyDown: maxDyDown,
    maxDyUpChange: Math.abs(maxDyUp * 0.05),
    maxDyDownChange: Math.abs(maxDyUp * 0.05),
    objectives: [] as Array<CSprite>,
    obstacles: [] as Array<CSprite>,
    birdStartX: 300,
    birdStartY: height / 2,
    birdStartDy: -12,
    distance: 1,
    pickups: 0,
    canvas,
    context,
    baseSpeed: -7,
    scrollSpeed: -3,
    font: `${32}px Arial`,
    maxY: height - 30,
    minY: 30,
    taper: 0.05,
    lastObstacleSpawn: 0,
    canSpawnObstacle: false,
    hitboxOffset: 30,
    powerups: {
      life: 0,
      money: 0,
      agile: false,
      sabotage: false,
    },
  };

  return initialData;
}

let data = {
  ...initData(),
  setPlaying: () => {},
  setEnding: () => {},
  setMenuing: () => {},
  setShopping: () => {},
};

function resetData() {
  const stats = getStats();

  data = {
    ...initData(),
    setPlaying: () => {
      console.log('SIP');
      data.playing = true;
      data.ending = false;
      data.menuing = false;
      data.shopping = false;
    },
    setEnding: () => {
      data.playing = false;
      data.ending = true;
      data.menuing = false;
      data.shopping = false;
    },
    setMenuing: () => {
      data.playing = false;
      data.ending = false;
      data.menuing = true;
      data.shopping = false;
    },
    setShopping: () => {
      data.playing = false;
      data.ending = false;
      data.menuing = false;
      data.shopping = true;
    },
  };

  if (stats.purchases.neck) {
    data.powerups.life += 1
  }
  if (stats.purchases.steel) {
    data.powerups.life += 2
  }
  if (stats.purchases.money) {
    data.powerups.money = 20;
  }
  if (stats.purchases.sabotage) {
    console.log('GLASS!')
    data.powerups.sabotage = true;
  }
  if (stats.purchases.agile) {
    console.log('AGILE!');
    data.powerups.agile = true;
    data.maxDyUp = -data.width / 150;
    data.maxDyDown = data.width / 150;
    data.maxDyUpChange = Math.abs(data.maxDyUp * 0.025);
    data.maxDyDownChange = Math.abs(data.maxDyUp * 0.025);
    data.birdStartDy = -10;
  }
}

resetData();

export { data, resetData };
