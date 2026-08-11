// Fetches the Page's own posts into src/data/facebook-posts.json.  `pnpm run facebook`
//
// Needs a Page Access Token with pages_read_engagement:
//   FB_PAGE_ACCESS_TOKEN=... pnpm run facebook
//
// The token is read from the environment only — never pass it as an argument
// (argv is visible to other processes) and never commit it.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.ts';

const token = process.env.FB_PAGE_ACCESS_TOKEN;
if (!token) {
  console.error(
    'FB_PAGE_ACCESS_TOKEN is not set.\n' +
      'Create a Page Access Token (pages_read_engagement) at developers.facebook.com,\n' +
      'then copy .env.example to .env and put the token there — .env is gitignored,\n' +
      'which keeps the token out of your shell history.',
  );
  process.exit(1);
}

// Graph versions are retired roughly every two years. Override when Meta
// moves on; the dashboard shows which version your app is calling.
const version = process.env.FB_GRAPH_VERSION ?? 'v23.0';

// Single source of truth is site.ts — the numeric id lives in the Page URL.
const pageId = process.env.FB_PAGE_ID ?? site.facebookHref.match(/[?&]id=(\d+)/)?.[1];
if (!pageId) {
  console.error(
    `Could not read a Page id from site.facebookHref (${site.facebookHref}).\n` +
      'Set FB_PAGE_ID explicitly, or use a profile.php?id=... URL in src/data/site.ts.',
  );
  process.exit(1);
}

const maxPosts = Number(process.env.FB_POST_LIMIT ?? 50);
const fields = 'id,message,created_time,permalink_url,full_picture';

const out = fileURLToPath(new URL('../src/data/facebook-posts.json', import.meta.url));

/** Graph paginates with an opaque `paging.next` URL; follow it until we have enough. */
async function fetchPosts() {
  let url =
    `https://graph.facebook.com/${version}/${pageId}/posts?fields=${fields}&limit=25`;
  const posts = [];

  while (url && posts.length < maxPosts) {
    // Bearer header rather than an access_token query param, so the token never
    // lands in an error message or anything that logs a URL.
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const body = await res.json();

    if (!res.ok) {
      // Graph puts the useful part in error.message; surface it verbatim.
      const err = body?.error ?? {};
      throw new Error(
        `Graph API ${res.status}: ${err.message ?? 'unknown error'}` +
          (err.code ? ` (code ${err.code})` : ''),
      );
    }

    posts.push(...(body.data ?? []));

    // paging.next embeds the token as a query param; drop it and keep using the header.
    if (body.paging?.next) {
      const next = new URL(body.paging.next);
      next.searchParams.delete('access_token');
      url = next.toString();
    } else {
      url = null;
    }
  }

  return posts.slice(0, maxPosts);
}

let raw;
try {
  raw = await fetchPosts();
} catch (err) {
  // Expected failures here are a bad/expired token, a retired Graph version, or a
  // missing permission — all actionable, none worth a stack trace.
  console.error(`${err.message}\n\nCheck the token, its pages_read_engagement permission, and FB_GRAPH_VERSION (currently ${version}).`);
  process.exit(1);
}

const posts = raw
  // Photo-only posts carry no message; they have nothing to show as text.
  .filter((p) => p.message?.trim())
  .map((p) => ({
    id: p.id,
    message: p.message.trim(),
    createdTime: p.created_time,
    permalink: p.permalink_url ?? null,
    image: p.full_picture ?? null,
  }))
  // Newest first. Graph already returns this order, but sorting here means the
  // JSON is authoritative and the site never depends on API ordering.
  .sort((a, b) => Date.parse(b.createdTime) - Date.parse(a.createdTime));

writeFileSync(out, `${JSON.stringify(posts, null, 2)}\n`);

const newest = posts[0]?.createdTime ?? 'n/a';
console.log(
  `${posts.length} post(s) with text written to src/data/facebook-posts.json` +
    `\n  graph ${version}  page ${pageId}  newest ${newest}` +
    `\n  ${raw.length - posts.length} post(s) skipped (no message text)`,
);
