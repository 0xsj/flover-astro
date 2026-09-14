export type DateRange = { start: string; end: string };

export interface DateControlProps {
	label: string;
	hint?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	id?: string;
	class?: string;
	form?: string;
	locale?: string;
	minDate?: string;
	maxDate?: string;
	/** Serializable counterpart to the sibling predicate for server-rendered Astro markup. */
	unavailableDates?: readonly string[];
}

/** Date-only values stay as ISO calendar strings; they never pass through Date or UTC. */
export function calendarDate(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError(`Expected YYYY-MM-DD, received ${value}`);
	const year = Number(value.slice(0, 4));
	const month = Number(value.slice(5, 7));
	const day = Number(value.slice(8, 10));
	const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
	if (!days || day < 1 || day > days) throw new RangeError(`Invalid calendar date, received ${value}`);
	return value;
}

export function calendarRange(value: DateRange) {
	return { start: calendarDate(value.start), end: calendarDate(value.end) };
}

export function rangeAvailabilityError(range: DateRange, unavailableDates: readonly string[] = []) {
	calendarRange(range);
	if (range.start > range.end) return 'Start date must be before end date.';
	if (unavailableDates.some((date) => date >= range.start && date <= range.end)) return 'The range includes unavailable dates.';
	return null;
}

export function dateConstraints({ minDate, maxDate, unavailableDates = [] }: Pick<DateControlProps, 'minDate' | 'maxDate' | 'unavailableDates'>) {
	if (minDate) calendarDate(minDate);
	if (maxDate) calendarDate(maxDate);
	if (minDate && maxDate && minDate > maxDate) throw new RangeError('Minimum date must not follow maximum date.');
	for (const date of unavailableDates) calendarDate(date);
	return { minDate, maxDate, unavailableDates };
}
