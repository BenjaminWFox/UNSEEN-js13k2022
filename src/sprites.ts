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
import { data as D } from './data';
import crowRawImage from './images/crow.png';
import dollarRawImage from './images/dollar.png';
import windowRawImage from './images/window-sprite.png';

const loaded = [];
const totalLoads = 3;

let bird: Sprite;
let crowSprite: Sprite;
let dollarImg: HTMLImageElement;
let windowImg: HTMLImageElement;
let windowSheet: SpriteSheet;

const birdWidth = 65;
const birdHeight = 65;
const birdX = 200

function makeSprites(startFn: () => void) {
  function checkLoaded(loadedImage: HTMLImageElement) {
    loaded.push(loadedImage)
    if (loaded.length === totalLoads) {
      startFn();
    }
  }


  bird = Sprite({
    x: birdX,
    y: D.height / 2,
    // color: 'red',
    width: birdWidth,
    height: birdHeight / 4,
    dy: -17
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
          frames: '0',
          frameRate: 1,
        },
      },
    });

    crowSprite = Sprite({
      x: birdX,
      y: bird.y - D.hitboxOffset,
      animations: spriteSheet.animations,
    });

    checkLoaded(crowImg)
  };

  dollarImg = new Image();
  dollarImg.src = dollarRawImage;
  dollarImg.width = 24
  dollarImg.height = 12
  dollarImg.onload = function () {
    checkLoaded(dollarImg)
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

export {
  makeSprites,
  bird,
  crowSprite,
  dollarImg,
  windowSheet,
}
