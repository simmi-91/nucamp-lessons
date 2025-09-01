class Monster {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.isScary = true;
  }
  roar() {
    console.log(`The ${this.color} ${this.type} lets out a tremendous roar!`);
  }
}

class Dragon extends Monster {
  constructor(
    type,
    color,
    element = "fire" //Default Function Parameters
  ) {
    super(type, color);
    this.element = element;
  }
  fly() {
    console.log(
      `The ${this.color} ${this.element} ${this.type} flaps its wings and begins to fly.`
    );
  }
}

const dragon1 = new Dragon("dragon", "blue", "water");

dragon1.roar();
dragon1.fly();
console.log("isScary: " + dragon1.isScary);

const dragon2 = new Dragon("dragon", "red");
dragon2.fly();
