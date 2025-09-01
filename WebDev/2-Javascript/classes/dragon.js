class Dragon {
  constructor(color, maxHP) {
    this.color = color;
    this.maxHP = maxHP;
  }
  roar() {
    console.log(`The ${this.color} dragon lets out a tremendous roar!`);
  }
}

const dragon1 = new Dragon("red", 300);
const dragon2 = new Dragon("blue", 150);

dragon1.roar();
dragon2.roar();
