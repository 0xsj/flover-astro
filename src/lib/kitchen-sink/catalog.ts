/** Serializable metadata; renderers stay in the route layer. */
export const CATALOG = [
	{
		id: 'tokens',
		label: 'Tokens',
		group: 'Foundations',
		description: 'Color, spacing, borders, elevation, and motion.'
	},
	{
		id: 'typography',
		label: 'Type scale',
		group: 'Foundations',
		description: 'The font families, weights, and sizes behind the system.'
	},
	{
		id: 'layout',
		label: 'Layout',
		group: 'Foundations',
		description: 'Spacing and flow with Box, Flex, Container, and Separator.'
	},
	{
		id: 'type-components',
		label: 'Typography',
		group: 'Primitives',
		description: 'Headings, body text, and small section labels.'
	},
	{
		id: 'forms',
		label: 'Forms',
		group: 'Primitives',
		description: 'Buttons first; fields and choices follow in later slices.'
	}
] as const;

export type SectionId = (typeof CATALOG)[number]['id'];
export const CATALOG_GROUPS = [...new Set(CATALOG.map((entry) => entry.group))];
