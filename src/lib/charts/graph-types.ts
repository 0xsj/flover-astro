import type { MarkShape } from './encode';
import type { LayoutName, Point } from './layout';

export type GraphNode = {
	id: string;
	label?: string;
	/** Which tier or class. Drives the tiered layout and the shape channel. */
	group?: string | number;
	/** Mark radius in pixels. */
	size?: number;
	fill?: string | null;
	shape?: MarkShape;
};

export type GraphEdge = {
	from: string;
	to: string;
	label?: string;
	/** A second edge kind, drawn differently. Not a weight. */
	kind?: string;
	/** -1..1 for signed networks; drives semantic hue where present. */
	signed?: number;
	width?: number;
};

export type GraphHull = { ids: readonly string[]; label?: string; fill?: string };

export type GraphFrameProps = {
	nodes: readonly GraphNode[];
	edges: readonly GraphEdge[];
	width: number;
	height: number;
	layout?: LayoutName;
	rootId?: string;
	groupOrder?: readonly (string | number)[];
	pins?: ReadonlyMap<string, Point>;
	curved?: boolean;
	labels?: boolean;
	hulls?: readonly GraphHull[];
	/** Enables pointer and keyboard selection in the static Astro renderer. */
	selectable?: boolean;
	selected?: string | null;
	title?: string;
	class?: string;
};
