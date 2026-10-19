/**
 * Package-local host build: bundle the tsc-emitted `lib/types/index.js` into
 * the single-file loader artifact `lib/index.js`. The typert face artifacts
 * are emitted separately by `scripts/emit-typert.mjs` (kept out of tsdown so a
 * package-local build never analyzes the whole workspace).
 */
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['lib/types/index.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
})
