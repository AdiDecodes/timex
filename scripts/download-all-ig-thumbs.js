const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync('scripts/parse-watch-and-choose.js', 'utf8');
const match = rawData.match(/const rawData = `([\s\S]*?)`;/);
const text = match[1];

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

function extractInstagramShortcode(url) {
  const m = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

const igEntries = [];
lines.forEach((line) => {
  const parts = line.split('\t');
  const url = parts[0].trim();
  if (url.includes('instagram.com')) {
    const shortcode = extractInstagramShortcode(url);
    if (shortcode) {
      igEntries.push({ url, shortcode });
    }
  }
});

console.log(`Found ${igEntries.length} Instagram entries to process`);

const targetDir = path.join(__dirname, '..', 'public', 'images', 'instagram');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadThumbnail(shortcode) {
  const filePath = path.join(targetDir, `${shortcode}.jpg`);
  if (fs.existsSync(filePath)) {
    console.log(`[EXISTS] ${shortcode}.jpg`);
    return true;
  }

  const urls = [
    `https://www.instagram.com/p/${shortcode}/media/?size=l`,
    `https://www.instagram.com/reel/${shortcode}/media/?size=l`
  ];

  for (const mediaUrl of urls) {
    try {
      const res = await fetch(mediaUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        },
        redirect: 'follow'
      });

      if (res.ok && res.headers.get('content-type')?.includes('image')) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length > 1000) {
          fs.writeFileSync(filePath, buffer);
          console.log(`[SAVED] ${shortcode}.jpg (${buffer.length} bytes)`);
          return true;
        }
      }
    } catch (e) {
      // try next
    }
  }

  console.log(`[SKIPPED/UNAVAILABLE] ${shortcode}`);
  return false;
}

async function run() {
  let saved = 0;
  for (const item of igEntries) {
    const ok = await downloadThumbnail(item.shortcode);
    if (ok) saved++;
    // Polite delay
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`Done! ${saved}/${igEntries.length} thumbnails present in ${targetDir}`);
}

run();
