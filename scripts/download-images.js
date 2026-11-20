const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const imagesDir = path.join(__dirname, '../public/images');

// Ensure parent dirs exist
const subdirs = ['banners', 'spaces', 'products'];
subdirs.forEach((dir) => {
  const p = path.join(imagesDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const downloads = [
  {
    url: 'https://www.timexceramic.com/wp-content/uploads/2026/06/Amb14_cmyk.webp',
    dest: path.join(imagesDir, 'banners/hero.webp')
  },
  {
    url: 'https://www.timexceramic.com/wp-content/uploads/2026/06/LUMINA-ROVAN-ROAGE-RIVIA-ROAGE.webp',
    dest: path.join(imagesDir, 'spaces/living-room.webp')
  },
  {
    url: 'https://www.timexceramic.com/wp-content/uploads/2026/03/Combo-Burdeos-240x740-AMB.webp',
    dest: path.join(imagesDir, 'products/moroccan-1-ambience.webp')
  }
];

function downloadImage(item, callback) {
  console.log(`Downloading: ${item.url} -> ${item.dest}`);
  const parsedUrl = new URL(item.url);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.timexceramic.com/'
    }
  };

  client.get(item.url, options, function(response) {
    if (response.statusCode === 301 || response.statusCode === 302) {
      console.log(`Redirecting to: ${response.headers.location}`);
      downloadImage({ url: response.headers.location, dest: item.dest }, callback);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`Failed to download ${item.url}. Status Code: ${response.statusCode}`);
      callback(new Error(`Status Code: ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(item.dest);
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log(`Saved: ${item.dest}`);
      callback(null);
    });
  }).on('error', function(err) {
    console.error(`Error downloading ${item.url}:`, err.message);
    callback(err);
  });
}

function run(index) {
  if (index >= downloads.length) {
    console.log('All downloads completed!');
    return;
  }
  downloadImage(downloads[index], (err) => {
    run(index + 1);
  });
}

run(0);
