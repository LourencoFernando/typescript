// Investment calculator (work in progress).
// Input data:
// - initial amount
// - annual contribution
// - expected return
// - duration

// Object type alias describing the calculator input.
type InvestmentData = {
    initialAmount: number;
    annualContribution: number;
    expectedReturn: number;
    duration: number;
};

// Shape of one year-end entry in the result list.
type InvestmentResult = {
    year: string;
    totalAmount: number;
    totalContributions: number;
    totalInterestEarned: number;
};

// Union return type: either the yearly results or an error message.
// Returning a string instead of throwing makes the failure path visible
// in the type, so callers must narrow before using the results.
type calculationResult = InvestmentResult[] | string;

function calculateInvestment(data: InvestmentData): calculationResult {
    // Destructuring keeps the declared types of each property.
    const { initialAmount, annualContribution, expectedReturn, duration } = data;

    // Validation returns the string branch of the union.
    if (initialAmount < 0) {
        return "Initial investment amount must be at least zero.";
    }

    if (duration <= 0) {
        return "No valid amounts of years provided.";
    }

    if (expectedReturn < 0) {
        return "Expected return must be at least zero.";
    }

    let total = initialAmount;
    let totalContributions = 0;
    let totalInterestEarned = 0;

    // Explicit annotation: an empty array literal would otherwise not
    // describe the element type we intend to push.
    const annualResults: InvestmentResult[] = [];

    for (let i = 0; i < duration; i++) {
        total = total * (1 + expectedReturn);
        totalInterestEarned = total - totalContributions - initialAmount;
        totalContributions = totalContributions + annualContribution;
        // Add this year's contribution after interest, so it starts earning next year.
        total = total + annualContribution;

        // Shorthand properties must still match InvestmentResult exactly.
        annualResults.push({
            year: `Year ${i + 1}`,
            totalAmount: total,
            totalInterestEarned,
            totalContributions
        });
    }

    return annualResults;
}

function printResults(results: calculationResult) {
    // typeof narrowing: inside this branch `results` is `string`.
    if (typeof results === "string") {
        console.log(results);
        return;
    }

    // After the early return, TypeScript narrows `results` to InvestmentResult[].
    for (const yearEndResult of results) {
        console.log(yearEndResult.year);
        console.log(`Total: ${yearEndResult.totalAmount.toFixed(0)}`);
        console.log(`Total Contributions: ${yearEndResult.totalContributions.toFixed(0)}`);
        console.log(`Total Interest Earned: ${yearEndResult.totalInterestEarned.toFixed(0)}`);
        console.log("-------------------------------");
    }
}

// Annotating the object checks it against InvestmentData at declaration time.
const investmentData: InvestmentData = {
    initialAmount: 5000,
    annualContribution: 500,
    expectedReturn: 0.00,
    duration: 10
};

const results = calculateInvestment(investmentData);

printResults(results);

/*
 * Use cases and architectural decisions
 *
 * - Result-as-union (`InvestmentResult[] | string`): fits form handlers or
 *   CLI tools where invalid input is an expected outcome, not an exceptional
 *   one. The compiler forces callers to handle the error branch, which
 *   `throw` cannot express in a TypeScript signature.
 * - Tradeoff: a bare `string` error carries no structure (no field name or
 *   code). Real applications often use a discriminated union such as
 *   `{ ok: true; value: T } | { ok: false; error: string }`, which scales
 *   better when the success type could also be a string.
 * - `typeof` narrowing works here because the two branches have different
 *   runtime types (string vs. object/array). For two object shapes you would
 *   need a discriminant property or `Array.isArray`.
 * - Type aliases for input and output document the module boundary; the same
 *   types could be shared with a UI layer that collects the inputs.
 * - Runtime limitation: types are erased (Node only strips them), so values
 *   coming from user input or JSON still need the explicit validation checks
 *   at the top of `calculateInvestment`.
 */
