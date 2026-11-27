# First TypeScript Project

A small project to practice TypeScript foundations and compiler configuration:
an investment calculator, built step by step.

`calculator.ts` takes an initial amount, an annual contribution, an expected
return, and a duration in years. It prints the total amount, total
contributions, and interest earned at the end of each year.

## Type-check and run

The tsconfig has no `outDir`, so always type-check with `--noEmit` or `tsc`
writes `.js`, `.d.ts`, and `.map` files next to the source:

```sh
cd projects/first-typescript-project
tsc --noEmit -p .
node calculator.ts
```

Node 24 strips the types and runs the file directly. The tsconfig sets
`types: []`, so Node APIs such as `process` are not typed.

## Study notes

- `InvestmentData` and `InvestmentResult` are object type aliases that describe
  the calculator's input and the entry for each year.
- `calculateInvestment` returns `InvestmentResult[] | string`: it returns an
  error message instead of throwing, so the failure path is visible in the
  signature.
- `printResults` narrows that union with `typeof results === "string"` and an
  early return. After it, `results` is `InvestmentResult[]`.
- `const annualResults: InvestmentResult[] = []` needs the annotation: an empty
  array literal doesn't tell TypeScript which element type you intend to push.

## Study questions

- What would change for callers if `calculateInvestment` threw instead of
  returning a string?
- Why does `typeof` narrowing work here, and what would you use if both
  branches of the union were objects?
- Why are the validation checks still needed when every input is typed as
  `number`?
