/**
 * Fixture routes are composed explicitly by the root. Their contract is the
 * same as the real transport: successful values and meaningful refusals both
 * travel through `HttpClient`. An unregistered route is a missing fixture, not
 * a simulated domain 404; a route must return `not_found` when it wants to
 * exercise legitimate server absence.
 */
export {};
