import Manager from "../Manager";
import Shapes from "../Shapes";

export enum ItemType {
  Bun = "bun",
  RawMeat = "meat_raw",
  Meat = "meat_good",
  BurntMeat = "meat_burnt",
  RawCheese = "cheese_raw",
  Cheese = "cheese_good",
  BurntCheese = "cheese_burnt",
  RawOnion = "onion_raw",
  Onion = "onion_good",
  BurntOnion = "onion_burnt",
  CoffeeEmpty = "coffee_empty",
  CoffeeFull = "coffee_full",
}

/**
 * Extend phaser's object pooling feature to prevent creating new class instance every time
 */
export default class Items extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene, { classType: Phaser.GameObjects.Image });
  }

  /**
   * Spawn new Item
   */
  spawn(x: number, y: number, type: ItemType) {
    const item = this.get(x, y, "Game.items", type) as Phaser.GameObjects.Image;
    item.setFrame(type).setActive(true).setVisible(true);

    /**
     * Set/Update Hitarea
     */
    if (
      [ItemType.RawCheese, ItemType.Cheese, ItemType.BurntCheese].includes(type)
    )
      item.setInteractive({
        cursor: "pointer",
        hitArea: Shapes.Cheese,
        hitAreaCallback: Shapes.CheeseCallback,
      });
    else if (
      [ItemType.RawMeat, ItemType.Meat, ItemType.BurntMeat].includes(type)
    )
      item.setInteractive({
        cursor: "pointer",
        hitArea: Shapes.Meat,
        hitAreaCallback: Shapes.MeatCallback,
      });
    else if (
      [ItemType.RawOnion, ItemType.Onion, ItemType.BurntOnion].includes(type)
    )
      item.setInteractive({
        cursor: "pointer",
        hitArea: Shapes.Onion,
        hitAreaCallback: Shapes.OnionCallback,
      });

    this.scene.children.bringToTop(item);
    if (Manager.DEBUG) this.scene.input.enableDebug(item);

    return item;
  }

  swapInto(item: Phaser.GameObjects.Image, newType: ItemType) {
    const { x, y } = item;
    this.despawn(item);
    return this.spawn(x, y, newType);
  }

  despawn(item: Phaser.GameObjects.Image) {
    item.removeInteractive();
    this.killAndHide(item);
  }
}
