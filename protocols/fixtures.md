# Fixtures

> **A memory fixture is a supported server substitute only when it reproduces
> the server's refusals as well as its happy path.**
> Use when a service needs to run before its real endpoint exists. Ends in a
> fixture that teaches callers the real contract rather than hiding it.

**Adopt this when** the transport has a port and more than one adapter. **It
costs you** explicit routes, realistic failures, latency, cancellation, and
request metadata. **Decline it** for a pure function or a test that does not
cross a transport boundary.

## Required behavior

- The fixture implements the same transport port as the network adapter.
- Routes are composed explicitly at the root, not registered by a module import
  side effect.
- Successful responses use the same envelope and are still decoded from
  `unknown`.
- Refusals preserve semantic kinds: unauthenticated, forbidden, not found,
  invalid, conflict, unavailable, and internal are not all empty.
- Latency, abort, request IDs, correlation, and response ordering can be
  exercised where the real service promises them.
- Empty is a valid value when the domain says it is; it is not a disguised
  failure.
- Fixture state is isolated per root or test and does not leak between accounts,
  requests, or recipes.

The fixture should also reproduce uncertainty: a lost write response is not
proof that the write did not commit, and a stale permission answer is not
authorization.

## Honest scope

An empty route table is an honest starting point for a template with no domain.
It should return an explicit unserved-route failure, not fabricate a success.
Count routes that succeed and routes that refuse; zero refusals often means the
fixture is exercising only an unreal happy path.

## Astro boundary

Astro server endpoints and browser islands may use different roots. The
composition root must own that choice, and serialized endpoint data must be
plain data. No page should reach around the port to call a fixture directly.
