class Person {
  static totalPopulation = 10;
  id = 12
  name!: string;
}
class Jumpable {
  static gravity = 9.8;
  height = 2
  jump() { console.log('jumped') }
  doubleJump = () => console.log('double')
}
class Flyable {
  fly() { console.log('flew') }
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
  mixins.forEach(mixin => {

    // static properties
    Object.keys(mixin).forEach(property => {
      Object.defineProperty(
        base,
        property,
        Object.getOwnPropertyDescriptor(mixin, property) || Object.create(null)
      )
    })

    // class methods on prototype
    Object.keys(mixin.prototype).forEach(property => {
      Object.defineProperty(
        base.prototype,
        property,
        Object.getOwnPropertyDescriptor(mixin.prototype, property) || Object.create(null)
      )
    })

    // Instance properties (vars, arrow functions)
    // @ts-ignore
    const instance = new mixin()
    Object.keys(instance).forEach(property => {
      Object.defineProperty(
        base.prototype,
        property,
        Object.getOwnPropertyDescriptor(instance, property) || Object.create(null)
      )
    })
  })

  type MixedConstructor = new () => RealType<X> & MixinIntersection<Array<RealType<Y>>>
  type MixedStatic = ClassType<X> & MixinIntersection<Array<ClassType<Y>>>
  return base as MixedConstructor & MixedStatic
}

const y = {1: 'na'}
const XClass = mixin(Person, [Jumpable])
const z = new XClass()
z.doubleJump()
