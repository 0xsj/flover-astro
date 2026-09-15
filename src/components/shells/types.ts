export type NavItem = {
	href: string;
	label: string;
	/** Optional caller-supplied glyph; the shell does not choose an icon set. */
	icon?: string;
	exact?: boolean;
};

export type NavGroup = {
	label?: string;
	items: readonly NavItem[];
};
