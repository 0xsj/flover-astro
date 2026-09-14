export interface FieldControlProps {
	id: string;
	'aria-describedby'?: string;
	'aria-invalid'?: true;
	required?: true;
}

export interface FieldWiringOptions {
	id: string;
	hint?: string;
	error?: string;
	required?: boolean;
}

/**
 * Computes the attributes that connect a slotted control to its Field.
 *
 * Astro slots are content-only: unlike the sibling framework render functions,
 * they cannot receive a props object from the parent component. Keeping this
 * calculation in one helper preserves the sibling ordering and absent-versus-
 * false rules while making the caller apply the attributes explicitly.
 */
export function fieldControlProps({ id, hint, error, required }: FieldWiringOptions): FieldControlProps {
	const hintId = hint ? `${id}-hint` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

	return {
		id,
		'aria-describedby': describedBy,
		'aria-invalid': error ? true : undefined,
		required: required ? true : undefined
	};
}

export function fieldDescriptionIds(id: string, hint?: string, error?: string) {
	return {
		hintId: hint ? `${id}-hint` : undefined,
		errorId: error ? `${id}-error` : undefined
	};
}
