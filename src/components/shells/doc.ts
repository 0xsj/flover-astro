/**
 * Shells — frames a whole screen and owns its landmarks.
 *
 * `AppShell` supplies header, navigation rail, and one main surface. `RailShell`
 * adds a persistent icon rail and a locally toggleable contextual sidebar.
 * `AuthShell` owns the unauthenticated one-column frame, while
 * `SidebarNav`, `NavigationRail`, `RailLink`, and `ContextSidebar` remain
 * independently composable.
 *
 * Astro keeps the structure server-rendered. The only shell interaction is the
 * explicit native disclosure binding for RailShell; route state, navigation
 * data, and authentication remain caller-owned.
 */
export {};
