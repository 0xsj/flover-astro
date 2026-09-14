const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'textarea:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

const controls = (wrapper: HTMLElement | null) => {
	if (!wrapper) return null;
	return (wrapper.matches(FOCUSABLE) ? wrapper : wrapper.querySelector<HTMLElement>(FOCUSABLE)) ?? null;
};

const focusable = (element: HTMLElement) =>
	[...element.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
		(entry) => !entry.hasAttribute('hidden') && entry.getAttribute('aria-hidden') !== 'true'
	);

const focusFirst = (panel: HTMLElement) => {
	const first = focusable(panel)[0];
	(first ?? panel).focus();
};

const keepFocusInside = (event: KeyboardEvent, panel: HTMLElement) => {
	if (event.key !== 'Tab') return;
	const entries = focusable(panel);
	if (!entries.length) {
		event.preventDefault();
		panel.focus();
		return;
	}
	const first = entries[0];
	const last = entries.at(-1);
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last?.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
};

const updateScrollLock = () => {
	const locked = Boolean(document.querySelector('[data-overlay-open="true"]'));
	document.body.toggleAttribute('data-overlay-lock', locked);
};

const markTrigger = (wrapper: HTMLElement | null, popup: HTMLElement, popupRole: string) => {
	const trigger = controls(wrapper);
	if (!trigger) return null;
	trigger.setAttribute('aria-haspopup', popupRole);
	trigger.setAttribute('aria-controls', popup.id);
	trigger.setAttribute('aria-expanded', 'false');
	return trigger;
};

const closeByClick = (event: MouseEvent, selector: string, close: () => void) => {
	const target = event.target instanceof Element ? event.target : null;
	if (target?.closest(selector)) close();
};

const positionFloating = (
	panel: HTMLElement,
	anchor: HTMLElement,
	side: 'top' | 'right' | 'bottom' | 'left',
	align: 'start' | 'center' | 'end',
	offset: number
) => {
	const anchorBox = anchor.getBoundingClientRect();
	const panelBox = panel.getBoundingClientRect();
	const edge = 8;
	let top = anchorBox.bottom + offset;
	let left = anchorBox.left;

	if (side === 'top') top = anchorBox.top - panelBox.height - offset;
	if (side === 'left') left = anchorBox.left - panelBox.width - offset;
	if (side === 'right') left = anchorBox.right + offset;
	if (side === 'bottom' || side === 'top') {
		if (align === 'center') left = anchorBox.left + (anchorBox.width - panelBox.width) / 2;
		if (align === 'end') left = anchorBox.right - panelBox.width;
	}
	if (side === 'left' || side === 'right') {
		if (align === 'center') top = anchorBox.top + (anchorBox.height - panelBox.height) / 2;
		if (align === 'end') top = anchorBox.bottom - panelBox.height;
	}

	left = Math.max(edge, Math.min(left, window.innerWidth - panelBox.width - edge));
	top = Math.max(edge, Math.min(top, window.innerHeight - panelBox.height - edge));
	panel.style.left = `${left}px`;
	panel.style.top = `${top}px`;
};

const ensurePanelId = (panel: HTMLElement, prefix: string, index: number) => {
	const existing = panel.id ? document.getElementById(panel.id) : null;
	if (!panel.id || (existing && existing !== panel)) {
		let suffix = index + 1;
		let candidate = `${prefix}-${suffix}`;
		while (document.getElementById(candidate) && document.getElementById(candidate) !== panel) {
			suffix += 1;
			candidate = `${prefix}-${suffix}`;
		}
		panel.id = candidate;
	}
	return panel.id;
};

export function initDialogs() {
	document.querySelectorAll<HTMLElement>('[data-astro-dialog]').forEach((root, index) => {
		if (root.dataset.overlayInitialized) return;
		const layer = root.querySelector<HTMLElement>('[data-dialog-layer]');
		const panel = root.querySelector<HTMLElement>('[data-dialog-panel]');
		const triggerWrap = root.querySelector<HTMLElement>('[data-dialog-trigger]');
		if (!layer || !panel) return;
		root.dataset.overlayInitialized = 'true';
		ensurePanelId(panel, 'astro-dialog', index);
		const trigger = markTrigger(triggerWrap, panel, 'dialog');
		const title = panel.querySelector<HTMLElement>('[data-dialog-title]');
		const description = panel.querySelector<HTMLElement>('[data-dialog-description]');
		if (title) panel.setAttribute('aria-labelledby', title.id || `${panel.id}-title`);
		if (description) panel.setAttribute('aria-describedby', description.id || `${panel.id}-description`);
		let restore: HTMLElement | null = null;

		const close = () => {
			if (layer.hidden) return;
			layer.hidden = true;
			root.dataset.overlayOpen = 'false';
			trigger?.setAttribute('aria-expanded', 'false');
			updateScrollLock();
			restore?.focus();
			restore = null;
		};
		const open = () => {
			restore = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
			layer.hidden = false;
			root.dataset.overlayOpen = 'true';
			trigger?.setAttribute('aria-expanded', 'true');
			updateScrollLock();
			requestAnimationFrame(() => focusFirst(panel));
		};

		triggerWrap?.addEventListener('click', () => {
			if (layer.hidden) open();
		});
		layer.addEventListener('click', (event) => closeByClick(event, '[data-dialog-scrim], [data-dialog-close]', close));
		panel.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
				return;
			}
			keepFocusInside(event, panel);
		});
		if (root.dataset.dialogDefaultOpen === 'true') open();
	});
}

