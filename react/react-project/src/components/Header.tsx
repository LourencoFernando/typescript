// ReactNode is anything React can render: elements, strings, numbers, arrays, null.
import type { ReactNode } from "react";

interface HeaderProps {
    image: {
        src: string;
        alt: string;
    };
    // Optional, so <Header image={...} /> without children also type-checks.
    children?: ReactNode;
}

export default function Header({ image, children }: HeaderProps) {
    return (
        <header>
            {/* Spreading passes src and alt as <img> attributes. */}
            <img {...image} />
            {children}
        </header>
    );
}

/*
Use cases and architectural decisions

- `children?: ReactNode` is the standard way to type a wrapper component (a
  layout, card, or modal) that renders whatever the parent nests inside it.
  React 18's types removed the implicit `children` from `React.FC`, so it must
  be declared explicitly.
- Grouping src and alt in an `image` object keeps the props tidy, and the
  spread forwards them to <img>. The tradeoff: spreading only works because
  the object's keys match real <img> attributes; adding an unrelated key would
  pass it to the DOM too. To accept any <img> attribute, type the prop as
  `ComponentPropsWithoutRef<"img">` instead.
- `alt` is required in the type, so TypeScript enforces accessible images at
  every call site.
*/
