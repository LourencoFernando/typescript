// Exported so App can type its state with the same shape.
export type Goal = {
    id: number;
    title: string;
    description: string;
};

interface CourseGoalsProps {
    goals: Goal[];
    // A callback prop: the parent decides what deleting means.
    onDelete: (id: number) => void;
}

// Destructuring in the parameter list, typed by the props interface.
export default function CourseGoals({ goals, onDelete }: CourseGoalsProps) {
    return (
        <ul>
            {goals.map((goal) => (
                // key lets React match list items between renders; the id is stable.
                <li key={goal.id}>
                    <article>
                        <div>
                            <h2>{goal.title}</h2>
                            <p>{goal.description}</p>
                        </div>
                    </article>
                    {/* An arrow function wraps the call to pass this goal's id. */}
                    <button onClick={() => onDelete(goal.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

/*
Use cases and architectural decisions

- Exporting the data type from the component that displays it keeps the shape
  next to its main use. Once several components or an API layer share Goal,
  moving it to a `types.ts` file avoids components importing from each other.
- `type` vs. `interface`: both work for props. Here Goal is a `type` and the
  props are an `interface`; interfaces can be extended and merged, types can
  also describe unions. Pick one style per project for consistency.
- `onDelete: (id: number) => void` makes the list a presentational component:
  it shows goals and reports clicks, but doesn't own or change the data. That
  makes it reusable with any state source.
- Using `goal.id` as the key matters once items can be removed; array indexes
  as keys would shift and make React reuse the wrong elements.
*/
