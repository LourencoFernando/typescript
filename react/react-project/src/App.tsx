import { useState } from "react";
import goalsImg from "./assets/goals.jpg";
// `type Goal` marks a type-only import, which verbatimModuleSyntax requires;
// Vite removes it from the JavaScript.
import CourseGoals, { type Goal } from "./components/CourseGoals";
import Header from "./components/Header";
import NewGoal from "./components/NewGoal";

// Initial data. The Goal[] annotation checks each object where it's written,
// so a missing or misspelled property is reported on that line.
const dummyGoals: Goal[] = [
    {
        id: 1,
        title: "Learn React + TypeScript",
        description: "Type components, props, and state.",
    },
    {
        id: 2,
        title: "Practice with projects",
        description: "Build small apps to apply what was learned.",
    },
    {
        id: 3,
        title: "Master generics in components",
        description: "Write reusable components with generic props.",
    },
];

function App() {
    // useState infers Goal[] from the initial value, so setGoals only accepts Goal[]
    // (or an updater function returning one).
    const [goals, setGoals] = useState(dummyGoals);

    // Updater functions receive the latest state, which is safer than reading
    // `goals` directly when updates happen close together.
    function handleDeleteGoal(id: number) {
        setGoals((prevGoals) => prevGoals.filter((g) => g.id !== id));
    }

    function handleAddGoal(text: string, summary: string) {
        setGoals((prevGoals) =>
            // concat returns a new array; React only re-renders when the state
            // reference changes, so prevGoals must not be mutated with push.
            prevGoals.concat({ id: Math.random(), title: text, description: summary })
        );
    }

    return (
        <main>
            {/* children: the <h1> is passed to Header as its `children` prop. */}
            <Header
                image={{
                    src: goalsImg,
                    alt: "A list of goals",
                }}
            >
                <h1>React Goals</h1>
            </Header>
            {/* Callbacks are passed down as props; the parent owns the state. */}
            <NewGoal onAdd={handleAddGoal} />
            <CourseGoals goals={goals} onDelete={handleDeleteGoal} />
        </main>
    );
}

export default App;

/*
Use cases and architectural decisions

- Lifting state up: App owns the goals array and passes data down (`goals`) and
  callbacks down (`onAdd`, `onDelete`). The child components stay simple and
  typed only by their props, and App is the one place that changes the list.
  When many distant components need the same state, context or a store
  replaces this prop passing.
- Inference vs. annotation: `useState(dummyGoals)` infers Goal[] because the
  initial value is already annotated. With an empty start, write
  `useState<Goal[]>([])`, or TypeScript infers never[] and rejects every goal.
- Immutable updates: filter and concat return new arrays. Mutating state in
  place type-checks fine but React won't re-render, so TypeScript can't catch
  that mistake.
- `Math.random()` as an id is fine for a demo but can collide and isn't
  stable. Real apps use an id from the server or `crypto.randomUUID()`, which
  would change Goal's `id` to string.
*/
