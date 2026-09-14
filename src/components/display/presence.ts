export const PRESENCE_MEANING = {
	found: 'found — a source said so',
	empty: 'looked, and found nothing',
	unmeasured: 'never checked — not the same as nothing'
} as const;

export const PRESENCE_WORD = { empty: 'none', unmeasured: '–' } as const;

export type PresenceValue<T = unknown> =
	| { state: 'found'; value: T }
	| { state: 'empty' }
	| { state: 'unmeasured' };
