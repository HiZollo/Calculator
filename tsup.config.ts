import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  minify: true,
  keepNames: false,
  skipNodeModulesBundle: true,
  target: 'es2021',
  esbuildOptions: (options, context) => {
    if (context.format === 'cjs') {
      options.banner = {
        js: '"use strict";',
      };
    }
  },
});