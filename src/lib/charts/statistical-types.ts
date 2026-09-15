export type VolcanoPoint = {
	id: string;
	x: number;
	y: number;
	label?: string;
};

export type Bubble = {
	id: string;
	x: number;
	y: number;
	weight: number;
	category?: string;
	label?: string;
};

export type RankedBar = {
	id: string;
	label: string;
	value: number;
};
