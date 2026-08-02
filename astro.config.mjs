// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // OTT-71: `site` was never set, so Astro had no origin to resolve against and
  // the sitemap integration had nothing to emit. Trailing slash is deliberate —
  // it is the base every sitemap entry is built from.
  site: 'https://otta.build/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});