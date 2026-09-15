# Astro auth forms use an explicit endpoint boundary

Astro page files render the auth forms, while `/api/auth/sign-in` and
`/api/auth/sign-up` call the framework-free session service and own the
HttpOnly cookie. The browser receives `{ user }`, never the session token. The
`/sign-out` endpoint clears the cookie and redirects to the public landing
page, which keeps native form submission useful as well as scripted submission.

The `/app` page asks `currentSession` for a request-local presence value and
redirects an absent or expired session to `/sign-in?returnTo=/app`. Return
addresses accept only same-origin path values; protocol-relative and external
URLs fall back to `/app`.
