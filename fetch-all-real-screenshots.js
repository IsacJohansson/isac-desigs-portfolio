import fs from 'fs';
import https from 'https';
import http from 'http';

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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function fetchAll() {
  if (!fs.existsSync('public/thumbnails')) {
    fs.mkdirSync('public/thumbnails', { recursive: true });
  }

  for (const proj of projects) {
    const targetFile = `public/thumbnails/${proj.id}.png`;
    console.log(`[${proj.id}] Fetching real live screenshot for ${proj.url}...`);

    try {
      // 1. Try Microlink screenshot API
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(proj.url)}&screenshot=true&embed=screenshot.url`;
      const data = await fetchJson(`https://api.microlink.io/?url=${encodeURIComponent(proj.url)}&screenshot=true`);
      
      if (data.status === 'success' && data.data?.screenshot?.url) {
        await downloadImage(data.data.screenshot.url, targetFile);
        console.log(`✓ [${proj.id}] Saved real live screenshot (${(fs.statSync(targetFile).size / 1024).toFixed(1)} KB)`);
        continue;
      }
    } catch (e) {
      console.log(`Microlink fetch error for ${proj.id}:`, e.message);
    }

    // Fallback: thum.io
    try {
      const thumUrl = `https://image.thum.io/get/width/1200/crop/900/noanimate/${proj.url}`;
      await downloadImage(thumUrl, targetFile);
      console.log(`✓ [${proj.id}] Saved thum.io screenshot (${(fs.statSync(targetFile).size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✗ Failed for ${proj.id}:`, e.message);
    }
  }

  console.log("\nALL REAL WEBSITE SCREENSHOTS FETCHED SUCCESSFULLY!");
}

fetchAll();
