import {
	responseDecoder,
	responseObject,
	responseText,
	type CallOptions,
	type HttpClient
} from '../../http';
import { err, internal, type Result } from '../../kernel';

type JobBase = { id: string; revision: number; kind: 'import' | 'export' };
export type Job =
	JobBase &
	(
		| { state: 'queued' }
		| { state: 'running'; progress: number | null }
		| { state: 'completed'; summary: string }
		| { state: 'failed'; reason: string }
		| { state: 'canceled' }
	);
export type CancelReceipt = { id: string; accepted: boolean };

export const terminalJob = (job: Job) =>
	job.state === 'completed' || job.state === 'failed' || job.state === 'canceled';

export const decodeJob = responseDecoder('job', (raw): Job | undefined => {
	const value = responseObject(raw);
	if (
		!value ||
		!responseText(value.id) ||
		!Number.isSafeInteger(value.revision) ||
		(value.revision as number) < 1 ||
		(value.kind !== 'import' && value.kind !== 'export')
	)
		return;

	const base: JobBase = {
		id: value.id,
		revision: value.revision as number,
		kind: value.kind
	};
	if (value.state === 'queued' || value.state === 'canceled') return { ...base, state: value.state };
	if (
		value.state === 'running' &&
		(value.progress === null ||
			(typeof value.progress === 'number' &&
				Number.isFinite(value.progress) &&
				value.progress >= 0 &&
				value.progress <= 100))
	)
		return { ...base, state: value.state, progress: value.progress };
	if (value.state === 'completed' && responseText(value.summary))
		return { ...base, state: value.state, summary: value.summary };
	if (value.state === 'failed' && responseText(value.reason))
		return { ...base, state: value.state, reason: value.reason };
});

const decodeCancel = responseDecoder(
	'job cancellation acknowledgment',
	(raw): CancelReceipt | undefined => {
		const value = responseObject(raw);
		return value && responseText(value.id) && typeof value.accepted === 'boolean'
			? { id: value.id, accepted: value.accepted }
			: undefined;
	}
);

function owned<T extends { id: string }>(result: Result<T>, id: string): Result<T> {
	return result.ok && result.value.id !== id
		? err(internal('The response belongs to another job.', { type: 'invalid_response' }))
		: result;
}

export async function readJob(
	client: HttpClient,
	id: string,
	options?: CallOptions
): Promise<Result<Job>> {
	return owned(
		(await client.get<unknown>(`/jobs/${encodeURIComponent(id)}`, options)).andThen((value) =>
			decodeJob(value, options?.trace)
		),
		id
	);
}

export async function cancelJob(
	client: HttpClient,
	id: string,
	options?: CallOptions
): Promise<Result<CancelReceipt>> {
	return owned(
		(
			await client.post<unknown>(`/jobs/${encodeURIComponent(id)}/cancel`, options)
		).andThen((value) => decodeCancel(value, options?.trace)),
		id
	);
}
