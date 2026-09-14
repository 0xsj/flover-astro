import type { CallOptions } from '../../http';

export type AuditScope = 'system' | 'account' | 'session';

export type AuditEntry = {
	id: string;
	scope: AuditScope;
	action: string;
	subject: string;
	actor: string;
	correlation_id: string;
	detail: Record<string, unknown>;
	occurred_at: string;
};

export type AuditPage = {
	entries: AuditEntry[];
	next?: string;
	facets?: Array<{ facet: string; total: number }>;
};

export type PageOptions = CallOptions & {
	after?: string;
	limit?: number;
	facet?: string;
	correlation?: string;
};
