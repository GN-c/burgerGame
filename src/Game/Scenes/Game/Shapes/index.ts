/**
 * Define precise mouse hitareas for each item for better game experience
 */
namespace Shapes {
  export const Meat = new Phaser.Geom.Ellipse(42, 31, 80, 60);
  export const MeatCallback = Phaser.Geom.Ellipse.Contains;

  export const Cheese = new Phaser.Geom.Polygon([36, 0, 72, 29, 36, 58, 0, 29]);
  export const CheeseCallback = Phaser.Geom.Polygon.Contains;

  export const Onion = new Phaser.Geom.Ellipse(30, 20, 60, 40);
  export const OnionCallback = Phaser.Geom.Ellipse.Contains;
}

export default Shapes;
