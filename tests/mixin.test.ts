import { mixin } from '../src/mixin';

describe('mixin', () => {
  class Person {
    name!: string;
  }
  class Jumpable {
    static legs = 2;
    jump() {}
    doubleJump = () => {};
  }
  class Flyable {
    static soar() {}
    height = 12;
  }

  const SuperHero = mixin(Person, [Jumpable, Flyable]);
  let hero: Person & Jumpable & Flyable;

  beforeEach(() => {
    hero = new SuperHero();
  });

  it('should copy instance properties', () => {
    hero.jump();
    hero.doubleJump();
    expect(hero.height).toBe(12);
  });

  it('should copy static properties', () => {
    SuperHero.staticProps.soar();
    expect(SuperHero.staticProps.legs).toBe(2);
  });

  it('should be extendable', () => {
    class CapedSuperHero extends SuperHero {
      twirl() {
        this.doubleJump();
      }
    }
    const capeGuy = new CapedSuperHero();
    capeGuy.twirl();
  });
});
