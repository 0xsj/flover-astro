/**
 * Chart kernel — pure scales and encodings used by the Astro SVG components.
 *
 * The ordinary chart family keeps exact data beside its picture. Missing line
 * values break a path rather than becoming zero; zero bars remain measured;
 * invalid or absent values are rendered as unavailable. Categorical colors have
 * four fixed identities and never cycle. The graph family adds deterministic
 * layouts, semantic edge channels, hull annotations, and selection without a
 * chart runtime. The sibling Cytoscape CoSE engine is represented by the native
 * seeded force layout so this package remains dependency-free.
 */
export {};
