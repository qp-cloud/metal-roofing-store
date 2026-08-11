/**
 * The 3D configurator is deployed as a separate app so it can carry React and
 * Three.js without pulling either into this static site.
 *
 * Change this one value when a custom domain is attached — and add the new
 * origin to ALLOWED_EMBEDDERS in the configurator's next.config.ts at the same
 * time, or the embed silently renders blank.
 */
export const configuratorUrl = 'https://roofing-configurator.vercel.app/configurator';

/** Deep-links straight into a starting configuration. */
export function configuratorLink(params?: Record<string, string | number>): string {
  if (!params) return configuratorUrl;
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  return `${configuratorUrl}?${qs}`;
}
