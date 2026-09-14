import type { FailureKind } from '../kernel';

/** What to do to one matching request. Several fields may apply at once. */
export type Effect = {
	fail?: FailureKind;
	empty?: 'null' | 'list';
	latency?: number;
	hang?: boolean;
	p?: number;
};

/** Keys are `METHOD /path`; `*` matches one path segment run, or every request. */
export type Plan = {
	rules: ReadonlyArray<readonly [pattern: string, effect: Effect]>;
	seed?: number;
};

export function matches(pattern: string, method: string, path: string): boolean {
	if (pattern === '*') return true;
	const [patternMethod, ...rest] = pattern.split(' ');
	const patternPath = rest.join(' ');
	if (patternMethod.toUpperCase() !== method.toUpperCase()) return false;
	if (!patternPath) return true;
	const expression = new RegExp(
		'^' +
			patternPath
				.split('*')
				.map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
				.join('[^?]*') +
			'$'
	);
	return expression.test(path);
}

export function effectFor(plan: Plan, method: string, path: string): Effect | undefined {
	for (const [pattern, effect] of plan.rules) {
		if (matches(pattern, method, path)) return effect;
	}
	return undefined;
}

/** Small deterministic PRNG used only for replayable chaos runs. */
export function rng(seed: number): () => number {
	let value = seed >>> 0;
	return () => {
		value = (value + 0x6d2b79f5) >>> 0;
		let t = Math.imul(value ^ (value >>> 15), 1 | value);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export const isActive = (plan: Plan | undefined): boolean => Boolean(plan?.rules.length);
