import { Sprite } from 'kontra';
import { data as D } from './data';

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

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function makeStraight(initialX?: number, initialY?: number) {
  const startX = initialX || D.width * 1.25;
  const startY = initialY || randomIntFromInterval(D.minY + (10 * D.ratio), D.maxY - (10*D.ratio));
  const offset = objectiveHeight / 2  ;

  for (let i = 0; i < 20; i += 1) {
    const sX = startX + objectiveWidth * 2  * i;
    const sY = i % 2 === 0 ? startY + offset : startY - offset

    D.objectives.push(makeObjective(sX, sY));
  }
}


function makeCurvy(initialX?: number, initialY?: number) {
  const adjust = (objectiveHeight * 2.5 * D.ratio)
  const startX = initialX || D.width * 1.25;
  const startY = initialY || randomIntFromInterval(D.minY + adjust, D.maxY - adjust);
  const offset = objectiveHeight / 2;

  const long = 26;
  const short = 21;

  const length = Math.random() >= .5 ? long : short;

  let initial = 1
  for (let i = 0; i < length; i += 1) {
    const sX = startX + objectiveWidth * 2 * i;
    /**
     * For consistent use, ensure ratio multiplyer
     */
    // Alternating small rows:
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(2 * Math.PI * (i*.5) + 3))

    // Nice wave:
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(2 * Math.PI * (i*.05) + 3))

    // Nice short curve:
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(2 * Math.PI * (i*.02) + 3))

    // Nice longer curve:
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(5 * Math.PI * (i*.02) + 3))

    // Interesting Fish:
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(3 * Math.PI * (i*.984) + 0))

    // Interesting Smaller Fish:
    // let sY = (200 * D.ratio) + ((50 * D.ratio) * Math.sin(3 * Math.PI * (i*.98 ) + 0))

    // BIG Curve:
    let sY = (350 * D.ratio) + ((300 * D.ratio) * Math.sin(2 * Math.PI * (i*.05 ) + 0))

    /**
     * Ok, this is all interesting but performs poorly on different screens...
     */
    /**
     * These are smarter - we know where the top/bottoms will be
     */
    // Medium Block - OK - NICE
    // Will be from the TOP, going DOWN
    // let sY = (200 * D.ratio) + ((150 * D.ratio) * Math.sin(2 * Math.PI * (i*.5) + 3))
    // Will be from the BOTTOM, going UP
    // let sY = D.height - 200 - (150 * Math.sin(2 * Math.PI * sX + 3))

    // Will be from the BOTTOM, going UP
    // let sY = 100 + (50 * Math.sin(2 * Math.PI * sX + 3))
    // Will be from the BOTTOM, going UP
    // let sY = D.height - 100 - (50 * Math.sin(2 * Math.PI * sX + 3))

    /** 
     * Blocks
     */
    // Medium Block - OK - NICE
    // let sY = startY + (adjust * Math.sin(45  * Math.PI * sX + 30))
    // Large Block - OK - NICE
    // let sY = startY + (adjust * 2 * Math.sin(45 * Math.PI * sX + 30))

    /**
     * DNA
     */
    // Small DNA
    // let sY = startY + (adjust * Math.sin(1 * Math.PI * 1 * sX + 30))
    // Medium DNA
    // let sY = startY + (adjust * 2 * Math.sin(1 * Math.PI * 1 * sX + 30))

    /**
     * SIN curves
     */
    // Small Curve Small Repeat - OK - NICE
    // let sY = startY + (adjust * .5 * Math.sin(1 * Math.PI * 5 * sX + 30))
    // Small/Medium Curve Small Repeat - OK - NICE
    // let sY = startY + (adjust * Math.sin(2 * Math.PI * sX))
    // Medium Curve Small Repeat - OK
    // let sY = startY + (adjust * 2 * Math.sin(1 * Math.PI * 2 * sX + 30))
    // Large Curve Small Repeat
    // let sY = startY + (adjust * 4 * Math.sin(1 * Math.PI * 2 * sX + 30))

    D.objectives.push(makeObjective(sX, sY));
  }
}

export function makeDebugObjectives() {
  // makeStraight(D.width / 2, D.height / 2 - objectiveHeight / 2);
  makeCurvy(D.width / 2)
}

export function makeStartingObjectives() {
  makeStraight(undefined, D.height / 2 - objectiveHeight / 2);
}
