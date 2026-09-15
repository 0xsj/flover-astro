/** Stable chart encodings. A chart color is not an application status. */

type CSSProperties = Record<string, string | number>;

export const CATEGORICAL = [
	'var(--chart-1)',
	'var(--chart-2)',
	'var(--chart-3)',
	'var(--chart-4)'
] as const;

/** Do not cycle after the fourth category: a caller must group or facet it. */
export function categorical(index: number): string | null {
	return Number.isInteger(index) && index >= 0 && index < CATEGORICAL.length
		? CATEGORICAL[index]
		: null;
}

export function radiusFor(
	value: number,
	domain: readonly [number, number],
	range: readonly [number, number] = [3, 14]
): number {
	const [d0, d1] = domain;
	const [r0, r1] = range;
	const span = d1 - d0;
	const t = span === 0 ? 0.5 : Math.max(0, Math.min(1, (value - d0) / span));
	return Math.sqrt(r0 * r0 + t * (r1 * r1 - r0 * r0));
}

export function divergingFill(value: number): string {
	const clamped = Math.max(-1, Math.min(1, value));
	return clamped >= 0
		? `color-mix(in oklab, var(--chart-pos) ${Math.round(clamped * 100)}%, var(--chart-mid))`
		: `color-mix(in oklab, var(--chart-neg) ${Math.round(-clamped * 100)}%, var(--chart-mid))`;
}

export function sequentialFill(value: number): string {
	const clamped = Math.max(0, Math.min(1, value));
	return `color-mix(in oklab, var(--chart-seq) ${Math.round(12 + clamped * 88)}%, transparent)`;
}

export type MarkShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon' | 'pill';
export const SHAPES: readonly MarkShape[] = ['circle', 'square', 'diamond', 'triangle', 'hexagon', 'pill'];

export function shapePath(shape: MarkShape, radius: number): string {
	switch (shape) {
		case 'circle':
			return `M ${-radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
		case 'square':
			return `M ${-radius} ${-radius} H ${radius} V ${radius} H ${-radius} Z`;
		case 'diamond':
			return `M 0 ${-radius * 1.25} L ${radius * 1.25} 0 L 0 ${radius * 1.25} L ${-radius * 1.25} 0 Z`;
		case 'triangle':
			return `M 0 ${-radius * 1.2} L ${radius * 1.1} ${radius * 0.8} L ${-radius * 1.1} ${radius * 0.8} Z`;
		case 'hexagon': {
			const points = Array.from({ length: 6 }, (_, index) => {
				const angle = (Math.PI / 3) * index - Math.PI / 2;
				return `${(Math.cos(angle) * radius * 1.12).toFixed(2)} ${(Math.sin(angle) * radius * 1.12).toFixed(2)}`;
			});
			return `M ${points.join(' L ')} Z`;
		}
		case 'pill':
			return `M ${-radius * 1.5} ${-radius * 0.7} H ${radius * 1.5} A ${radius * 0.7} ${radius * 0.7} 0 0 1 ${radius * 1.5} ${radius * 0.7} H ${-radius * 1.5} A ${radius * 0.7} ${radius * 0.7} 0 0 1 ${-radius * 1.5} ${-radius * 0.7} Z`;
	}
}

export type LegendItem = {
	label: string;
	fill?: string | null;
	shape?: MarkShape;
	ramp?: 'diverging' | 'sequential';
	style?: CSSProperties;
};
