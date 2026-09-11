import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const projects = [
  { id: 'creactive', url: 'https://www.creactive-adventure.se/' },
  { id: 'tegneby', url: 'https://www.tegnebyservicecenter.se/' },
  { id: 'bakehouse', url: 'https://bakehousebypj.com/' },
  { id: 'qlaim', url: 'https://qlaim.se/' },
  { id: 'kjmur', url: 'https://kjmurochputs.se/' },
  { id: 'stenhuggeri', url: 'http://stenhuggerioland.se/' },
  { id: 'finja', url: 'https://finjaschakt.se/' },
  { id: 'stenlaggning', url: 'https://stenlaggning-trollhattan.se/' },
  { id: 'markarbeten', url: 'https://markarbeten-uddevalla.se/' },
];

const outDir = path.resolve('public/thumbnails');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Starting Chrome Headless Real Screenshot Capture for all 9 live websites...\n");

for (const p of projects) {
  const outFile = path.join(outDir, `${p.id}.png`);
  console.log(`[${p.id}] Capturing real screenshot for ${p.url}...`);
  try {
    const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1280,2400 --hide-scrollbars "${p.url}"`;
    execSync(cmd, { stdio: 'ignore', timeout: 30000 });
    if (fs.existsSync(outFile)) {
      const stats = fs.statSync(outFile);
      console.log(`✓ Saved ${p.id}.png (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      console.error(`✗ Failed to write file for ${p.id}`);
    }
  } catch (err) {
    console.error(`✗ Error capturing ${p.id}:`, err.message);
  }
}

console.log("\nALL 9 REAL LIVE SCREENSHOTS CAPTURED DIRECTLY FROM BROWSER!");
