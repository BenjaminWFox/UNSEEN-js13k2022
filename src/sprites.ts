import {
  Sprite,
  SpriteSheet,
} from 'kontra';
import { CSprite, data as D } from './data';
import crowRawImage from './images/crow-outline.png';
import dollarRawImage from './images/dollar-outline.png';
import windowRawImage from './images/window-outline.png';
import tinyBirdImage from './images/tiny-bird.png';

const loaded = [];
const totalLoads = 4;

let bird: CSprite;
let crowSprite: CSprite;
let tinyBirdImg: HTMLImageElement;
let dollarImg: HTMLImageElement;
let windowImg: HTMLImageElement;
let windowSheet: SpriteSheet;

const birdWidth = 65;
const birdHeight = 65;
const birdX = D.birdStartX;

function makeSprites(startFn?: () => void) {
  function checkLoaded(loadedImage: HTMLImageElement) {
    loaded.push(loadedImage)
    if (loaded.length === totalLoads && startFn) {
      startFn();
    }
  }


  bird = new CSprite({
    x: D.birdStartX,
    y: D.birdStartY,
    // color: 'red',
    width: birdWidth,
    height: birdHeight / 4,
    dy: D.birdStartDy,
    enabled: true,
  });

  /* Crow Pixel Sprite Large */
  const crowImg = new Image();
  crowImg.src = crowRawImage
  crowImg.width = 650;
  crowImg.height = 65;
  crowImg.onload = function () {
    let spriteSheet = SpriteSheet({
      image: crowImg,
      frameWidth: 65,
      frameHeight: 65,
      animations: {
        fly: {
          frames: '0..9',
          frameRate: 30,
        },
        stop: {
          frames: '3',
        },
        hit: {
          frames: '0',
        }
      },
    });

    crowSprite = new CSprite({
      x: birdX,
      y: bird.y - D.hitboxOffset,
      animations: spriteSheet.animations,
      enabled: true,
    });

    checkLoaded(crowImg)
  };

  dollarImg = new Image();
  dollarImg.src = dollarRawImage;
  dollarImg.width = 30
  dollarImg.height = 14
  dollarImg.onload = function () {
    checkLoaded(dollarImg)
  }

  tinyBirdImg = new Image();
  tinyBirdImg.src = tinyBirdImage;
  tinyBirdImg.width = 30
  tinyBirdImg.height = 14
  tinyBirdImg.onload = function () {
    checkLoaded(tinyBirdImg)
  }

  windowImg = new Image();
  windowImg.src = windowRawImage;
  windowImg.width = 270
  windowImg.height = 155
  windowImg.onload = function () {
    windowSheet = SpriteSheet({
      frameWidth: 45,
      frameHeight: 155,
      animations: {
        break: {
          frames: '0..5',
          frameRate: 30,
          loop: false,
        },
        whole: {
          frames: '0',
          frameRate: 1,
        },
      },
      image: windowImg,
    });

    checkLoaded(windowImg)
  }
}

export function makeTinybird() {
  return new CSprite({
    image: tinyBirdImg,
    x: 25,
    y: 76,
    width: 30,
    height: 14,
    enabled: true,
  })
}

export {
  makeSprites,
  bird,
  crowSprite,
  dollarImg,
  windowSheet,
}
