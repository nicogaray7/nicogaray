import countries110m from 'world-atlas/countries-110m.json'

/** TopoJSON embarqué : évite fetch(cdn) bloqué (CSP, réseau, extensions). */
export const countries110mTopology = countries110m
