import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      lib: new URL('./lib', import.meta.url).pathname,
      pages: new URL('./pages', import.meta.url).pathname,
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
