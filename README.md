# typed-mixins

Mix classes together to share simple pieces of reusable functionality. Just Works&trade; with TypeScript.

## Installing

`npm install typed-mixins`

Or

`yarn add typed-mixins`

## Usage

```typescript
import { mixin } from 'typed-mixins'

class Person {
  name = 'Ordinary Man'
}
class Jumpable {
  static legs = 2;
  jump = () => console.log('jumped');
}
class Flyable {
  static soar() { console.log('soared') }
  height = 12;
}

const SuperHero = mixin(Person, [Jumpable, Flyable]);

// hero is automatically typed as Person & Flyable & Jumpable
const hero = new SuperHero();

// shorthand for all mixed classes
let nextHero: typeof SuperHero.Instance; 

// Use instance properties
console.log(hero.name)   // 'Ordinary Man'
console.log(hero.height) // 12
hero.jump()              // 'jumped'

// Use static properties
SuperHero.soar()         // 'soared'
```

You can further customize mixed classes:

```typescript
const SuperHero = mixin(Person, [Jumpable, Flyable]);
class CapedSuperHero extends SuperHero {
  twirl() {
    this.jump()
    console.log('twirled')
  }
}
const capeGuy = new CapedSuperHero();
capeGuy.twirl();         // 'jumped', 'twirled'
```

## Advantages

`typed-mixins` works out of the box perfectly with TypeScript. No casting objects as an interface or `any`. This package tells TypeScript you really do have all the given properties on your mixed class.
