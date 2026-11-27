// SubmitEvent is React's typed submit event; FormEvent is deprecated in @types/react.
import { useRef, type SubmitEvent } from "react";

interface NewGoalProps {
    onAdd: (text: string, summary: string) => void;
}

export default function NewGoal({ onAdd }: NewGoalProps) {
    // The generic says what the ref will hold; null is the value before the
    // input is rendered, so `current` is typed HTMLInputElement | null.
    const goalRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLInputElement>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        // Stops the browser from reloading the page on submit.
        event.preventDefault();

        // `!` asserts current isn't null: the form can only be submitted once
        // the inputs are rendered and the refs are attached.
        const enteredGoal = goalRef.current!.value;
        const enteredSummary = summaryRef.current!.value;

        // validation...

        onAdd(enteredGoal, enteredSummary);
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>
                <label htmlFor="goal">Your goal</label>
                <input id="goal" type="text" ref={goalRef} />
            </p>
            <p>
                <label htmlFor="summary">Short summary</label>
                <input id="summary" type="text" ref={summaryRef} />
            </p>
            <p>
                <button>Add Goal</button>
            </p>
        </form>
    );
}

/*
Use cases and architectural decisions

- Refs (uncontrolled inputs) read the values only on submit, so typing doesn't
  re-render the component. That fits simple forms. Controlled inputs
  (`useState` + `value` + `onChange` typed with ChangeEvent<HTMLInputElement>)
  fit when the UI reacts while typing, such as live validation or a character
  counter.
- `useRef<HTMLInputElement>(null)` must name the element type: the ref prop on
  <input> only accepts a ref of an input element, so a mismatch such as
  HTMLTextAreaElement is a type error.
- TypeScript can't tell the two refs apart, because both have the same type.
  Reading the wrong ref (goalRef for the summary) type-checks fine, so that bug
  can only be caught by testing the behavior.
- The `!` assertion is safe here, but it's a promise to the compiler, not a
  check. In code where the element may be missing, use `if (!ref.current)
  return;` instead.
- The component reports raw strings through `onAdd` and doesn't know about
  Goal or ids. The parent builds the Goal, so the form can be reused for any
  list.
*/
