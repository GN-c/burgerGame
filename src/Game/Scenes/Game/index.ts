import Grills, { GrillType } from "./Grill";
import Items, { ItemType } from "./Items";
import Manager from "./Manager";
import Timers from "./Timers";
import StackSource from "./StackSource";

export default class GameScene extends Phaser.Scene {
  background!: Phaser.GameObjects.Image;
  sources!: { [key in "bun" | "meat" | "cheese" | "onion"]: StackSource };
  grills!: { [key in "meat" | "cheese" | "onion"]: Grills };
  Manager!: Manager;
  items!: Items;
  timers!: Timers;

  constructor() {
    super("Game");
  }

  create() {
    this.background = this.add
      .image(0, 0, "Game.background")
      .setOrigin(0)
      .setDepth(-Infinity);

    this.items = new Items(this);

    this.timers = new Timers(this);

    /**
     * Create Sources
     */
    this.sources = {
      bun: new StackSource(this, ItemType.Bun, 3, 51, 256),
      meat: new StackSource(this, ItemType.RawMeat, 3, 144, 256),
      cheese: new StackSource(this, ItemType.RawCheese, 3, 237, 256),
      onion: new StackSource(this, ItemType.RawOnion, 3, 324, 256),
    };

    /**
     * Create Grills
     */
    this.grills = {
      cheese: new Grills(this, GrillType.Cheese, [
        [187, 360],
        [187, 440],
        [187, 520],
        [187, 600],
      ]),
      meat: new Grills(this, GrillType.Meat, [
        [295, 360],
        [300, 440],
        [305, 520],
        [312, 600],
      ]),
      onion: new Grills(this, GrillType.Onion, [
        [56, 564],
        [76, 623],
      ]),
    };

    /**
     * Create Manager
     */
    this.Manager = new Manager(this);
    this.Manager.manage();
  }
}
