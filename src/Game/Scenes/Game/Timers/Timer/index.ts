export default class Timer extends Phaser.GameObjects.Container {
  static readonly RADIUS = 4;
  static readonly WIDTH = 64;
  static readonly PADDING = 2;
  static readonly INNER_BAR_TEXTURE_KEY = "progressBarInner";
  static readonly OUTER_BAR_TEXTURE_KEY = "progressBarOuter";
  static readonly COLORS = [
    Phaser.Display.Color.HexStringToColor("#FBC241"),
    Phaser.Display.Color.HexStringToColor("#FB4042"),
  ];

  private backBar: Phaser.GameObjects.RenderTexture;
  private frontBar: Phaser.GameObjects.RenderTexture;
  private _tween: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.backBar = this.scene.add
      .nineslice(
        0,
        0,
        Timer.WIDTH + 2 * Timer.PADDING,
        2 * Timer.RADIUS + 2 * Timer.PADDING,
        Timer.OUTER_BAR_TEXTURE_KEY,
        Array(4).fill(Timer.RADIUS + Timer.PADDING)
      )
      .setOrigin(0.5);
    this.add(this.backBar);

    this.frontBar = this.scene.add
      .nineslice(
        0,
        0,
        Timer.WIDTH,
        2 * Timer.RADIUS,
        Timer.INNER_BAR_TEXTURE_KEY,
        Array(4).fill(Timer.RADIUS)
      )
      .setOrigin(0.5)
      .setTintFill(0x000000);

    this.add(this.frontBar);
  }

  /**
   * Tween color and width of progress bar
   * @param duration duration of animation, ms
   */
  async start(duration: number) {
    return new Promise((onComplete) => {
      this._tween = this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration,
        onUpdate: (tween) => {
          const progress = tween.progress;
          const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            Timer.COLORS[0],
            Timer.COLORS[1],
            1,
            progress
          );
          this.frontBar
            .setTintFill(
              Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b)
            )
            .setSize(
              Phaser.Math.Linear(2 * Timer.RADIUS, Timer.WIDTH, progress),

              2 * Timer.RADIUS
            );
        },
        onComplete,
      });
    });
  }

  setActive(value: boolean): this {
    /** Remove tween if progressbar is deactivated */
    if (!value) this._tween?.remove();
    return super.setActive(value);
  }
}
