import { err, invalid, ok, type Result } from '../../kernel';

export type GridItem = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type DashboardLayout = readonly GridItem[];

export type GridEdit =
	| 'left'
	| 'right'
	| 'up'
	| 'down'
	| 'wider'
	| 'narrower'
	| 'taller'
	| 'shorter';

/** The saved desktop grid contract. Narrow screens stack visually without
 * rewriting this layout. */
export const GRID = {
	columns: 12,
	minWidth: 3,
	minHeight: 4,
	maxHeight: 16,
	maxRows: 200,
	maxItems: 32
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const isInteger = (value: unknown): value is number =>
	typeof value === 'number' && Number.isSafeInteger(value);

const overlaps = (a: GridItem, b: GridItem): boolean =>
	a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

/** Decode persisted layouts at the storage boundary. Invalid or overlapping
 * arrangements are rejected before they can affect the grid. */
export function decodeDashboardLayout(value: unknown): Result<DashboardLayout> {
	if (!Array.isArray(value) || value.length > GRID.maxItems) {
		return err(invalid('The saved dashboard arrangement is invalid.', {}, { type: 'dashboard_layout' }));
	}

	const items: GridItem[] = [];
	const ids = new Set<string>();
	for (const raw of value) {
		if (!isRecord(raw) || typeof raw.id !== 'string' || !raw.id || raw.id.length > 128) {
			return err(invalid('The saved dashboard arrangement is invalid.', {}, { type: 'dashboard_layout' }));
		}
		if (ids.has(raw.id) || !isInteger(raw.x) || !isInteger(raw.y) || !isInteger(raw.width) || !isInteger(raw.height)) {
			return err(invalid('The saved dashboard arrangement is invalid.', {}, { type: 'dashboard_layout' }));
		}
		const item = { id: raw.id, x: raw.x, y: raw.y, width: raw.width, height: raw.height };
		if (
			item.x < 0 ||
			item.y < 0 ||
			item.width < GRID.minWidth ||
			item.height < GRID.minHeight ||
			item.height > GRID.maxHeight ||
			item.x + item.width > GRID.columns ||
			item.y + item.height > GRID.maxRows ||
			items.some((existing) => overlaps(existing, item))
		) {
			return err(invalid('The saved dashboard arrangement is invalid.', {}, { type: 'dashboard_layout' }));
		}
		ids.add(item.id);
		items.push(item);
	}

	return ok(items);
}

/** Apply one keyboard-equivalent edit. A move or resize that would leave the
 * grid bounds or collide with another widget is refused atomically. */
export function editDashboardLayout(
	layout: DashboardLayout,
	id: string,
	edit: GridEdit
): DashboardLayout {
	const current = layout.find((item) => item.id === id);
	if (!current) return layout;

	const next = { ...current };
	switch (edit) {
		case 'left':
			next.x -= 1;
			break;
		case 'right':
			next.x += 1;
			break;
		case 'up':
			next.y -= 1;
			break;
		case 'down':
			next.y += 1;
			break;
		case 'wider':
			next.width += 1;
			break;
		case 'narrower':
			next.width -= 1;
			break;
		case 'taller':
			next.height += 1;
			break;
		case 'shorter':
			next.height -= 1;
			break;
	}

	if (
		next.x < 0 ||
		next.y < 0 ||
		next.width < GRID.minWidth ||
		next.height < GRID.minHeight ||
		next.height > GRID.maxHeight ||
		next.x + next.width > GRID.columns ||
		next.y + next.height > GRID.maxRows ||
		layout.some((item) => item.id !== id && overlaps(item, next))
	) {
		return layout;
	}

	return layout.map((item) => (item.id === id ? next : item));
}
