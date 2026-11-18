# ECMAScript Decorators

Standalone examples about ECMAScript (standard) decorators, supported since
TypeScript 5.0 without the `experimentalDecorators` flag. There is no tsconfig
here; type-check one file at a time:

```sh
tsc --noEmit --strict "ecmascript decorators/<file>.ts"
```

Node 24 can't run these files directly: it only strips types, and its
JavaScript engine doesn't support the `@decorator` syntax yet, so `node file.ts`
fails with `SyntaxError: Invalid or unexpected token`. To see the output, compile
first to a folder outside the repository, then run the result:

```sh
tsc --strict --outDir /tmp/decorators "ecmascript decorators/<file>.ts"
node /tmp/decorators/<file>.js
```

## Reading order

1. `decorators.ts`: class, method, and field decorators, a decorator factory,
   `addInitializer`, and the order in which decorators and their initializers
   run.

## Study questions

- Why does the `logger` decorator's output appear after both field
  decorators', even though `@logger` is written first?
- Why is `target` always `undefined` in a field decorator?
- Why does `greet()` print "Hi, I am " without a name?
- What would break if `autobind` didn't call `addInitializer`, and the
  constructor didn't bind `greet` either?
- What is the difference between `@fieldLogger` and `@replacer("")`?
- Why can't Node run this file directly, and how do standard decorators differ
  from `experimentalDecorators`?
