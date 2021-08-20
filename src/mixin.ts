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

function mixin<X, Y>(base: X, mixins: Array<Y>) {
  const x = 1;
  type A = Prototyped<Y>
  // @ts-ignore
  // return x as X & Y['prototype']
  return x as X['prototype'] & MixinIntersection<Array<Y['prototype']>>
}

type v = typeof Jumpable.prototype
const x = mixin(Person, [Jumpable, Flyable])
