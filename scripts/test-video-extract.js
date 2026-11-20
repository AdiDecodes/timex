const fs = require('fs');

const rawData = fs.readFileSync('scripts/parse-watch-and-choose.js', 'utf8');
const match = rawData.match(/const rawData = `([\s\S]*?)`;/);
const text = match[1];

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

function extractYouTubeId(url) {
  const m = url.match(/(?:shorts\/|v\/|watch\?v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractInstagramShortcode(url) {
  const m = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

const parsedVideos = [];
const issues = [];

lines.forEach((line, index) => {
  const parts = line.split('\t');
  const url = parts[0].trim();
  const catStr = parts.length > 1 ? parts[1].trim() : '';
  if (!url.startsWith('http')) return;

  const categories = catStr.split(',').map(c => c.trim()).filter(Boolean);
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isInstagram = url.includes('instagram.com');

  if (isYouTube) {
    const videoId = extractYouTubeId(url);
    if (!videoId) issues.push({ line, issue: 'Could not extract YouTube ID' });
    parsedVideos.push({
      id: `yt-${index + 1}`,
      order: index + 1,
      platform: 'YouTube',
      videoId,
      url,
      categories,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      // hqdefault.jpg is always guaranteed on YouTube
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      hqThumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });
  } else if (isInstagram) {
    const shortcode = extractInstagramShortcode(url);
    const isReel = url.includes('/reel/');
    if (!shortcode) issues.push({ line, issue: 'Could not extract Instagram shortcode' });
    parsedVideos.push({
      id: `ig-${index + 1}`,
      order: index + 1,
      platform: 'Instagram',
      postType: isReel ? 'Reel' : 'Post',
      shortcode,
      url,
      categories,
      embedUrl: `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${shortcode}/embed/`,
      thumbnail: `/images/instagram/${shortcode}.jpg`
    });
  }
});

console.log('Total parsed videos:', parsedVideos.length);
console.log('Issues found:', issues.length);
if (issues.length > 0) {
  console.log(issues);
}

// Print first 3 YouTube and first 3 Instagram as sample
console.log('\nSample YouTube:');
console.log(parsedVideos.slice(0, 3));

console.log('\nSample Instagram:');
console.log(parsedVideos.filter(v => v.platform === 'Instagram').slice(0, 3));
