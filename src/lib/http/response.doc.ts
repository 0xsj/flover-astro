/**
 * Successful response contracts are written at the decoder boundary.
 *
 * A transport generic does not validate JSON. Services request `unknown`, then
 * use response readers to validate and project DTOs. `undefined` rejects a
 * response; `null` is valid only when a reader explicitly allows it. Reader
 * exceptions become `internal` / `invalid_response` without leaking payloads
 * or exception text.
 *
 * Object readers reject null and arrays, array readers validate every item,
 * preserve order, accept empty arrays, and reject sparse arrays. Unknown wire
 * fields are tolerated but are not copied into domain values.
 */
export {};
