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
type MixedStatic<X, Y> = X & MixinIntersection<Array<Y>>;

// https://stackoverflow.com/a/45332959
export function mixin<
  X extends Prototyped<KeyedObject>,
  Y extends Prototyped<KeyedObject>
>(base: X, mixins: Array<Y>) {
  // @ts-ignore
  class baseClass extends base {
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

  (baseClass as any).extendable = baseClass.prototype.constructor;

  return baseClass as MixedConstructor<X, Y> & {
    staticProps: MixedStatic<X, Y>;
  };
}
