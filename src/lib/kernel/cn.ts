export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
	let out = '';
	for (const value of values) {
		if (!value && value !== 0) continue;
		out = out ? `${out} ${value}` : String(value);
	}
	return out;
}
