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
		description: 'Labelled inputs, choices, buttons, and numeric sliders.'
	},
	{
		id: 'pickers',
		label: 'Pickers',
		group: 'Primitives',
		description: 'Searchable single and multiple choices, dates, and date ranges.'
	},
	{
		id: 'display',
		label: 'Display',
		group: 'Primitives',
		description: 'Panels, stats, badges, avatars, and structured details.'
	},
	{
		id: 'feedback',
		label: 'Feedback',
		group: 'Primitives',
		description: 'Messages, errors, skeletons, and measured progress.'
	},
	{
		id: 'navigation',
		label: 'Navigation',
		group: 'Primitives',
		description: 'Breadcrumbs, tabs, links, and pagination.'
	},
	{
		id: 'disclosure',
		label: 'Disclosure',
		group: 'Primitives',
		description: 'Single and multiple accordions with keyboard navigation.'
	},
	{
		id: 'overlays',
		label: 'Overlays',
		group: 'Primitives',
		description: 'Dialogs, menus, popovers, and supplementary tooltips.'
	},
	{
		id: 'utility',
		label: 'Utility',
		group: 'Primitives',
		description: 'Icons, accessible names, hidden text, and portals.'
	}
] as const;

export type SectionId = (typeof CATALOG)[number]['id'];
export const CATALOG_GROUPS = [...new Set(CATALOG.map((entry) => entry.group))];
