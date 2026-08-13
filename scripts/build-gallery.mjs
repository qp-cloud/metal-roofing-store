// Processes the full Facebook photo pool into the site's gallery assets.
// Source is a one-off local drive (WSL-mounted), not part of the repo, so
// this runs once by hand (`pnpm run gallery`) and commits its output —
// public/gallery/{thumbs,full}/ and src/data/gallery-manifest.json.
import { readdirSync, mkdirSync, realpathSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = '/mnt/f/mnt/e/FacebookPhotos/photos';
const CATEGORIES = ['portrait', 'square', 'landscape'];

const outRoot = fileURLToPath(new URL('../public/gallery/', import.meta.url));
const thumbsDir = path.join(outRoot, 'thumbs');
const fullDir = path.join(outRoot, 'full');
const manifestPath = fileURLToPath(new URL('../src/data/gallery-manifest.json', import.meta.url));

mkdirSync(thumbsDir, { recursive: true });
mkdirSync(fullDir, { recursive: true });

const THUMB_WIDTH = 480;
const FULL_MAX = 1400;

const manifest = [];
let processed = 0;
let skipped = 0;
const startedAt = Date.now();

for (const orientation of CATEGORIES) {
  const dir = path.join(SOURCE_ROOT, orientation);
  const files = readdirSync(dir).filter((f) => /\.jpg$/i.test(f));

  for (const file of files) {
    const id = file.replace(/\.jpg$/i, '').replace(/^facebook_/, '');
    const srcPath = realpathSync(path.join(dir, file));
    const thumbOut = path.join(thumbsDir, `${id}.webp`);
    const fullOut = path.join(fullDir, `${id}.webp`);

    const meta = await sharp(srcPath).metadata();

    if (existsSync(thumbOut) && existsSync(fullOut)) {
      skipped += 1;
    } else {
      await sharp(srcPath)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(thumbOut);

      await sharp(srcPath)
        .resize({ width: FULL_MAX, height: FULL_MAX, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(fullOut);

      processed += 1;
    }

    manifest.push({
      id,
      orientation,
      width: meta.width,
      height: meta.height,
      thumb: `/gallery/thumbs/${id}.webp`,
      full: `/gallery/full/${id}.webp`,
    });

    if ((processed + skipped) % 100 === 0) {
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
      console.log(`  ${processed + skipped}/1295 (${processed} new, ${skipped} cached) — ${elapsed}s`);
    }
  }
}

manifest.sort((a, b) => (a.id > b.id ? 1 : -1));

await import('node:fs/promises').then((fs) =>
  fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2)),
);

console.log(`\nDone: ${manifest.length} entries in manifest (${processed} newly processed, ${skipped} already cached).`);
console.log(`Manifest: ${manifestPath}`);
console.log(`Assets: ${outRoot}`);
