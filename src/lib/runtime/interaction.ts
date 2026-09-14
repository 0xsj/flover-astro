import { createStore } from './store';

/* An interaction is a user action, not a request and not a component lifetime.
 * Its id is passed to the composition root so one action can correlate several
 * requests without sharing state between server requests. */
const newId = (): string =>
	globalThis.crypto?.randomUUID?.() ?? `int-${Math.random().toString(36).slice(2, 10)}`;

/** Empty means that no user action has begun yet. */
export const interaction = createStore<string>('');

export function beginInteraction(): string {
	const id = newId();
	interaction.set(id);
	return id;
}

export function currentInteraction(): string {
	return interaction.get() || beginInteraction();
}

export function endInteraction(): void {
	interaction.set('');
}
