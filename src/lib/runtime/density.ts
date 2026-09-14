import { createStore, persisted } from './store';

/** Density is a token override, not a prop threaded through components. */
export const DENSITIES = ['comfortable', 'compact'] as const;
export type Density = (typeof DENSITIES)[number];

const store$ = persisted<Density>('density', 'comfortable', DENSITIES);

export const density = createStore<Density>('comfortable', (value) => {
	store$.write(value);
	applyDensity(value);
});

export function applyDensity(value: Density): void {
	const root = globalThis.document?.documentElement;
	if (!root) return;
	if (value === 'comfortable') delete root.dataset.density;
	else root.dataset.density = value;
}

export function hydrateDensity(): void {
	const stored = store$.read();
	density.set(stored);
	applyDensity(stored);
}
