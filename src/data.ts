import { init, Sprite } from 'kontra';

let { canvas, context } = init();

function initData() {
  /**
   * All settings are initially tested based off a starting width of 1600px
   */

  const width = window.innerWidth;
  const height = width / 2 > window.innerHeight ? window.innerHeight : width / 2;
  const maxDyUp = -width / 200;
  const maxDyDown = width / 267;

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = 'blue';

  return {
    playing: true,
    width: window.innerWidth,
    height: width / 2 > window.innerHeight ? window.innerHeight : width / 2,
    refWidth: width / 20,
    maxDyUp: maxDyUp,
    maxDyDown: maxDyDown,
    maxDyUpChange: Math.abs(maxDyUp * .05),
    maxDyDownChange: Math.abs(maxDyUp * .1),
    objectives: [] as Array<Sprite>,
    obstacles: [] as Array<Sprite>,
    distance: 0,
    pickups: 0,
    canvas,
    context,
    scrollSpeed: -2
  }
}

let data = {
  ...initData()
}

function resetData() {
  data = {
    ...initData()
  }
}

export {
  data,
  resetData,
}
