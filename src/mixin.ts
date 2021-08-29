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
type MixedConstructor<X extends Constructor<any>, Y> = new (
  ...args: ConstructorParameters<X>
) => RealType<X> & MixinIntersection<Array<RealType<Y>>>;
type ArgumentlessConstructor<T> = new () => T;
type Constructor<T> = new (...args: any[]) => T;
type MixedStatic<X, Y> = Objectified<X> & Objectified<UnionToIntersection<Y>>;
type Objectified<T> = { [Prop in keyof T]: T[Prop] };

// https://stackoverflow.com/a/45332959
export function mixin<
  X extends Prototyped<KeyedObject> & Constructor<any>,
  Y extends Prototyped<KeyedObject> & ArgumentlessConstructor<any>
>(base: X, mixins: Array<Y>) {
  class MixedClass extends base {
    constructor(...args: any[]) {
      super(...args);
      mixins.forEach((mixin) => {
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
