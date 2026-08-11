import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  // Update this when a custom domain is attached — canonical URLs derive from it.
  site: 'https://metal-roofing-store.vercel.app',

  trailingSlash: 'never',
  integrations: [react()],
});