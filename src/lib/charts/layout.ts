import { px } from './scale';

export type Point = { x: number; y: number };
export type Placement = Map<string, Point>;

export type GraphInput = {
	nodes: readonly { id: string; group?: string | number }[];
	edges: readonly { from: string; to: string }[];
	/** Positions somebody dragged. A pin wins outright: it is a constraint stated by a person. */
	pins?: ReadonlyMap<string, Point>;
	width: number;
	height: number;
};

const applyPins = (out: Placement, pins?: ReadonlyMap<string, Point>) => {
	if (pins) for (const [id, at] of pins) out.set(id, at);
	return out;
};

/** Build undirected adjacency for layouts that reason about graph distance. */
export function neighbours(input: GraphInput): Map<string, string[]> {
	const near = new Map<string, string[]>(input.nodes.map((node) => [node.id, []]));
	for (const edge of input.edges) {
		near.get(edge.from)?.push(edge.to);
		near.get(edge.to)?.push(edge.from);
	}
	return near;
}

/** Hops from a root, walking both directions so upstream nodes stay visible. */
export function hopsFrom(input: GraphInput, rootId: string): Map<string, number> {
	const near = neighbours(input);
	const depth = new Map<string, number>([[rootId, 0]]);
	let frontier = [rootId];
	while (frontier.length) {
		const next: string[] = [];
		for (const id of frontier) {
			for (const other of near.get(id) ?? []) {
				if (depth.has(other)) continue;
				depth.set(other, (depth.get(id) ?? 0) + 1);
				next.push(other);
			}
		}
		frontier = next;
	}
	const unreached = Math.max(0, ...depth.values()) + 1;
	for (const node of input.nodes) if (!depth.has(node.id)) depth.set(node.id, unreached);
	return depth;
}

/** FNV-1a gives each id a repeatable initial position for the force layout. */
function seedOf(id: string): number {
	let hash = 2166136261;
	for (let index = 0; index < id.length; index++) {
		hash ^= id.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0) / 4294967296;
}

/**
 * A bounded, seeded Fruchterman–Reingold layout.
 *
 * The Astro port keeps this native and deterministic. The sibling projects also
 * expose a Cytoscape CoSE preset, but that engine is intentionally not a runtime
 * dependency here; the public ForceNetwork preset uses this stable replacement.
 */
export function force(input: GraphInput, options?: { iterations?: number }): Placement {
	const { nodes, edges, width, height } = input;
	const count = Math.max(1, nodes.length);
	const iterations = options?.iterations ?? 220;
	const area = width * height;
	const k = Math.sqrt(area / count) * 0.72;
	const pos = new Map<string, Point>(
		nodes.map((node) => [
			node.id,
			{
				x: width * (0.2 + seedOf(`${node.id}:x`) * 0.6),
				y: height * (0.2 + seedOf(`${node.id}:y`) * 0.6)
			}
		])
	);
	const ids = nodes.map((node) => node.id);
	let temperature = Math.min(width, height) * 0.1;
	const cool = temperature / (iterations + 1);

	for (let step = 0; step < iterations; step++) {
		const displacement = new Map<string, Point>(ids.map((id) => [id, { x: 0, y: 0 }]));
		for (let i = 0; i < ids.length; i++) {
			for (let j = i + 1; j < ids.length; j++) {
				const a = pos.get(ids[i])!;
				const b = pos.get(ids[j])!;
				let dx = a.x - b.x;
				let dy = a.y - b.y;
				let distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < 0.01) {
					dx = (seedOf(ids[i]) - 0.5) * 0.1;
					dy = (seedOf(ids[j]) - 0.5) * 0.1;
					distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
				}
				const repulsion = (k * k) / distance;
				const da = displacement.get(ids[i])!;
				const db = displacement.get(ids[j])!;
				da.x += (dx / distance) * repulsion;
				da.y += (dy / distance) * repulsion;
				db.x -= (dx / distance) * repulsion;
				db.y -= (dy / distance) * repulsion;
			}
		}
		for (const edge of edges) {
			const a = pos.get(edge.from);
			const b = pos.get(edge.to);
			if (!a || !b) continue;
			const dx = a.x - b.x;
			const dy = a.y - b.y;
			const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
			const attraction = (distance * distance) / k;
			const da = displacement.get(edge.from)!;
			const db = displacement.get(edge.to)!;
			da.x -= (dx / distance) * attraction;
			da.y -= (dy / distance) * attraction;
			db.x += (dx / distance) * attraction;
			db.y += (dy / distance) * attraction;
		}
		for (const id of ids) {
			const point = pos.get(id)!;
			const displacementForNode = displacement.get(id)!;
			const length = Math.sqrt(displacementForNode.x ** 2 + displacementForNode.y ** 2) || 1;
			point.x += (displacementForNode.x / length) * Math.min(length, temperature);
			point.y += (displacementForNode.y / length) * Math.min(length, temperature);
			point.x = Math.max(12, Math.min(width - 12, point.x));
			point.y = Math.max(12, Math.min(height - 12, point.y));
		}
		temperature -= cool;
	}

	return applyPins(new Map([...pos].map(([id, point]) => [id, { x: px(point.x), y: px(point.y) }])), input.pins);
}

