import Utils from "../../../Utils";
import { ItemType } from "../Items";
import Manager from "../Manager";

/**
 * Generate Stacked source textures on the fly using renderTexture,
 * to draw all the objects in one draw call instead of multiple
 */
export default class StackSource extends Phaser.GameObjects.RenderTexture {
  /**
   * Space between each layers of item
   */
  public static readonly SPACING_STEP = 10;

  constructor(
    scene: Phaser.Scene,
    public readonly item: ItemType,
    private readonly stackCount: number,
    x: number,
    y: number
  ) {
    super(
      scene,
      x,
      y,
      /**
       * Pass correct size at initialization because calling .resize() later, causes destroying and recreating webgl frame buffer all over again
       */
      scene.textures.getFrame("Game.items", item).width,
      scene.textures.getFrame("Game.items", item).height +
        stackCount * StackSource.SPACING_STEP
    );

    this.addToScene()
      .setOrigin(0.5, 1)
      .drawFrames()
      .setInteractive({
        cursor: "pointer",
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.emit("interaction", this.item);
      });

    if (Manager.DEBUG) this.scene.input.enableDebug(this);
  }

  private drawFrames() {
    const frameHeight = this.scene.textures.getFrame(
      "Game.items",
      this.item
    ).height;

    /**
     * Draw Texture
     * Firstly draw shadow at the bottom
     * and then draw item frame this.stackCount times in reverse order to preserve last item frame overlaying top
     */
    this.beginDraw();
    this.batchDrawFrame(
      "Game.objects",
      StackSource.getItemShadowFrameName(this.item),
      0,
      this.height - frameHeight
    );
    Utils.times(this.stackCount, (index) =>
      this.batchDrawFrame(
        "Game.items",
        this.item,
        0,
        this.height - (index + 1) * StackSource.SPACING_STEP - frameHeight
      )
    );
    this.endDraw();

    return this;
  }

  on(
    event: "interaction",
    callback: (item: ItemType) => void,
    context?: any
  ): this;
  on(event: string, callback: () => void, context?: any): this;
  on(
    event: string | symbol,
    callback: (...args: any[]) => void,
    context?: any
  ): this {
    return super.on(event, callback, context);
  }

  private static getItemShadowFrameName(item: ItemType) {
    return "shadow_" + item.split("_")[0];
  }

  private addToScene() {
    this.scene.add.existing(this);

    return this;
  }
}
