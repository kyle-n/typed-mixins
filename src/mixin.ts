class Person {
  static totalPopulation = 10;
  id!: number;
  name!: string;
}
class Jumpable {
  static gravity = 9.8;
  jump!: () => void;
}
class Flyable {
  fly!: () => void;
}

const jumper: Jumpable = {
  jump: () => console.log('jumped!')
}

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type MixinIntersection<T extends Array<any>> = UnionToIntersection<(T)[number]>
type KeyedObject = {[key: string]: any};
type Prototyped<T> = {prototype: T}
type ClassType<T extends KeyedObject> = T extends Prototyped<KeyedObject> ? T : T['prototype'];
type RealType<T extends KeyedObject> = T extends Prototyped<KeyedObject> ? T['prototype'] : T;
declare type Constructor<T> = new (...args: any[]) => T;

function mixin<X extends RealType<KeyedObject>, Y extends RealType<KeyedObject>>(base: X, mixins: Array<Y>) {
  const x = 1;
  // @ts-ignore
  type MixedConstructor = new () => RealType<X> & MixinIntersection<Array<RealType<Y>>>
  type MixedStatic = ClassType<X> & MixinIntersection<Array<ClassType<Y>>>
  return x as MixedConstructor & MixedStatic
}

const y = {1: 'na'}
const XClass = mixin(Person, [Jumpable, Flyable])

class Test extends mixin(Person, [Flyable]) {
  constructor() {
    super()
  }

  doThing() {
    this.fly()
    console.log('doing thing')
  }
}

const v = new Test()
