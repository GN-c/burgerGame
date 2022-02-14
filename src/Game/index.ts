import Phaser from "phaser";
import { Plugin as NineSlicePlugin } from "phaser3-nineslice";

import GameScene from "./Scenes/Game";
import PreloadScene from "./Scenes/Preload";

export default class Game extends Phaser.Game {
  constructor(canvas: HTMLCanvasElement) {
    super({
      type: Phaser.WEBGL,
      backgroundColor: 0xff0000,
      canvas,
      scale: {
        /**
         * Fixed size of canvas based on 1x assets
         */
        width: 375,
        height: 667,
        mode: Phaser.Scale.ScaleModes.NONE,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      },
      width: window.innerWidth,
      height: window.innerHeight,
      roundPixels: true,
      scene: [PreloadScene, GameScene],
      plugins: {
        global: [NineSlicePlugin.DefaultCfg],
      },
    });
  }
}
