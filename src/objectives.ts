import { Sprite } from 'kontra';
import { data as D, RND } from './data';

const objectiveWidth = D.refWidth * 0.25;
const objectiveHeight = objectiveWidth;

export function makeObjective(startX: number, startY: number) {
  return Sprite({
    x: startX, // starting x,y position of the sprite
    y: startY,
    color: 'yellow', // fill color of the sprite rectangle
    width: objectiveWidth, // width and height of the sprite rectangle
    height: objectiveHeight,
    dy: 0, // move the sprite 2px to the right every frame
    dx: D.scrollSpeed,
  });
}

interface SinFn {
  fn: (i: number, yPos: number) => number;
  yMin: number;
  yMax: number;
}
class SinFn {
  constructor(fn: (i: number, yPos: number) => number, yMin: number, yMax: number) {
    this.fn = fn;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  function(nonRandom?: number) {
    const random = nonRandom ? nonRandom : RND(this.yMin, this.yMax);

    return (i: number) => this.fn(i, random);
  }
}

const altSmallRows = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 100 * D.ratio * Math.sin(2 * Math.PI * (i * 0.5) + 3),
  50,
  750
);
const altMedRows = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 150 * D.ratio * Math.sin(2 * Math.PI * (i * 0.5) + 3),
  50,
  750
);
const smallWave = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio - 75 * D.ratio * Math.sin(2.5 * Math.PI * i * 0.1 + 3),
  100,
  700
);
const medWave = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 150 * D.ratio * Math.sin(2 * Math.PI * (i * 0.05) + 3),
  170,
  610
);
const bigWave = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 300 * D.ratio * Math.sin(2 * Math.PI * (i * 0.05) + 0),
  320,
  450
);
const shortCurve = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 150 * D.ratio * Math.sin(2 * Math.PI * (i * 0.02) + 3),
  170,
  740
);
const bigFish = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 150 * D.ratio * Math.sin(3 * Math.PI * (i * 0.984) + 0),
  170,
  610
);
const smallFish = new SinFn(
  (i: number, yPos: number) => yPos * D.ratio + 50 * D.ratio * Math.sin(3 * Math.PI * (i * 0.98) + 0),
  70,
  710
);

const fns = [altSmallRows, altMedRows, smallWave, medWave, bigWave, shortCurve, bigFish, smallFish];

// This will call the SinFn to build a function with a random yPos
function getRandomFn(): (i: number) => number {
  return fns[RND(0, fns.length - 1)].function();
}

export function makeObjectiveSet(initialX?: number, fnToUse?: (index: number) => number) {
  const startX = initialX || D.width * 1.25;

  const long = 26;
  const short = 21;

  const length = Math.random() >= 0.5 ? long : short;

  let randomFn = getRandomFn();
  for (let i = 0; i < short; i += 1) {
    // for (let i = 0; i < length; i += 1) {
    const sX = startX + objectiveWidth * 2 * i;
    const sY = fnToUse ? fnToUse(i) : randomFn(i);

    D.objectives.push(makeObjective(sX, sY));
  }
}

export function makeDebugObjectives() {
  makeObjectiveSet(D.width / 2);
}

export function makeStartingObjectives() {
  makeObjectiveSet(D.width * 1.5, altSmallRows.function(390));
}
