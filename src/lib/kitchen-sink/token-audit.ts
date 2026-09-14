export type Theme = 'dark' | 'light';

export interface ContrastCheck {
	foreground: string;
	background: string;
	ratio: number | null;
	large: boolean;
	pass: boolean;
}

const PAIRS = [
	['--ink', '--surface-ground'],
	['--ink-2', '--surface-ground'],
	['--ink-3', '--surface-ground'],
	['--ink-4', '--surface-ground'],
	['--ink', '--surface-panel'],
	['--ink-2', '--surface-panel'],
	['--ink-3', '--surface-panel'],
	['--ink-4', '--surface-panel'],
	['--accent', '--surface-panel'],
	['--warn', '--surface-panel'],
	['--crit', '--surface-panel'],
	['--info', '--surface-panel'],
	['--fill-ink', '--fill']
] as const;

const hexPattern = /^#([0-9a-f]{6})$/i;

function declarationBlock(css: string, selector: RegExp): string {
	return css.match(selector)?.[1] ?? '';
}

function declarations(block: string): Record<string, string> {
	return Object.fromEntries(
		[...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()])
	);
}

function resolve(name: string, semantic: Record<string, string>, primitives: Record<string, string>): string | null {
	const seen = new Set<string>();
	let value = semantic[name] ?? primitives[name] ?? null;
	while (value?.startsWith('var(')) {
		const reference = value.slice(4, value.indexOf(')')).trim();
		if (!reference || seen.has(reference)) return null;
		seen.add(reference);
		value = semantic[reference] ?? primitives[reference] ?? null;
	}
	return value?.toLowerCase() ?? null;
}

function channel(value: string): number {
	const normalized = Number.parseInt(value, 16) / 255;
	return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(value: string): number | null {
	const match = value.match(hexPattern);
	if (!match) return null;
	const hex = match[1];
	return 0.2126 * channel(hex.slice(0, 2)) + 0.7152 * channel(hex.slice(2, 4)) + 0.0722 * channel(hex.slice(4, 6));
}

function contrast(foreground: string, background: string): number | null {
	const foregroundLuminance = luminance(foreground);
	const backgroundLuminance = luminance(background);
	if (foregroundLuminance === null || backgroundLuminance === null) return null;
	const lighter = Math.max(foregroundLuminance, backgroundLuminance);
	const darker = Math.min(foregroundLuminance, backgroundLuminance);
	return (lighter + 0.05) / (darker + 0.05);
}

function themeDeclarations(css: string, theme: Theme): Record<string, string> {
	const selector = theme === 'dark'
		? /:root\s*\{([^{}]*)\}/
		: /:root\[data-theme=['"]light['"]\]\s*\{([^{}]*)\}/;
	return declarations(declarationBlock(css, selector));
}

export function audit(primitivesCss: string, semanticCss: string): Record<Theme, ContrastCheck[]> {
	const primitives = declarations(primitivesCss);
	return {
		dark: runThemeAudit('dark', primitives, themeDeclarations(semanticCss, 'dark')),
		light: runThemeAudit('light', primitives, themeDeclarations(semanticCss, 'light'))
	};
}

function runThemeAudit(theme: Theme, primitives: Record<string, string>, semantic: Record<string, string>): ContrastCheck[] {
	return PAIRS.map(([foreground, background]) => {
		const foregroundValue = resolve(foreground, semantic, primitives);
		const backgroundValue = resolve(background, semantic, primitives);
		const ratio = foregroundValue && backgroundValue ? contrast(foregroundValue, backgroundValue) : null;
		const large = false;
		return {
			foreground,
			background,
			ratio: ratio === null ? null : Number(ratio.toFixed(2)),
			large,
			pass: ratio !== null && ratio >= (large ? 3 : 4.5)
		};
	});
}
