import { isFailureKind } from '../kernel';
import type { Effect, Plan } from './plan';

function effectOf(parts: string[]): Effect | null {
	const effect: Effect = {};
	for (const raw of parts) {
		const [name, value] = raw.trim().split(':');
		switch (name) {
			case 'fail':
				if (!isFailureKind(value)) return null;
				effect.fail = value;
				break;
			case 'empty':
				effect.empty = value === 'list' ? 'list' : 'null';
				break;
			case 'latency': {
				const milliseconds = Number(value);
				if (!Number.isFinite(milliseconds) || milliseconds < 0) return null;
				effect.latency = milliseconds;
				break;
			}
			case 'hang':
				effect.hang = true;
				break;
			case 'p': {
				const probability = Number(value);
				if (!Number.isFinite(probability) || probability < 0 || probability > 1) return null;
				effect.p = probability;
				break;
			}
			default:
				return null;
		}
	}
	return Object.keys(effect).length ? effect : null;
}

/** Parse a chaos plan from a query string. Invalid plans are ignored. */
export function parsePlan(search: string | URLSearchParams): Plan | undefined {
	const params = typeof search === 'string' ? new URLSearchParams(search) : search;
	const raw = params.get('chaos');
	if (!raw) return undefined;

	const rules: Array<readonly [string, Effect]> = [];
	for (const chunk of raw.split(';')) {
		if (!chunk.trim()) continue;
		const equals = chunk.indexOf('=');
		const pattern = equals === -1 ? '*' : chunk.slice(0, equals).trim();
		const body = equals === -1 ? chunk : chunk.slice(equals + 1);
		const effect = effectOf(body.split(','));
		if (effect) rules.push([pattern || '*', effect] as const);
	}
	if (!rules.length) return undefined;

	const seed = Number(params.get('chaosSeed'));
	return { rules, seed: Number.isFinite(seed) && seed !== 0 ? seed : undefined };
}
