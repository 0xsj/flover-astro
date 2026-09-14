import { density, hydrateDensity, type Density } from './density';
import { hydrateTheme, theme, type Theme } from './theme';

type PreferenceRoot = HTMLElement;

function setPressed(root: PreferenceRoot, attribute: 'theme' | 'density', value: string): void {
	root.ownerDocument.querySelectorAll<HTMLElement>(`[data-${attribute}-choice]`).forEach((button) => {
		button.setAttribute(
			'aria-pressed',
			button.dataset[`${attribute}Choice`] === value ? 'true' : 'false'
		);
	});
}

function sync(root: PreferenceRoot): void {
	setPressed(root, 'theme', theme.get());
	setPressed(root, 'density', density.get());
}

/** Native Astro island binding for theme and density controls.
 * The server emits defaults, boot applies the saved first-paint attributes,
 * and this binding hydrates the stores and owns subsequent button events. */
export function bindRuntimePreferences(
	root: PreferenceRoot | undefined = globalThis.document?.documentElement
): () => void {
	if (!root) return () => {};
	const document = root.ownerDocument;
	hydrateTheme();
	hydrateDensity();
	sync(root);

	const click = (event: MouseEvent) => {
		const target = event.target instanceof Element ? event.target : null;
		const themeButton = target?.closest<HTMLElement>('[data-theme-choice]');
		if (themeButton) {
			const value = themeButton.dataset.themeChoice as Theme | undefined;
			if (value) theme.set(value);
			sync(root);
			return;
		}
		const densityButton = target?.closest<HTMLElement>('[data-density-choice]');
		if (densityButton) {
			const value = densityButton.dataset.densityChoice as Density | undefined;
			if (value) density.set(value);
			sync(root);
		}
	};

	document.addEventListener('click', click);
	return () => document.removeEventListener('click', click);
}
