/// <reference types="astro/client" />

import type { Presence, TransportFailure } from './lib/kernel';
import type { Root } from './lib/root';
import type { User } from './lib/services/session';

declare global {
	namespace App {
		interface Locals {
			/** Request-local composition root; never module-global request state. */
			root?: Root;
			/** Request-local session lookup shared by pages and endpoint helpers. */
			session?: Promise<Presence<User, TransportFailure>>;
		}
	}
}

export {};
