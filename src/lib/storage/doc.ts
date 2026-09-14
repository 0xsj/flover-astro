/**
 * Storage — validated, versioned browser documents behind a string-storage port.
 *
 * CONTRACT (written before implementation)
 * A registered document owns its key, version, and decoder from unknown.
 * read returns Result<missing | found<T>>. Missing is a successful observation;
 * blocked storage, corrupt JSON, invalid data, and unsupported versions are not
 * defaults. A read never writes, removes, or repairs the saved document.
 * Optional migrations decode older versions in memory; saving is explicit.
 * Writes validate the JSON round trip before committing. Failed writes leave
 * the old value intact and are observable Results. A newer envelope is
 * protected from an older writer; removing this particular key is the explicit
 * reset. Keys are namespaced; there is no origin-wide clear operation.
 *
 * LIMITS
 * This is synchronous, best-effort browser persistence, not a database. It has
 * no atomic read-modify-write, locking, encryption, or server durability.
 * Separate tabs use last-writer-wins; the read-before-write version guard is not
 * a lock. Decoder code is caller-owned; exceptions become invalid data.
 *
 * VERIFICATION
 * Ordinary contract tests have implementation access. This pass is not a blind
 * spec-test run and makes no mutation-score claim.
 */
export {};
