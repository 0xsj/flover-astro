/**
 * AlertDialog — a confirmation for an action that cannot be undone.
 *
 * There is no close button and no outside dismissal: a stray click is not a
 * decision. Escape still resolves to the safe cancel path. The description is
 * required because a question that demands a choice must state its consequence.
 * Focus starts on the panel, never the destructive action, so pressing Enter
 * again after opening cannot confirm an unread choice.
 */
export {};
