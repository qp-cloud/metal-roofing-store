import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Update this when a custom domain is attached — canonical URLs derive from it.
  site: 'https://metal-roofing-store.vercel.app',

  trailingSlash: 'never',

  integrations: [
    // Kept for server-side rendering of the Phosphor icon components
    // (`@phosphor-icons/react/dist/ssr`). No pages hydrate — there are no
    // `client:*` directives — so the emitted client runtime is unused.
    react(),

    sitemap({
      // Bilingual site: Thai at root, English under /en/. This emits reciprocal
      // <xhtml:link rel="alternate" hreflang> pairs for routes present in both
      // locales, plus x-default -> th.
      i18n: {
        defaultLocale: 'th',
        locales: {
          th: 'th-TH',
          en: 'en-US',
        },
      },
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const u = item.url;
        if (
          u === 'https://metal-roofing-store.vercel.app/' ||
          u === 'https://metal-roofing-store.vercel.app/en'
        ) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        if (u.includes('/promotions')) {
          item.changefreq = 'weekly';
          item.priority = 0.6;
        }
        if (
          u.includes('/products') ||
          u.includes('/colors') ||
          u.includes('/specifications') ||
          u.includes('/services')
        ) {
          item.priority = 0.8;
        }
        if (u.includes('/brochure') || u.includes('/configurator')) {
          item.priority = 0.4;
          item.changefreq = 'yearly';
        }
        if (/\/blog(\/|$)/.test(u)) {
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