export function initAlertDialogs() {
	document.querySelectorAll<HTMLElement>('[data-astro-alert-dialog]').forEach((root, index) => {
		if (root.dataset.overlayInitialized) return;
		const layer = root.querySelector<HTMLElement>('[data-alert-dialog-layer]');
		const panel = root.querySelector<HTMLElement>('[data-alert-dialog-panel]');
		const triggerWrap = root.querySelector<HTMLElement>('[data-alert-dialog-trigger]');
		if (!layer || !panel) return;
		root.dataset.overlayInitialized = 'true';
		ensurePanelId(panel, 'astro-alert-dialog', index);
		const trigger = markTrigger(triggerWrap, panel, 'alertdialog');
		const title = panel.querySelector<HTMLElement>('[data-alert-dialog-title]');
		const description = panel.querySelector<HTMLElement>('[data-alert-dialog-description]');
		if (title) panel.setAttribute('aria-labelledby', title.id || `${panel.id}-title`);
		if (description) panel.setAttribute('aria-describedby', description.id || `${panel.id}-description`);
		let restore: HTMLElement | null = null;

		const close = () => {
			if (layer.hidden) return;
			layer.hidden = true;
			root.dataset.overlayOpen = 'false';
			trigger?.setAttribute('aria-expanded', 'false');
			updateScrollLock();
			restore?.focus();
			restore = null;
		};
		const open = () => {
			restore = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
			layer.hidden = false;
			root.dataset.overlayOpen = 'true';
			trigger?.setAttribute('aria-expanded', 'true');
			updateScrollLock();
			requestAnimationFrame(() => panel.focus());
		};

		triggerWrap?.addEventListener('click', () => {
			if (layer.hidden) open();
		});
		layer.addEventListener('click', (event) => closeByClick(event, '[data-alert-dialog-cancel], [data-alert-dialog-action]', close));
		panel.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
				return;
			}
			keepFocusInside(event, panel);
		});
		if (root.dataset.alertDialogDefaultOpen === 'true') open();
	});
}

export function initPopovers() {
	document.querySelectorAll<HTMLElement>('[data-astro-popover]').forEach((root, index) => {
		if (root.dataset.overlayInitialized) return;
		const layer = root.querySelector<HTMLElement>('[data-popover-layer]');
		const panel = root.querySelector<HTMLElement>('[data-popover-panel]');
		const triggerWrap = root.querySelector<HTMLElement>('[data-popover-trigger]');
		if (!layer || !panel) return;
		root.dataset.overlayInitialized = 'true';
		ensurePanelId(panel, 'astro-popover', index);
		const trigger = markTrigger(triggerWrap, panel, 'dialog');
		const side = (panel.dataset.side as 'top' | 'right' | 'bottom' | 'left') || 'bottom';
		const align = (panel.dataset.align as 'start' | 'center' | 'end') || 'start';
		const offset = Number(panel.dataset.sideOffset || 6);
		let restore: HTMLElement | null = null;

		const close = () => {
			if (layer.hidden) return;
			layer.hidden = true;
			root.dataset.overlayOpen = 'false';
			trigger?.setAttribute('aria-expanded', 'false');
			updateScrollLock();
			restore?.focus();
			restore = null;
		};
		const open = () => {
			restore = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
			layer.hidden = false;
			root.dataset.overlayOpen = 'true';
			trigger?.setAttribute('aria-expanded', 'true');
			updateScrollLock();
			positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
			requestAnimationFrame(() => {
				positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
				focusFirst(panel);
			});
		};

		triggerWrap?.addEventListener('click', () => {
			if (layer.hidden) open();
			else close();
		});
		layer.addEventListener('click', (event) => closeByClick(event, '[data-popover-close]', close));
		document.addEventListener('pointerdown', (event) => {
			if (!layer.hidden && event.target instanceof Node && !root.contains(event.target)) close();
		});
		panel.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
				return;
			}
			keepFocusInside(event, panel);
		});
		window.addEventListener('resize', () => {
			if (!layer.hidden) positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
		});
		if (root.dataset.popoverDefaultOpen === 'true') open();
	});
}

