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

// https://stackoverflow.com/a/45332959
function mixin<X extends Prototyped<KeyedObject>, Y extends Prototyped<KeyedObject>>(base: X, mixins: Array<Y>) {
  // @ts-ignore
  class baseClass extends base {
      constructor (...args: any[]) {
          super(...args);
          mixins.forEach((mixin) => {
              // @ts-ignore
              copyProps(this,(new mixin));
          });
      }
  }

  const copyProps = (target: any, source: any) => {  // this function copies all properties and symbols, filtering out some special ones
      Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source).map(symbol => symbol.toString()))
            .forEach((prop) => {
               if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                  Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)!);
             })
  }

  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  type MixedConstructor = new () => RealType<X> & MixinIntersection<Array<RealType<Y>>>
  type MixedStatic = ClassType<X> & MixinIntersection<Array<ClassType<Y>>>
  return baseClass as MixedConstructor & MixedStatic
}

const XClass = mixin(Person, [Jumpable, Flyable])
const z = new XClass()
z.doubleJump()
console.log(z.height)
