import Manager from "../Manager";
import Shapes from "../Shapes";

export enum GrillType {
  Meat = "meat",
  Cheese = "cheese",
  Onion = "onion",
}

/**
 * We're not going to destroy/recreate grill images throughout game, so we just simply create them instead of using object pools
 */
export default class Grills extends Phaser.Events.EventEmitter {
  static readonly MEAT_COOK_DURATION = 1500;
  static readonly MEAT_BURN_DURATION = 1000;
  static readonly CHEESE_COOK_DURATION = 1000;
  static readonly CHEESE_BURN_DURATION = 500;
  static readonly ONION_COOK_DURATION = 700;
  static readonly ONION_BURN_DURATION = 300;

  grills: Phaser.GameObjects.Image[];

  constructor(
    public readonly scene: Phaser.Scene,
    public readonly type: GrillType,
    private positions: [x: number, y: number][]
  ) {
    super();

    /**
     * Get hit Area Shape and Callback for input interactivity
     */
    const { hitArea, hitAreaCallback } = this.getHitArea()!;

    /**
     * Create individual shadow image for each position
     */
    this.grills = this.positions.map(([x, y]) => {
      const grill = this.scene.add
        .image(x, y, "Game.objects", "shadow_" + this.type)
        .setOrigin(0.5)
        .setInteractive({ cursor: "pointer", hitArea, hitAreaCallback })
        .setState("free")
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
          if (grill.state === "free")
            this.emit("interaction", this.type, [x, y]);
        });

      if (Manager.DEBUG) this.scene.input.enableDebug(grill);

      return grill;
    });
  }

  on(
    event: "interaction",
    callback: (grillType: GrillType, position: [x: number, y: number]) => void,
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

  private getHitArea() {
    switch (this.type) {
      case GrillType.Meat:
        return {
          hitArea: Shapes.Meat,
          hitAreaCallback: Shapes.MeatCallback,
        };

      case GrillType.Cheese:
        return {
          hitArea: Shapes.Cheese,
          hitAreaCallback: Shapes.CheeseCallback,
        };

      case GrillType.Onion:
        return {
          hitArea: Shapes.Onion,
          hitAreaCallback: Shapes.OnionCallback,
        };
    }
  }
}
