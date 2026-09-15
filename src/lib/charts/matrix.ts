export type Cell =
	| { state: 'value'; value: number }
	| { state: 'absent' }
	| { state: 'unattempted' }
	| { state: 'na' };

/** `n/a` is excluded from both halves of coverage; it is not a failed check. */
export function coverageOf(
	rows: readonly string[],
	columns: readonly string[],
	cell: (row: string, column: string) => Cell
): { checked: number; applicable: number; ratio: number } | null {
	let checked = 0;
	let applicable = 0;
	for (const row of rows) {
		for (const column of columns) {
			const value = cell(row, column);
			if (value.state === 'na') continue;
			applicable++;
			if (value.state === 'absent' || (value.state === 'value' && Number.isFinite(value.value))) checked++;
		}
	}
	return applicable === 0 ? null : { checked, applicable, ratio: checked / applicable };
}
