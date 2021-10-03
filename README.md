# typed-mixins

Reuse functionality across classes without complex inheritance. Just Works&trade; with TypeScript.

```typescript
const IdentifiableItem = mixin(StoreItem, [Identifiable])

// item is StoreItem & Identifiable
const item = new IdentifiableItem()

// reuse functionality across classes
const User = mixin(Person, [Identifiable])
```

No casting objects as an interface, no `any`. `typed-mixins` work perfectly out of the box with TypeScript.

## Installing

`npm install typed-mixins`

Or

`yarn add typed-mixins`

## Using

### Background

From [Stack Overflow](https://stackoverflow.com/questions/533631/what-is-a-mixin-and-why-are-they-useful):

<blockquote>
A mixin is a special kind of multiple inheritance. There are two main situations where mixins are used:

1. You want to provide a lot of optional features for a class.
2. You want to use one particular feature in a lot of different classes.
</blockquote>

Think of mixins as an `interface` with an implementation attached. 

Mixins shouldn't be overused, but they are a useful way to get around complex inheritance trees.

### Example

```typescript
import { mixin } from 'typed-mixins'
import { v4 as uuidv4 } from 'uuid';

class StoreItem {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

class Person {
  email: string;
}

class Identifiable {

  static getRandomId(): string {
    return uuidv4();
  }

  private _id = uuidv4()

  get id(): string {
    return _id;
  }

  matches(otherItem: Identifiable): boolean {
    return otherItem.id === this.id;
  }

}

const IdentifiableItem = mixin(StoreItem, [Identifiable])

// item is StoreItem & Identifiable
const item = new IdentifiableItem('mug', 10)

// shorthand for mixed class
let nextItem: typeof IdentifiableItem.Instance

// use instance properties
console.log(item.name)          // 'mug'
console.log(item.id)            // some UUID
console.log(item.matches(item)) // true

const User = mixin(Person, [Identifiable])
console.log(person.id)          // another UUID

// use static properties
console.log(User.getRandomId()) // random UUID
```

You can further customize mixed classes:

```typescript
const IdentifiableItem = mixin(StoreItem, [Identifiable])
class Audiobook extends IdentifiableItem {
  length: number;
  author: string;
}
```

### Restrictions

- The base class and all mixins must be classes. No plain-old JavaScript objects.
- Mixin classes cannot use constructor arguments (prevents really tortured syntax in the returned constructor)
- This package ships as ES6 because [transpiled ES5 classes cannot extend native classes](https://stackoverflow.com/a/51860850)
