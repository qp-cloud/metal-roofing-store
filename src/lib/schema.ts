import { site } from '../data/site';

export const SITE_URL = 'https://metal-roofing-store.vercel.app';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

/** Absolute URL from a site-root path. */
export const abs = (path: string) => new URL(path, SITE_URL).href;

const tel = (href: string) => href.replace('tel:', '');

/**
 * Site-wide business entity. `RoofingContractor` is a Google-recognised
 * LocalBusiness subtype that fits "manufacture + supply + install roofing" and
 * works with province-level `areaServed` while there is still no street address.
 * Add `address` street line, `openingHoursSpecification` and `geo` to
 * `src/data/branches.ts` and wire them here once the business supplies them.
 */
export const organizationNode: Record<string, unknown> = {
  '@type': ['Organization', 'RoofingContractor'],
  '@id': ORG_ID,
  name: site.nameEn,
  alternateName: [site.nameTh, 'Meechai Steel'],
  legalName: site.nameTh,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: abs('/logo.png'),
    contentUrl: abs('/logo.png'),
    width: 512,
    height: 512,
    caption: site.nameEn,
  },
  image: { '@id': LOGO_ID },
  description:
    'Metal roofing and insulated-panel manufacturer and installer in Nong Khai, Thailand. Factory-standard metal roofing sheet, clip-lock and snap-lock systems, wall panels and PU foam insulated panels for houses, factories and cold storage.',
  slogan: site.taglineEn,
  knowsLanguage: ['th', 'en'],
  telephone: tel(site.phones[0].href),
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Nong Khai',
    addressCountry: 'TH',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Nong Khai Province' },
    { '@type': 'AdministrativeArea', name: 'Udon Thani Province' },
    { '@type': 'AdministrativeArea', name: 'Bueng Kan Province' },
    { '@type': 'City', name: 'Vientiane' },
    { '@type': 'Country', name: 'Laos' },
  ],
  sameAs: [site.facebookHref, site.lineHref],
  contactPoint: site.phones.map((p, i) => ({
    '@type': 'ContactPoint',
    telephone: tel(p.href),
    contactType: i === 2 ? 'customer support' : 'sales',
    name: p.labelEn,
    areaServed: i === 0 ? 'TH' : ['TH', 'LA'],
    availableLanguage: ['th', 'en'],
  })),
};

export const websiteNode: Record<string, unknown> = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: site.nameEn,
  alternateName: site.nameTh,
  inLanguage: ['th-TH', 'en'],
  publisher: { '@id': ORG_ID },
};

/** BreadcrumbList from an ordered crumb list. `pageUrl` must be absolute. */
export function breadcrumb(
  crumbs: { name: string; path: string }[],
  pageUrl: string,
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** BlogPosting for a /blog/[slug] page. */
export function blogPosting(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  cover?: string;
}): Record<string, unknown> {
  const url = abs(`/blog/${post.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    inLanguage: 'th-TH',
    datePublished: post.date.toISOString(),
    dateModified: post.date.toISOString(),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: [abs(post.cover ?? '/og-default.jpg')],
  };
}
