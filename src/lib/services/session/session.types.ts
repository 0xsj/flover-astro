/** Who somebody is. Passwords and tokens never reach a screen. */
export type User = {
	id: string;
	email: string;
	name: string;
};

/** What successful sign-in and sign-up produce. */
export type Session = {
	token: string;
	user: User;
};

/** One place this account is signed in. Never carries the token. */
export type SessionSummary = {
	id: string;
	/** ISO 8601 timestamp from the wire. */
	createdAt: string;
	/** Whether this is the session making the request. */
	current: boolean;
};

export type Credentials = {
	email: string;
	password: string;
};

export type Registration = {
	name: string;
	email: string;
	password: string;
};

export const MIN_PASSWORD = 8;
