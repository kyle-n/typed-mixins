class Person {
  id!: number;
  name!: string;
}
class Jumpable {
  jump!: () => void;
}
class Flyable {
  fly!: () => void;
}

const jumper: Jumpable = {
  jump: () => console.log('jumped!')
}

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type MixinIntersection<T extends Array<any>> = UnionToIntersection<(T)[number]>

type Prototyped<T> = {prototype: T}

function mixin<T, Z>(base: Prototyped<T>, mixins: Array<Z>) {
  const x = 1;
  // @ts-ignore
  return x as T & MixinIntersection<typeof mixins>
}

const x = mixin(Person, [Jumpable.prototype, Flyable.prototype])
