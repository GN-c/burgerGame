import Timer from "./Timer";

export default class Timers extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene, { classType: Timer });

    /**
     * Create 2 Texture for each bar (inner and outer)
     */
    this.create9SliceTexture(
      Timer.INNER_BAR_TEXTURE_KEY,
      Timer.RADIUS
    ).create9SliceTexture(
      Timer.OUTER_BAR_TEXTURE_KEY,
      Timer.RADIUS + Timer.PADDING
    );
  }

  /**
   * Create rounded rectangle texture on the fly for nineslice to support for different border radius
   */
  private create9SliceTexture(key: string, radius: number) {
    /**
     * Draw on regural CanvasRenderingContext2D because arcs are very smooth
     */
    const canvas = this.scene.textures.createCanvas(
      key,
      2 * radius + 1,
      2 * radius + 1
    );
    const ctx = canvas.getContext();
    ctx.strokeStyle = "";
    ctx.fillStyle = "white";

    /**
     * Draw rounded rectangle with border radius of radius and size of 2 * radius + 1
     */
    ctx.beginPath();
    ctx.arc(radius, radius, radius, Math.PI, Math.PI / 2, false);
    ctx.lineTo(radius + 1, 0);
    ctx.arc(radius + 1, radius, radius, Math.PI / 2, 0, false);
    ctx.lineTo(2 * radius + 1, radius + 1);
    ctx.arc(radius + 1, radius + 1, radius, 0, -Math.PI / 2, false);
    ctx.lineTo(radius, 2 * radius + 1);
    ctx.arc(radius, radius + 1, radius, -Math.PI / 2, -Math.PI, false);

    ctx.fill();

    canvas.refresh();

    return this;
  }

  async spawn(x: number, y: number, duration: number) {
    const progressBar = this.get(x, y) as Timer;
    progressBar.setActive(true).setVisible(true);
    this.scene.children.bringToTop(progressBar);
    await progressBar.start(duration);

    this.despawn(progressBar);
  }

  despawn(progressBar: Timer) {
    this.killAndHide(progressBar);
  }
}
