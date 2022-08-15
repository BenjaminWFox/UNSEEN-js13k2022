import { data as D } from './data';
import { Button, initPointer } from 'kontra'

initPointer();

export const FlyButton = Button({
  // sprite properties
  x: D.width * .5,
  y: D.height / 2 - 50 * D.ratio,
  anchor: { x: 0.5, y: 0.5 },

  // text properties
  text: {
    text: 'Fly!',
    color: 'white',
    font: D.font,
    anchor: { x: 0.5, y: 0.5 }
  },

  onUp() {
    console.log('OUP')
    D.setPlaying()
  },

  render() {
    this.context!.lineWidth = 5 * D.ratio;
    this.context!.strokeStyle = 'red';
    // this.context?.strokeRect(
    //   100 * D.ratio,
    //   60 * D.ratio,
    //   this.width! - 200 * D.ratio || 0,
    //   this.height! - 100 * D.ratio || 0
    // );
  }
});


export const BuyButton = Button({
  // sprite properties
  x: D.width * .7,
  y: D.height / 2 - 50 * D.ratio,
  anchor: { x: 0.5, y: 0.5 },

  // text properties
  text: {
    text: 'Buy!',
    color: 'white',
    font: D.font,
    anchor: { x: 0.5, y: 0.5 }
  },

  render() {
    this.context!.lineWidth = 5 * D.ratio;
    this.context!.strokeStyle = 'red';
    this.context?.strokeRect(
      100 * D.ratio,
      60 * D.ratio,
      this.width! - 200 * D.ratio || 0,
      this.height! - 100 * D.ratio || 0
    );
  }
});
