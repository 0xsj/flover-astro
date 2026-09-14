/**
 * Item workflow contract
 * ======================
 * Drafts are visit-local and never silently promoted to accepted data. Every
 * save carries an operation id and expected revision; a receipt proves the
 * exact operation and the next item revision. The backend deduplicates a
 * repeated operation id, rejects stale revisions, and reports conflicts as
 * conflicts rather than as generic failures.
 *
 * A lost response leaves the outcome unknown. The caller keeps the attempt and
 * reconciles its receipt before issuing a fresh write. Reset explicitly clears
 * both accepted data and drafts. The example fixture exposes an explicit
 * advance operation so a stale edit can be reproduced without wall-clock
 * races. Written before implementation; tests are ordinary implementation-
 * visible.
 */
export {};
