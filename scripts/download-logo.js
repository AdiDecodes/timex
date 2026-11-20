const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const dest = path.join(__dirname, '../public/logo.png');

const urls = [
  'https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png',
  'https://www.timexceramic.com/wp-content/uploads/2022/01/ceramic_logo.png'
];

function download(index) {
  if (index >= urls.length) {
    console.error('All logo URLs failed.');
    return;
  }

  const urlStr = urls[index];
  console.log(`Attempting to download logo from: ${urlStr}`);
  const parsedUrl = new URL(urlStr);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.timexceramic.com/',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  };

  client.get(urlStr, options, function(response) {
    if (response.statusCode === 301 || response.statusCode === 302) {
      console.log(`Redirecting to: ${response.headers.location}`);
      // If it redirects to homepage, treat as failure and try next URL
      if (response.headers.location === 'https://www.timexceramic.com' || response.headers.location === 'https://www.timexceramic.com/') {
        console.warn('Redirected to homepage. Trying next logo URL...');
        download(index + 1);
        return;
      }
      download(response.headers.location);
      return;
    }

    const contentType = response.headers['content-type'] || '';
    if (response.statusCode !== 200 || !contentType.startsWith('image/')) {
      console.warn(`URL failed. Status: ${response.statusCode}, Content-Type: ${contentType}. Trying next logo URL...`);
      download(index + 1);
      return;
    }

    const file = fs.createWriteStream(dest);
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('Logo downloaded successfully!');
    });
  }).on('error', function(err) {
    console.error(`Error downloading from ${urlStr}:`, err.message);
    download(index + 1);
  });
}

download(0);
