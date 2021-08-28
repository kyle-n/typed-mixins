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
  let hero: typeof SuperHero.Instance;

  beforeEach(() => {
    hero = new SuperHero();
  });

  it('should copy instance properties', () => {
    hero.jump();
    hero.doubleJump();
    expect(hero.height).toBe(12);
  });

  it('should copy static properties', () => {
    SuperHero.soar();
    expect(SuperHero.legs).toBe(2);
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

  it('should throw on accessing mixed class Instance prop', () => {
    const getInstance = () => SuperHero.Instance;
    expect(getInstance).toThrow();
  });
});
