import { init, Sprite } from 'kontra';

let { canvas, context } = init();

export function RND(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isCollision(spriteA: Sprite, spriteB: Sprite, ignoreBack: boolean, expandArea = 0) {
  const ignore = ignoreBack ? 0.75 : 0;
  const bIsRightOfA = spriteB.x > spriteA.x + spriteA.width + expandArea
  const bIsLeftOfA = spriteB.x + spriteB.width < (spriteA.x - expandArea) + (spriteA.width * ignore)

  if (bIsRightOfA || bIsLeftOfA) {
    return false;
  }

  const bIsAboveA = spriteB.y + spriteB.height < (spriteA.y - expandArea);
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
  let width;
  let baseWidth = 1600;
  if (window.innerWidth > window.innerHeight * 2) {
    width = window.innerHeight * 2;
    console.log('SET WIDTH', width);
  } else {
    width = window.innerWidth
    console.log('OTHER WIDTH', width)
  }

  const height = width / 2; // > window.innerHeight ? window.innerHeight : width / 2;
  const ratio = width / baseWidth;
  const maxDyUp = -width / 200;
  const maxDyDown = width / 267;
  const refWidth = width / 20;

  canvas.width = width;
  canvas.height = height;

  return {
    playing: true,
    ratio,
    width,
    height,
    refWidth,
    maxDyUp: maxDyUp,
    maxDyDown: maxDyDown,
    maxDyUpChange: Math.abs(maxDyUp * 0.05),
    maxDyDownChange: Math.abs(maxDyUp * 0.1),
    objectives: [] as Array<Sprite>,
    obstacles: [] as Array<Sprite>,
    distance: 1,
    pickups: 0,
    canvas,
    context,
    baseSpeed: -7 * ratio,
    scrollSpeed: -3,
    font: `${32 * ratio}px Arial`,
    maxY: height - refWidth + (20 * ratio),
    minY: (refWidth / 2) - (20 * ratio),
    taper: .05 * ratio,
    lastObstacleSpawn: 0,
    canSpawnObstacle: false,
    // maxY: height - (refWidth / 2) - (10 * ratio),
    // minY: 0 + (10 * ratio)
  };
}

let data = {
  ...initData(),
};

function resetData() {
  data = {
    ...initData(),
  };
}

export { data, resetData };