export function initDropdownMenus() {
	document.querySelectorAll<HTMLElement>('[data-astro-dropdown-menu]').forEach((root, index) => {
		if (root.dataset.overlayInitialized) return;
		const layer = root.querySelector<HTMLElement>('[data-dropdown-layer]');
		const panel = root.querySelector<HTMLElement>('[data-dropdown-panel]');
		const triggerWrap = root.querySelector<HTMLElement>('[data-dropdown-trigger]');
		if (!layer || !panel) return;
		root.dataset.overlayInitialized = 'true';
		ensurePanelId(panel, 'astro-dropdown-menu', index);
		const trigger = markTrigger(triggerWrap, panel, 'menu');
		const side = (panel.dataset.side as 'top' | 'right' | 'bottom' | 'left') || 'bottom';
		const align = (panel.dataset.align as 'start' | 'center' | 'end') || 'start';
		const offset = Number(panel.dataset.sideOffset || 6);
		const items = () => [...panel.querySelectorAll<HTMLButtonElement>('[data-dropdown-item]:not(:disabled)')];
		let restore: HTMLElement | null = null;

		const highlight = (item: HTMLElement | undefined) => {
			panel.querySelectorAll<HTMLElement>('[data-dropdown-item]').forEach((entry) => {
				if (entry === item) entry.dataset.highlighted = '';
				else delete entry.dataset.highlighted;
			});
			item?.focus();
		};
		const close = () => {
			if (layer.hidden) return;
			layer.hidden = true;
			root.dataset.overlayOpen = 'false';
			trigger?.setAttribute('aria-expanded', 'false');
			panel.querySelectorAll<HTMLElement>('[data-dropdown-item]').forEach((entry) => delete entry.dataset.highlighted);
			updateScrollLock();
			restore?.focus();
			restore = null;
		};
		const open = () => {
			restore = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
			layer.hidden = false;
			root.dataset.overlayOpen = 'true';
			trigger?.setAttribute('aria-expanded', 'true');
			updateScrollLock();
			positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
			requestAnimationFrame(() => {
				positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
				highlight(items()[0]);
			});
		};

		triggerWrap?.addEventListener('click', () => {
			if (layer.hidden) open();
			else close();
		});
		triggerWrap?.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				if (layer.hidden) open();
			}
		});
		panel.addEventListener('pointermove', (event) => {
			const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-dropdown-item]') : null;
			if (target && !target.hasAttribute('disabled')) highlight(target);
		});
		panel.addEventListener('click', (event) => {
			const target = event.target instanceof Element ? event.target.closest('[data-dropdown-item]') : null;
			if (target && !target.hasAttribute('disabled')) close();
		});
		panel.addEventListener('keydown', (event) => {
			const choices = items();
			const active = document.activeElement instanceof HTMLElement ? document.activeElement : choices[0];
			const indexOfActive = Math.max(0, choices.indexOf(active as HTMLButtonElement));
			let next: number | undefined;
			if (event.key === 'ArrowDown') next = (indexOfActive + 1) % choices.length;
			if (event.key === 'ArrowUp') next = (indexOfActive - 1 + choices.length) % choices.length;
			if (event.key === 'Home') next = 0;
			if (event.key === 'End') next = choices.length - 1;
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
				return;
			}
			if (next !== undefined && choices[next]) {
				event.preventDefault();
				highlight(choices[next]);
			}
		});
		document.addEventListener('pointerdown', (event) => {
			if (!layer.hidden && event.target instanceof Node && !root.contains(event.target)) close();
		});
		window.addEventListener('resize', () => {
			if (!layer.hidden) positionFloating(panel, trigger ?? triggerWrap ?? root, side, align, offset);
		});
		if (root.dataset.dropdownDefaultOpen === 'true') open();
	});
}

export function initTooltips() {
	document.querySelectorAll<HTMLElement>('[data-astro-tooltip]').forEach((root, index) => {
		if (root.dataset.overlayInitialized) return;
		const triggerWrap = root.querySelector<HTMLElement>('[data-tooltip-trigger]');
		const panel = root.querySelector<HTMLElement>('[data-tooltip-content]');
		if (!triggerWrap || !panel) return;
		root.dataset.overlayInitialized = 'true';
		ensurePanelId(panel, 'astro-tooltip', index);
		const trigger = controls(triggerWrap);
		const side = (panel.dataset.side as 'top' | 'right' | 'bottom' | 'left') || 'top';
		const delay = Number(root.closest<HTMLElement>('[data-astro-tooltip-provider]')?.dataset.tooltipDelay || 300);
		let timer: number | undefined;

		const close = () => {
			if (timer) window.clearTimeout(timer);
			panel.hidden = true;
			root.dataset.tooltipOpen = 'false';
			trigger?.removeAttribute('aria-describedby');
		};
		const open = () => {
			panel.hidden = false;
			root.dataset.tooltipOpen = 'true';
			trigger?.setAttribute('aria-describedby', panel.id);
			positionFloating(panel, trigger ?? triggerWrap, side, 'center', 6);
		};
		const scheduleOpen = () => {
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(open, delay);
		};
		const scheduleClose = () => {
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(close, 80);
		};

		triggerWrap.addEventListener('mouseenter', scheduleOpen);
		triggerWrap.addEventListener('mouseleave', scheduleClose);
		triggerWrap.addEventListener('focusin', scheduleOpen);
		triggerWrap.addEventListener('focusout', (event) => {
			if (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget)) scheduleClose();
		});
		triggerWrap.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') close();
		});
	});
}
