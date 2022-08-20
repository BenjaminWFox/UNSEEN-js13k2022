import { init, Sprite, SpriteClass } from 'kontra';

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
  const maxDyUp = -width / 190;
  const maxDyDown = width / 250;

  canvas.width = width;
  canvas.height = height;

  let initialData = {
    playing: false,
    menuing: true,
    ending: false,
    ratio,
    width,
    height,
    maxDyUp: maxDyUp,
    maxDyDown: maxDyDown,
    maxDyUpChange: Math.abs(maxDyUp * 0.08),
    maxDyDownChange: Math.abs(maxDyUp * 0.08),
    objectives: [] as Array<CSprite>,
    obstacles: [] as Array<CSprite>,
    birdStartX: 300,
    birdStartY: height / 2,
    birdStartDy: -17,
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
    }
  };

  return initialData;
}

let data = {
  ...initData(),
  setPlaying: () => {},
  setEnding: () => {},
  setMenuing: () => {},
};

function resetData() {
  data = {
    ...initData(),
    setPlaying: () => {
      console.log('SIP');
      data.playing = true;
      data.ending = false;
      data.menuing = false;
    },
    setEnding: () => {
      data.playing = false;
      data.ending = true;
      data.menuing = false;
    },
    setMenuing: () => {
      data.playing = false;
      data.ending = false;
      data.menuing = true;
    },
  };
}

resetData();

export { data, resetData };
