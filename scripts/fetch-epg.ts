import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTonightPayload } from '../server/epgService';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'public', 'data');

async function main() {
  const regions = ['london', 'ni', 'scotland', 'wales', 'northwest', 'yorkshire'];
  await mkdir(outDir, { recursive: true });

  const bundle: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    regions: {},
  };

  for (const region of regions) {
    const payload = await getTonightPayload(region);
    (bundle.regions as Record<string, unknown>)[region] = payload;
    console.log(`Built ${region}: ${payload.rankings.length} ranked shows`);
  }

  await writeFile(join(outDir, 'tonight.json'), JSON.stringify(bundle), 'utf8');
  console.log('Wrote public/data/tonight.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
