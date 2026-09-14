import { err, ok, unauthenticated, type Failure, type Result } from '../../kernel';
import { requireToken, type MemoryRoute } from '../../http';
import type { AuditEntry, AuditPage, AuditScope } from './ledger.types';

/* An append-only log that other fixtures write to. It is process-lifetime in
 * server mode and root-lifetime in a browser bundle, so a real product replaces
 * this file with its backend rather than treating the Map as persistence. */
const entries: AuditEntry[] = [];

const newId = (): string =>
	`evt_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;

export type RecordInput = {
	scope: AuditScope;
	action: string;
	subject: string;
	actor: string;
	correlationId: string | undefined;
	detail?: Record<string, unknown>;
	occurredAt?: number;
};

/** Called by the fixture that performed an action, never by a screen. */
export function record(input: RecordInput): void {
	entries.unshift({
		id: newId(),
		scope: input.scope,
		action: input.action,
		subject: input.subject,
		actor: input.actor,
		correlation_id: input.correlationId ?? 'unknown',
		detail: input.detail ?? {},
		occurred_at: new Date(input.occurredAt ?? Date.now()).toISOString()
	});
}

const SEED: ReadonlyArray<
	Omit<RecordInput, 'correlationId'> & { correlationId: string; agoMinutes: number }
> = [
	{
		scope: 'account',
		action: 'account.created',
		subject: 'ada@example.com',
		actor: 'anonymous',
		correlationId: 'cid-seed-01',
		detail: { via: 'sign-up' },
		agoMinutes: 60 * 74
	},
	{
		scope: 'session',
		action: 'session.signed_in',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-01',
		detail: { device: 'MacBook Pro' },
		agoMinutes: 60 * 74
	},
	{
		scope: 'account',
		action: 'account.email_verified',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-02',
		detail: {},
		agoMinutes: 60 * 72
	},
	{
		scope: 'session',
		action: 'session.signed_out',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-03',
		detail: {},
		agoMinutes: 60 * 71
	},
	{
		scope: 'session',
		action: 'session.sign_in_failed',
		subject: 'ada@example.com',
		actor: 'anonymous',
		correlationId: 'cid-seed-04',
		detail: { reason: 'wrong_password', attempt: 1 },
		agoMinutes: 60 * 50
	},
	{
		scope: 'session',
		action: 'session.sign_in_failed',
		subject: 'ada@example.com',
		actor: 'anonymous',
		correlationId: 'cid-seed-04',
		detail: { reason: 'wrong_password', attempt: 2 },
		agoMinutes: 60 * 50
	},
	{
		scope: 'session',
		action: 'session.signed_in',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-05',
		detail: { device: 'iPhone' },
		agoMinutes: 60 * 49
	},
	{
		scope: 'account',
		action: 'account.password_changed',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-06',
		detail: {},
		agoMinutes: 60 * 30
	},
	{
		scope: 'session',
		action: 'session.revoked',
		subject: 'ses_older',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-06',
		detail: { device: 'iPhone' },
		agoMinutes: 60 * 30
	},
	{
		scope: 'system',
		action: 'system.rate_limit_applied',
		subject: 'ada@example.com',
		actor: 'system',
		correlationId: 'cid-seed-07',
		detail: { window: '30s', endpoint: 'POST /auth/sign-in' },
		agoMinutes: 60 * 26
	},
	{
		scope: 'system',
		action: 'system.fixture_seeded',
		subject: 'flover',
		actor: 'system',
		correlationId: 'cid-seed-08',
		detail: { note: 'the memory adapter started' },
		agoMinutes: 60 * 24
	},
	{
		scope: 'session',
		action: 'session.expired',
		subject: 'ses_stale',
		actor: 'system',
		correlationId: 'cid-seed-09',
		detail: { ttl_minutes: 30 },
		agoMinutes: 60 * 6
	},
	{
		scope: 'account',
		action: 'account.profile_updated',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-10',
		detail: { fields: ['name'] },
		agoMinutes: 60 * 5
	},
	{
		scope: 'session',
		action: 'session.signed_in',
		subject: 'ada@example.com',
		actor: 'ada@example.com',
		correlationId: 'cid-seed-11',
		detail: { device: 'Firefox on Linux' },
		agoMinutes: 90
	}
];

let seeded = false;
function seed(): void {
	if (seeded) return;
	seeded = true;
	const now = Date.now();
	for (const entry of [...SEED].sort((a, b) => b.agoMinutes - a.agoMinutes)) {
		record({ ...entry, occurredAt: now - entry.agoMinutes * 60_000 });
	}
}

export function resetLedgerFixtures(): void {
	entries.length = 0;
	seeded = false;
	seed();
}

const PAGE_SIZE = 8;
const facetOf = (action: string): string => action.split('.')[0] ?? 'other';

/* The cursor is opaque to callers but uses Web APIs so this fixture can be
 * shared by Astro server code and browser islands without Node Buffer. */
const encodeCursor = (index: number): string =>
	btoa(`i:${index}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const decodeCursor = (cursor: string | undefined): number => {
	if (!cursor) return 0;
	try {
		const padded = cursor.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((cursor.length + 3) % 4);
		const raw = atob(padded);
		const value = raw.startsWith('i:') ? Number(raw.slice(2)) : NaN;
		return Number.isFinite(value) && value >= 0 ? value : 0;
	} catch {
		return 0;
	}
};

const str = (value: unknown): string | undefined =>
	typeof value === 'string' && value ? value : undefined;

export const ledgerRoutes: MemoryRoute[] = [
	{
		method: 'GET',
		pattern: /^\/me\/activity$/,
		latencyMs: { min: 220, max: 620 },
		handle: (req): Result<AuditPage, Failure> => {
			seed();
			const token = requireToken(req);
			if (!token.ok) return err(unauthenticated('Sign in to continue.', { status: 401 }));

			const params = req.params ?? {};
			const facet = str(params.facet);
			const correlation = str(params.correlation);
			const limit = Math.min(Number(params.limit) || PAGE_SIZE, 50);
			const from = decodeCursor(str(params.after));
			const filtered = entries.filter(
				(entry) =>
					(!facet || facetOf(entry.action) === facet) &&
					(!correlation || entry.correlation_id === correlation)
			);

			const slice = filtered.slice(from, from + limit);
			const nextIndex = from + slice.length;
			const page: AuditPage = { entries: slice };
			if (nextIndex < filtered.length) page.next = encodeCursor(nextIndex);

			if (!params.after) {
				const totals = new Map<string, number>();
				for (const entry of entries) {
					const facetName = facetOf(entry.action);
					totals.set(facetName, (totals.get(facetName) ?? 0) + 1);
				}
				page.facets = [...totals.entries()]
					.map(([facetName, total]) => ({ facet: facetName, total }))
					.sort((a, b) => b.total - a.total);
			}

			return ok(page);
		}
	}
];
