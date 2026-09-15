/** One registry prevents two spellings of one cache entry. */
export const keys = {
	cookbook: { live: (instance: string) => ['cookbook', 'live', instance] as const },
	session: { root: () => ['session'] as const, all: () => ['session', 'sessions'] as const },
	activity: {
		root: () => ['activity'] as const,
		list: (facet?: string, correlation?: string) =>
			['activity', 'list', { facet: facet ?? null, correlation: correlation ?? null }] as const
	},
	example: {
		root: () => ['example'] as const,
		all: (workspace: string) => ['example', 'items', workspace] as const,
		one: (id: string) => ['example', 'items', 'one', id] as const,
		default: (workspace: string) => ['example', 'items', 'default', workspace] as const
	}
} as const;
