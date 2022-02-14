import GameScene from "..";
import Grills, { GrillType } from "../Grill";
import Items, { ItemType } from "../Items";

export default class Manager extends Phaser.Events.EventEmitter {
  public static readonly DEBUG: boolean = false;

  private lastSelectedItem: ItemType | undefined;

  constructor(private scene: GameScene) {
    super();
  }

  manage() {
    /**
     * Manage sources
     */
    Object.values(this.scene.sources).forEach((source) =>
      source.on("interaction", this.handleSourceInteraction, this)
    );
    /**
     * Manage Grills
     */
    Object.values(this.scene.grills).forEach((grill) =>
      grill.on("interaction", this.handleGrillInteraction, this)
    );
  }

  private handleSourceInteraction(item: ItemType) {
    this.lastSelectedItem = item;
  }

  private async handleGrillInteraction(
    grillType: GrillType,
    [x, y]: [x: number, y: number]
  ) {
    if (this.lastSelectedItem == undefined) return;
    switch (grillType) {
      case GrillType.Cheese:
        if (this.lastSelectedItem === ItemType.RawCheese) {
          /**
           * Spawn Raw cheese
           */
          const rawCheese = this.scene.items.spawn(
            x,
            y,
            ItemType.RawCheese
          ) as Phaser.GameObjects.Image;
          /**
           * Disable so user can't manipulate it anymore and inputmanager does not check for it
           */
          rawCheese.disableInteractive();
          /** spawn timer and wait duration */
          await this.scene.timers.spawn(x, y + 40, Grills.CHEESE_COOK_DURATION);
          const cheese = this.scene.items.swapInto(rawCheese, ItemType.Cheese);
          await this.scene.timers.spawn(x, y + 40, Grills.CHEESE_BURN_DURATION);
          this.scene.items.swapInto(cheese, ItemType.BurntCheese);
        }
        break;
      case GrillType.Meat:
        if (this.lastSelectedItem === ItemType.RawMeat) {
          /**
           * Spawn Raw meat
           */
          const rawMeat = this.scene.items.spawn(
            x,
            y,
            ItemType.RawMeat
          ) as Phaser.GameObjects.Image;
          rawMeat.disableInteractive();
          await this.scene.timers.spawn(x, y + 40, Grills.MEAT_COOK_DURATION);
          const meat = this.scene.items.swapInto(rawMeat, ItemType.Meat);
          await this.scene.timers.spawn(x, y + 40, Grills.MEAT_BURN_DURATION);
          this.scene.items.swapInto(meat, ItemType.BurntMeat);
        }
        break;
      case GrillType.Onion:
        if (this.lastSelectedItem === ItemType.RawOnion) {
          /**
           * Spawn Raw onion
           */
          const rawOnion = this.scene.items.spawn(
            x,
            y,
            ItemType.RawOnion
          ) as Phaser.GameObjects.Image;
          rawOnion.disableInteractive();
          await this.scene.timers.spawn(x, y + 40, Grills.ONION_COOK_DURATION);
          const onion = this.scene.items.swapInto(rawOnion, ItemType.Onion);
          await this.scene.timers.spawn(x, y + 40, Grills.ONION_BURN_DURATION);
          this.scene.items.swapInto(onion, ItemType.BurntOnion);
        }
        break;
    }

    this.lastSelectedItem = undefined;
  }

  asyncTimer(duration: number) {
    return new Promise((res) => this.scene.time.delayedCall(duration, res));
  }
}
