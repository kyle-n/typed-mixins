export function mixin(base: Constructor, mixes: Constructor[]) {
  mixes.forEach(mix => {
    Object.keys(mix).forEach(key => {
      base[key] = mix[key]
    })
    Object.keys(mix.prototype).forEach(key => {
      base.prototype[key] = mix.prototype[key]
    })
  })
  return base;
}

// type Constructor = new (...args: any[]) => {};
type Constructor = any;

class Jumpable {
  static jumpHeight = 10;

  jump() {
    console.log('jumped')
  }
}

class Person {
  name = 'Me'
}

const MixedPerson = mixin(Person, [Jumpable]);
const me = new MixedPerson()
me.jump()
console.log(me.name, MixedPerson.jumpHeight)
