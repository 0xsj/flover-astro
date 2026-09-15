/** A small, dependency-free scale vocabulary for SVG charts. */

export type Scale = {
	(value: number): number;
	domain: readonly [number, number];
	range: readonly [number, number];
	ticks: (count?: number) => number[];
};

const make = (
	domain: readonly [number, number],
	range: readonly [number, number],
	to: (value: number) => number
): Scale => Object.assign(to, { domain, range, ticks: (count = 5) => niceTicks(domain, count) });

/** A zero-width domain maps to the middle of the range so one datum remains
 * representable instead of dividing by zero. */
export function linear(domain: readonly [number, number], range: readonly [number, number]): Scale {
	const [d0, d1] = domain;
	const [r0, r1] = range;
	const span = d1 - d0;
	return make(domain, range, (value) =>
		span === 0 ? (r0 + r1) / 2 : r0 + ((value - d0) / span) * (r1 - r0)
	);
}

export type BandScale = {
	(value: string): number;
	bandWidth: number;
	step: number;
	domain: readonly string[];
	range: readonly [number, number];
};

/** Categories map to the start of evenly spaced bands. */
export function band(
	domain: readonly string[],
	range: readonly [number, number],
	padding = 0.1
): BandScale {
	const [r0, r1] = range;
	const step = (r1 - r0) / Math.max(1, domain.length);
	const bandWidth = step * (1 - padding);
	const index = new Map(domain.map((value, i) => [value, i]));
	const at = (value: string) => r0 + (index.get(value) ?? 0) * step + (step - bandWidth) / 2;
	return Object.assign(at, { bandWidth, step, domain, range });
}

/** A symmetric scale around a meaningful midpoint. */
export function diverging(
	values: readonly number[],
	midpoint = 0
): { at: (value: number) => number; extent: number } {
	const extent = Math.max(1e-9, ...values.map((value) => Math.abs(value - midpoint)));
	return { at: (value) => (value - midpoint) / extent, extent };
}

export function extentOf(values: readonly number[]): [number, number] {
	return values.length ? [Math.min(...values), Math.max(...values)] : [0, 1];
}

export function pad([lo, hi]: readonly [number, number], fraction = 0.06): [number, number] {
	const span = hi - lo || Math.abs(hi) || 1;
	return [lo - span * fraction, hi + span * fraction];
}

/** Round ticks to the readable 1, 2, 5 x 10^n sequence. */
export function niceTicks([lo, hi]: readonly [number, number], count = 5): number[] {
	if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) return [lo];
	const raw = (hi - lo) / Math.max(1, count);
	const magnitude = 10 ** Math.floor(Math.log10(raw));
	const normalised = raw / magnitude;
	const step = (normalised >= 5 ? 10 : normalised >= 2 ? 5 : normalised >= 1 ? 2 : 1) * magnitude;
	const first = Math.ceil(lo / step) * step;
	const output: number[] = [];
	for (let value = first, i = 0; value <= hi + step * 1e-9 && i < 500; value += step, i++) {
		output.push(Math.abs(value) < step * 1e-9 ? 0 : value);
	}
	return output;
}

/** Quantise values before putting them into SVG attributes. */
export const px = (value: number): number => Math.round(value * 100) / 100;
