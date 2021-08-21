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

type KeyedObject = {[key: string]: any};
type Prototyped<T> = {prototype: T}
type RealType<T extends KeyedObject> = T extends Prototyped<KeyedObject> ? T['prototype'] : T;

function mixin<X extends RealType<KeyedObject>, Y extends RealType<KeyedObject>>(base: X, mixins: Array<Y>) {
  const x = 1;
  return x as RealType<X> & MixinIntersection<Array<RealType<Y>>>
}

const x = mixin(Person, [Jumpable, Flyable])
const y = {1: 'na'}
const z = mixin(Person, [y])
