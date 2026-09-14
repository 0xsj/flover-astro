/** Local return address contract: parse an unknown input as a same-origin
 * rooted URL. Reject external/protocol-relative URLs, backslashes, control
 * characters, malformed path escapes and decoded path traversal or separators.
 * Preserve query and fragment; fall back to /app on refusal. The application
 * separately allowlists destinations and removes framework-only query keys.
 */
export {};
