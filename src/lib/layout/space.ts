export const SPACE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type Space = (typeof SPACE_STEPS)[number];
export type Margin = Space | 'auto';

export type SpaceProps = {
	p?: Space;
	px?: Space;
	py?: Space;
	pt?: Space;
	pb?: Space;
	pl?: Space;
	pr?: Space;
	m?: Margin;
	mx?: Margin;
	my?: Margin;
	mt?: Margin;
	mb?: Margin;
	ml?: Margin;
	mr?: Margin;
	gap?: Space;
	gapX?: Space;
	gapY?: Space;
};

const SPACE_KEYS = [
	'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
	'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
	'gap', 'gapX', 'gapY'
] as const;

const value = (input: Space | Margin | undefined): string | undefined => {
	if (input === undefined) return undefined;
	if (input === 'auto') return 'auto';
	if (input === 0) return '0';
	return `var(--space-${input})`;
};

/** Resolves spacing shorthands to the existing token scale and inline CSS. */
export function spaceStyle(props: SpaceProps): string {
	const declarations: Array<[string, string | undefined]> = [
		['padding', value(props.p)],
		['padding-inline', value(props.px)],
		['padding-block', value(props.py)],
		['padding-block-start', value(props.pt)],
		['padding-block-end', value(props.pb)],
		['padding-inline-start', value(props.pl)],
		['padding-inline-end', value(props.pr)],
		['margin', value(props.m)],
		['margin-inline', value(props.mx)],
		['margin-block', value(props.my)],
		['margin-block-start', value(props.mt)],
		['margin-block-end', value(props.mb)],
		['margin-inline-start', value(props.ml)],
		['margin-inline-end', value(props.mr)],
		['gap', value(props.gap)],
		['column-gap', value(props.gapX)],
		['row-gap', value(props.gapY)]
	];
	return declarations.filter(([, declaration]) => declaration !== undefined)
		.map(([property, declaration]) => `${property}:${declaration};`)
		.join('');
}

export function splitSpace<T extends SpaceProps & Record<string, unknown>>(props: T): [string, Omit<T, keyof SpaceProps>] {
	const rest = { ...props } as Record<string, unknown>;
	for (const key of SPACE_KEYS) delete rest[key];
	return [spaceStyle(props), rest as Omit<T, keyof SpaceProps>];
}
