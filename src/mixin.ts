// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type MixinIntersection<T extends Array<any>> = UnionToIntersection<T[number]>;
type KeyedObject = { [key: string]: any };
type Prototyped<T> = { prototype: T };
type RealType<T extends KeyedObject> = T['prototype'];
declare type Constructor<T> = new (...args: any[]) => T;
type MixedConstructor<X, Y> = new () => RealType<X> &
  MixinIntersection<Array<RealType<Y>>>;
type MixedStatic<X, Y> = Objectified<X> & Objectified<UnionToIntersection<Y>>;
type Objectified<T> = { [Prop in keyof T]: T[Prop] };

// https://stackoverflow.com/a/45332959
export function mixin<
  X extends Prototyped<KeyedObject>,
  Y extends Prototyped<KeyedObject>
>(base: X, mixins: Array<Y>) {
  // @ts-ignore
  class MixedClass extends base {
    constructor(...args: any[]) {
      super(...args);
      mixins.forEach((mixin) => {
        // @ts-ignore
        copyProps(this, new mixin());
      });
    }
  }

  const copyProps = (target: any, source: any) => {
    Object.getOwnPropertyNames(source)
      .concat(
        Object.getOwnPropertySymbols(source).map((symbol) => symbol.toString())
      )
      .forEach((prop) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          )
        )
          Object.defineProperty(
            target,
            prop,
            Object.getOwnPropertyDescriptor(source, prop)!
          );
      });
  };

  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  Object.defineProperty(MixedClass, 'Instance', {
    get: function () {
      throw new Error('Instance property on mixed classes is only for typing');
    },
  });

  return MixedClass as MixedConstructor<X, Y> &
    MixedStatic<X, Y> & {
      Instance: RealType<X> & UnionToIntersection<RealType<Y>>;
    };
}
