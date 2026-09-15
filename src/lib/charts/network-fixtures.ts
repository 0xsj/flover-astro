import type { GraphEdge, GraphHull, GraphNode } from './graph-types';

export const networkNodes: readonly GraphNode[] = [
	{ id: 'core', label: 'Core', group: 'core', size: 9, shape: 'hexagon' },
	{ id: 'ingest', label: 'Ingest', group: 'source', shape: 'pill' },
	{ id: 'queue', label: 'Queue', group: 'source' },
	{ id: 'transform', label: 'Transform', group: 'process', size: 8, shape: 'diamond' },
	{ id: 'index', label: 'Index', group: 'process' },
	{ id: 'report', label: 'Report', group: 'output', shape: 'square' },
	{ id: 'alert', label: 'Alert', group: 'output', shape: 'triangle' }
];

export const networkEdges: readonly GraphEdge[] = [
	{ from: 'ingest', to: 'core', kind: 'derivation' },
	{ from: 'queue', to: 'core' },
	{ from: 'core', to: 'transform' },
	{ from: 'core', to: 'index' },
	{ from: 'transform', to: 'report' },
	{ from: 'index', to: 'report' },
	{ from: 'index', to: 'alert', kind: 'dashed' },
	{ from: 'ghost', to: 'core', label: 'ignored dangling edge' }
];

export const bipartiteNodes: readonly GraphNode[] = [
	{ id: 'author', label: 'Authors', group: 'people', shape: 'pill' },
	{ id: 'reviewer', label: 'Reviewers', group: 'people', shape: 'pill' },
	{ id: 'paper-a', label: 'Paper A', group: 'papers' },
	{ id: 'paper-b', label: 'Paper B', group: 'papers' },
	{ id: 'paper-c', label: 'Paper C', group: 'papers' }
];

export const bipartiteEdges: readonly GraphEdge[] = [
	{ from: 'author', to: 'paper-a' },
	{ from: 'author', to: 'paper-b' },
	{ from: 'reviewer', to: 'paper-b' },
	{ from: 'reviewer', to: 'paper-c' }
];

export const flowNodes: readonly GraphNode[] = [
	{ id: 'source', label: 'Source', group: 0, shape: 'pill' },
	{ id: 'parse', label: 'Parse', group: 1 },
	{ id: 'validate', label: 'Validate', group: 2, shape: 'diamond' },
	{ id: 'publish', label: 'Publish', group: 3, shape: 'square' },
	{ id: 'archive', label: 'Archive', group: 4 }
];

export const flowEdges: readonly GraphEdge[] = [
	{ from: 'source', to: 'parse' },
	{ from: 'parse', to: 'validate' },
	{ from: 'validate', to: 'publish' },
	{ from: 'validate', to: 'archive', kind: 'derivation' },
	{ from: 'publish', to: 'archive' }
];

export const correlationNodes: readonly GraphNode[] = [
	{ id: 'alpha', label: 'Alpha', group: 'module-a' },
	{ id: 'beta', label: 'Beta', group: 'module-a' },
	{ id: 'gamma', label: 'Gamma', group: 'module-a' },
	{ id: 'delta', label: 'Delta', group: 'module-b' },
	{ id: 'epsilon', label: 'Epsilon', group: 'module-b' },
	{ id: 'zeta', label: 'Zeta', group: 'module-b' }
];

export const correlationEdges: readonly GraphEdge[] = [
	{ from: 'alpha', to: 'beta', signed: 0.84, width: 2 },
	{ from: 'alpha', to: 'delta', signed: -0.64 },
	{ from: 'beta', to: 'gamma', signed: 0.42 },
	{ from: 'gamma', to: 'epsilon', signed: -0.31 },
	{ from: 'delta', to: 'epsilon', signed: 0.76, width: 2 },
	{ from: 'epsilon', to: 'zeta', signed: -0.52 }
];

export const moduleHulls: readonly GraphHull[] = [
	{ ids: ['alpha', 'beta', 'gamma'], label: 'Module A', fill: 'var(--chart-1)' },
	{ ids: ['delta', 'epsilon', 'zeta'], label: 'Module B', fill: 'var(--chart-2)' }
];
