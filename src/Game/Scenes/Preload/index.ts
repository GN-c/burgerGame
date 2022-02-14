export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.setBaseURL("./assets/");

    /**
     * Load Internal Game Assets
     */
    this.load.setPrefix("Game.");

    this.load.image("background");

    this.load.atlas("items", "items.png", "items_atlas.json");
    this.load.atlas("objects", "objects.png", "objects_atlas.json");
  }

  create() {
    this.scene.start("Game");
  }
}
