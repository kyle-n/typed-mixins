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

type AllBools<T> = {
  [Property in keyof T]: T[Property]
}
type BoolPerson = AllBools<Person>

const c: BoolPerson = {
  id: 1,
  name: 'Charlotte'
}

const jumper: Jumpable = {
  jump: () => console.log('jumped!')
}

const tuple = [c, jumper] as const;
type Tupled = (typeof tuple)[number]
type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never
type TupleIntersect = UnionToIntersection<Tupled>

function mixin<T, Z>(base: T, mixins: Array<Z>) {
  const x = 1;
  type Mixins = typeof mixins
  type MixinUnion = Mixins[number]
  type MixinIntersection = UnionToIntersection<MixinUnion>
  // @ts-ignore
  return x as MixinIntersection & T
}

const x = mixin(Person.prototype, [Jumpable.prototype, Flyable.prototype])
