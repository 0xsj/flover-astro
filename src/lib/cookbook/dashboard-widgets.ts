import type { DashboardLayout } from '../workspaces/dashboard-grid';

export type DashboardWidget =
	| {
			id: 'requests' | 'latency' | 'capacity';
			kind: 'stat';
			title: string;
			label: string;
			value: string;
			hint: string;
	  }
	| {
			id: 'throughput';
			kind: 'line';
			title: string;
			label: string;
			values: readonly number[];
			labels: readonly string[];
	  }
	| {
			id: 'workload';
			kind: 'bars';
			title: string;
			label: string;
			values: readonly { label: string; value: number }[];
	  }
	| {
			id: 'notes';
			kind: 'note';
			title: string;
			label: string;
			body: string;
	  };

export const DEFAULT_LAYOUT: DashboardLayout = [
	{ id: 'requests', x: 0, y: 0, width: 6, height: 4 },
	{ id: 'latency', x: 6, y: 0, width: 6, height: 4 },
	{ id: 'throughput', x: 0, y: 4, width: 8, height: 7 },
	{ id: 'workload', x: 8, y: 4, width: 4, height: 7 }
];

export const WIDGETS: readonly DashboardWidget[] = [
	{
		id: 'requests',
		kind: 'stat',
		title: 'Requests',
		label: 'This week',
		value: '24,891',
		hint: '+12.4% from last week'
	},
	{
		id: 'latency',
		kind: 'stat',
		title: 'Latency',
		label: 'Median latency',
		value: '128 ms',
		hint: 'Within the 200 ms target'
	},
	{
		id: 'throughput',
		kind: 'line',
		title: 'Throughput',
		label: 'Daily requests',
		values: [2800, 3200, 2900, 4100, 3800, 4300, 3791],
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	},
	{
		id: 'workload',
		kind: 'bars',
		title: 'Workload',
		label: 'Jobs by state',
		values: [
			{ label: 'Done', value: 84 },
			{ label: 'Active', value: 24 },
			{ label: 'Queued', value: 12 }
		]
	},
	{
		id: 'capacity',
		kind: 'stat',
		title: 'Capacity',
		label: 'Current usage',
		value: '38%',
		hint: '62% available'
	},
	{
		id: 'notes',
		kind: 'note',
		title: 'Notes',
		label: 'Team note',
		body: 'Keep an eye on Thursday throughput before the next release window.'
	}
];

export const WIDGET_BY_ID = new Map(WIDGETS.map((widget) => [widget.id, widget]));
