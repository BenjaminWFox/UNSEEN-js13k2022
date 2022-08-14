import { init, Sprite } from 'kontra';

let { canvas, context } = init();

function initData() {
  /**
   * All settings are initially tested based off a starting width of 1600px
   */
  let width;
  let baseWidth;
  if (window.innerWidth > window.innerHeight * 2) {
    width = window.innerHeight * 2;
    console.log('SET WIDTH', width);
     baseWidth = 1800;
  } else {
    width = window.innerWidth
    console.log('OTHER WIDTH', width)
    baseWidth = 1600;
  }

  const height = width / 2; // > window.innerHeight ? window.innerHeight : width / 2;
  const ratio = width / baseWidth;
  const maxDyUp = -width / 200;
  const maxDyDown = width / 267;

  canvas.width = width;
  canvas.height = height;

  return {
    playing: true,
    ratio,
    width,
    height,
    refWidth: width / 20,
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
    baseSpeed: -2,
    scrollSpeed: -2,
    font: `${32 * ratio}px Arial`,
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
