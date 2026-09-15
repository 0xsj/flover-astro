import type { Bubble, RankedBar, VolcanoPoint } from './statistical-types';
import type { Cell } from './matrix';

export const volcano: readonly VolcanoPoint[] = [
	{ id: 'g0', x: -2.4, y: 3.2, label: 'GENE0' },
	{ id: 'g1', x: -1.6, y: 1.1, label: 'GENE1' },
	{ id: 'g3', x: -1.8, y: 2.7, label: 'GENE3' },
	{ id: 'g5', x: -0.7, y: 2.1, label: 'GENE5' },
	{ id: 'g8', x: 0.3, y: 0.8, label: 'GENE8' },
	{ id: 'g12', x: 1.2, y: 1.8, label: 'GENE12' },
	{ id: 'g17', x: 2.1, y: 3.7, label: 'GENE17' },
	{ id: 'g21', x: 1.6, y: 2.4, label: 'GENE21' },
	{ id: 'g27', x: 0.9, y: 3.1, label: 'GENE27' },
	{ id: 'g44', x: -2.2, y: 2.0, label: 'GENE44' },
	{ id: 'g51', x: 0.1, y: 1.3, label: 'GENE51' },
	{ id: 'g60', x: -1.1, y: 0.4, label: 'GENE60' }
];

export const bubbles: readonly Bubble[] = [
	{ id: 't0', x: 0.7, y: 2.8, weight: 92, category: 'KEGG', label: 'term 0' },
	{ id: 't1', x: 1.5, y: 1.4, weight: 44, category: 'Reactome', label: 'term 1' },
	{ id: 't2', x: 2.7, y: 3.4, weight: 76, category: 'GO', label: 'term 2' },
	{ id: 't3', x: 3.1, y: 0.9, weight: 22, category: 'KEGG', label: 'term 3' },
	{ id: 't4', x: 1.9, y: 2.2, weight: 58, category: 'Reactome', label: 'term 4' },
	{ id: 't5', x: 3.8, y: 1.8, weight: 35, category: 'GO', label: 'term 5' },
	{ id: 't6', x: 0.4, y: 1.1, weight: 14, category: 'KEGG', label: 'term 6' },
	{ id: 't7', x: 2.3, y: 3.8, weight: 68, category: 'GO', label: 'term 7' }
];

export const bars: readonly RankedBar[] = [
	{ id: 'alb', label: 'ALB', value: 148 },
	{ id: 'il6', label: 'IL6', value: 141 },
	{ id: 'tnf', label: 'TNF', value: 139 },
	{ id: 'ins', label: 'INS', value: 132 },
	{ id: 'akt1', label: 'AKT1', value: 128 },
	{ id: 'il1b', label: 'IL1B', value: 121 },
	{ id: 'vegfa', label: 'VEGFA', value: 118 },
	{ id: 'tp53', label: 'TP53', value: 112 }
];

export const ASSETS = ['api.example', 'cdn.example', 'legacy.example', '198.51.100.0/24', 'AS64511', '*.example'];
export const CHECKS = ['TLS expiry', 'open ports', 'subdomains', 'WHOIS', 'headers'];

const states: Record<string, Cell> = {
	'api.example|TLS expiry': { state: 'value', value: 92 },
	'api.example|open ports': { state: 'absent' },
	'api.example|subdomains': { state: 'value', value: 65 },
	'api.example|WHOIS': { state: 'unattempted' },
	'api.example|headers': { state: 'value', value: 88 },
	'cdn.example|TLS expiry': { state: 'value', value: 80 },
	'cdn.example|open ports': { state: 'value', value: 44 },
	'cdn.example|subdomains': { state: 'absent' },
	'cdn.example|WHOIS': { state: 'value', value: 52 },
	'cdn.example|headers': { state: 'value', value: 71 },
	'legacy.example|TLS expiry': { state: 'unattempted' },
	'legacy.example|open ports': { state: 'value', value: 31 },
	'legacy.example|subdomains': { state: 'value', value: 46 },
	'legacy.example|WHOIS': { state: 'absent' },
	'legacy.example|headers': { state: 'unattempted' },
	'198.51.100.0/24|TLS expiry': { state: 'na' },
	'198.51.100.0/24|open ports': { state: 'absent' },
	'198.51.100.0/24|subdomains': { state: 'value', value: 21 },
	'198.51.100.0/24|WHOIS': { state: 'value', value: 63 },
	'198.51.100.0/24|headers': { state: 'value', value: 38 },
	'AS64511|TLS expiry': { state: 'na' },
	'AS64511|open ports': { state: 'value', value: 57 },
	'AS64511|subdomains': { state: 'absent' },
	'AS64511|WHOIS': { state: 'value', value: 73 },
	'AS64511|headers': { state: 'na' },
	'*.example|TLS expiry': { state: 'value', value: 96 },
	'*.example|open ports': { state: 'unattempted' },
	'*.example|subdomains': { state: 'value', value: 84 },
	'*.example|WHOIS': { state: 'unattempted' },
	'*.example|headers': { state: 'value', value: 90 }
};

export const cell = (row: string, column: string): Cell => states[`${row}|${column}`] ?? { state: 'unattempted' };
