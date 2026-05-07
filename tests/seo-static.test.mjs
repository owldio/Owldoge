import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const seo = readFileSync(join(root, "src/lib/seo.ts"), "utf8");
const layout = readFileSync(join(root, "src/app/layout.tsx"), "utf8");

assert.match(
  seo,
  /const ogImage = "\/seo\/owldio-music-production\.png"/,
  "default OG image should use the approved music production poster"
);

assert.match(
  seo,
  /專業音樂會錄影、錄音、直播與後製服務/,
  "site description should include the primary Chinese SEO phrase"
);

assert.match(
  layout,
  /image: `\$\{siteUrl\}\/seo\/owldio-music-production\.png`/,
  "structured data image should match the default OG poster"
);

assert.match(
  layout,
  /"hasOfferCatalog"/,
  "structured data should describe the service catalog"
);
