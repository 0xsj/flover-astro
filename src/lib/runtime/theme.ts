import { createStore, persisted } from './store';

/** `system` is a real choice and is represented by removing the data attribute. */
export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

const store$ = persisted<Theme>('theme', 'system', THEMES);

export const theme = createStore<Theme>('system', (value) => {
	store$.write(value);
	applyTheme(value);
});

export function applyTheme(value: Theme): void {
	const root = globalThis.document?.documentElement;
	if (!root) return;
	if (value === 'system') delete root.dataset.theme;
	else root.dataset.theme = value;
}

/** Called by an explicit browser binding after the server render. */
export function hydrateTheme(): void {
	const stored = store$.read();
	theme.set(stored);
	applyTheme(stored);
}

export function resolvedTheme(choice: Theme): 'light' | 'dark' {
	if (choice !== 'system') return choice;
	return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
