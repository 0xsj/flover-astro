/**
 * Live updates are an observation channel, not an authority. A connection
 * state can be open, reconnecting, or closed independently of the last good
 * value. Reconnection resynchronizes declared reads because notifications can
 * be missed while a socket is down.
 */
export {};
