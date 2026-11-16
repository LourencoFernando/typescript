// Linked list practice project: a simple starting point.
//
// A linked list stores values in nodes; each node points to the next one.
// This first version is a singly linked list that can only append and print.
// It applies classes and generics; operations such as remove, find, or insert
// at an index are left for later iterations.

// A node holds one value and an optional link to the next node. `T` is the
// value type, so a list of numbers only accepts number nodes.
class ListNode<T> {
    next?: ListNode<T>;
    value: T;

    // Explicit field instead of the `constructor(public value: T)` parameter
    // property: Node runs `.ts` files by stripping types only, and parameter
    // properties generate code, so `node linked-list.ts` rejects them with
    // ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX. `tsc` accepts both forms.
    constructor(value: T) {
        this.value = value;
    }
}

class LinkedList<T> {
    // `root` is the first node and `tail` the last. Both are undefined while
    // the list is empty, which `?` makes explicit for strict null checks.
    private root?: ListNode<T>;
    private tail?: ListNode<T>;
    // Counted on each add, so getNumberOfElements() doesn't walk the list.
    private length = 0;

    add(value: T) {
        const node = new ListNode(value);
        // Checking both fields narrows them, so `this.tail.next` below is
        // known to be safe without a non-null assertion.
        if (!this.root || !this.tail) {
            this.root = node;
            this.tail = node;
        } else {
            // Keeping a tail reference makes appending O(1) instead of
            // walking from the root each time.
            this.tail.next = node;
            this.tail = node;
        }
        this.length++;
    }

    getNumberOfElements() {
        return this.length;
    }

    print() {
        // Walk from the root until `next` is undefined (the end of the list).
        let current = this.root;
        while (current) {
            console.log(current.value);
            current = current.next;
        }
    }
}

// The type argument fixes the value type: `numberList.add("a")` is an error.
const numberList = new LinkedList<number>();

numberList.add(10);
numberList.add(5);
numberList.add(-5);

console.log(numberList.getNumberOfElements());
numberList.print();

// Same class reused for strings; not filled in yet.
const nameList = new LinkedList<string>();

/*
 * Use cases and architectural decisions
 *
 * - This list is a starting point for practicing classes and generics, not a
 *   replacement for arrays. JavaScript arrays are faster for most workloads
 *   because their items sit together in memory; linked lists pay off when
 *   items are often added or removed at the ends or middle of a long sequence,
 *   as in queues, undo histories, or LRU caches.
 * - Generics (`LinkedList<T>`) give one implementation for every value type
 *   while keeping each list type-safe, unlike an `any`-based list.
 * - `private` fields protect `root`, `tail`, and `length` only at compile
 *   time. Use `#root` (JavaScript private fields) if callers must not be able
 *   to reach them at runtime.
 * - `length` is stored rather than computed: reads are O(1), but every future
 *   operation that adds or removes nodes must keep it in sync.
 * - Next steps: a `remove` method must update `root`, `tail`, and `length`
 *   together (including the single-node case), and implementing
 *   `[Symbol.iterator]` would let the list work with `for...of` and spread.
 */
