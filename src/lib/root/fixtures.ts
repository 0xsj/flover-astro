import type { MemoryRoute } from '../http';
import { ledgerRoutes } from '../services/ledger';
import { sessionRoutes } from '../services/session';

/* The route table the in-memory adapter serves. Routes are composed here so
 * service modules do not register themselves through import side effects. */
export const routes: MemoryRoute[] = [...sessionRoutes, ...ledgerRoutes];
