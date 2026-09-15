export type ChartTone = 'accent' | 'info' | 'warn' | 'neutral';
export type ChartLine = 'solid' | 'dashed' | 'dotted';
export type ChartSeries = {
	key: string;
	label: string;
	tone?: ChartTone;
	line?: ChartLine;
};
