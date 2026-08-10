// Lists photo/video slots that have no file yet.  `pnpm run photos`
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { photoCategories } from '../src/data/media.ts';

const roots = {
  photo: { dir: new URL('../src/assets/photos/', import.meta.url), re: /\.(jpe?g|png|webp)$/i },
  video: { dir: new URL('../public/media/', import.meta.url), re: /\.(mp4|webm|mov)$/i },
};

const stems = {};
for (const [kind, { dir, re }] of Object.entries(roots)) {
  const path = fileURLToPath(dir);
  stems[kind] = new Set(
    (existsSync(path) ? readdirSync(path) : [])
      .filter((f) => re.test(f))
      .map((f) => f.replace(/\.[^.]+$/, '')),
  );
}

let missing = 0;
for (const cat of photoCategories) {
  const present = stems[cat.kind];
  console.log(`\n${cat.titleEn}  [${cat.kind}]  -> ${cat.usedOn}`);
  console.log(`  ${cat.briefEn}`);
  for (const slot of cat.slots) {
    const ok = present.has(slot.id);
    if (!ok) missing += 1;
    console.log(`    ${ok ? 'ok     ' : 'MISSING'}  ${slot.id}`);
  }
}

const where = 'photos -> src/assets/photos/   videos -> public/media/';
console.log(`\n${missing} slot(s) still need a file.\n${where}\n`);