/** Place nodes in rings by hop distance from a root. */
export function concentric(input: GraphInput, rootId: string): Placement {
	const depth = hopsFrom(input, rootId);
	const rings = new Map<number, string[]>();
	for (const node of input.nodes) {
		if (node.id === rootId) continue;
		const ring = depth.get(node.id) ?? 1;
		if (!rings.has(ring)) rings.set(ring, []);
		rings.get(ring)!.push(node.id);
	}
	const centerX = input.width / 2;
	const centerY = input.height / 2;
	const out: Placement = new Map([[rootId, { x: px(centerX), y: px(centerY) }]]);
	let inner = 0;
	for (const [ring, ids] of [...rings].sort((a, b) => a[0] - b[0])) {
		const needed = (ids.length * 62) / (Math.PI * 2);
		const radius = Math.max(70, needed, inner + 62);
		inner = radius;
		const stepAngle = (Math.PI * 2) / ids.length;
		const turn = ring % 2 === 0 ? stepAngle / 2 : 0;
		ids.forEach((id, index) => {
			const angle = index * stepAngle + turn;
			out.set(id, { x: px(centerX + Math.cos(angle) * radius), y: px(centerY + Math.sin(angle) * radius * 0.82) });
		});
	}
	return applyPins(out, input.pins);
}

/** Place every node on one circle; the topology is then expressed by chords. */
export function circular(input: GraphInput): Placement {
	const centerX = input.width / 2;
	const centerY = input.height / 2;
	const radius = Math.min(input.width, input.height) / 2 - 26;
	const stepAngle = (Math.PI * 2) / Math.max(1, input.nodes.length);
	const out: Placement = new Map();
	input.nodes.forEach((node, index) => {
		const angle = index * stepAngle - Math.PI / 2;
		out.set(node.id, { x: px(centerX + Math.cos(angle) * radius), y: px(centerY + Math.sin(angle) * radius) });
	});
	return applyPins(out, input.pins);
}

/** Place groups in columns. Two groups are bipartite; more are multipartite. */
export function tiered(input: GraphInput, order?: readonly (string | number)[]): Placement {
	const groups = new Map<string | number, string[]>();
	for (const node of input.nodes) {
		const group = node.group ?? 0;
		if (!groups.has(group)) groups.set(group, []);
		groups.get(group)!.push(node.id);
	}
	const keys = [...new Set([...(order ?? []), ...groups.keys()])].filter((key) => groups.has(key));
	const columns = Math.max(1, keys.length);
	const out: Placement = new Map();
	keys.forEach((key, column) => {
		const ids = groups.get(key)!;
		const x = columns === 1 ? input.width / 2 : 28 + (column * (input.width - 56)) / (columns - 1);
		ids.forEach((id, index) => out.set(id, { x: px(x), y: px(((index + 1) * input.height) / (ids.length + 1)) }));
	});
	return applyPins(out, input.pins);
}

/** Place nodes by longest path from a source, for directed flow diagrams. */
export function columns(input: GraphInput): Placement {
	const incoming = new Map<string, string[]>(input.nodes.map((node) => [node.id, []]));
	for (const edge of input.edges) incoming.get(edge.to)?.push(edge.from);
	const depth = new Map<string, number>();
	const seen = new Set<string>();
	const walk = (id: string): number => {
		const known = depth.get(id);
		if (known !== undefined) return known;
		if (seen.has(id)) return 0;
		seen.add(id);
		const from = incoming.get(id) ?? [];
		const value = from.length === 0 ? 0 : Math.max(...from.map(walk)) + 1;
		depth.set(id, value);
		return value;
	};
	for (const node of input.nodes) walk(node.id);
	const byColumn = new Map<number, string[]>();
	for (const node of input.nodes) {
		const column = depth.get(node.id) ?? 0;
		if (!byColumn.has(column)) byColumn.set(column, []);
		byColumn.get(column)!.push(node.id);
	}
	const count = Math.max(1, byColumn.size);
	const out: Placement = new Map();
	for (const [index, [, ids]] of [...byColumn].sort(([a], [b]) => a - b).entries()) {
		const x = count === 1 ? input.width / 2 : 28 + (index * (input.width - 56)) / (count - 1);
		ids.forEach((id, row) => out.set(id, { x: px(x), y: px(((row + 1) * input.height) / (ids.length + 1)) }));
	}
	return applyPins(out, input.pins);
}

/** Honest fallback: a grid says nothing about topology, so it implies nothing. */
export function grid(input: GraphInput): Placement {
	const columns = Math.max(1, Math.ceil(Math.sqrt(input.nodes.length)));
	const rows = Math.max(1, Math.ceil(input.nodes.length / columns));
	const out: Placement = new Map();
	input.nodes.forEach((node, index) => {
		const column = index % columns;
		const row = Math.floor(index / columns);
		out.set(node.id, { x: px(((column + 1) * input.width) / (columns + 1)), y: px(((row + 1) * input.height) / (rows + 1)) });
	});
	return applyPins(out, input.pins);
}

export const LAYOUTS = ['force', 'concentric', 'circular', 'tiered', 'columns', 'grid'] as const;
export type LayoutName = (typeof LAYOUTS)[number];
