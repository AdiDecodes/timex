const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'server', 'data', 'store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const { WATCH_AND_CHOOSE_VIDEOS } = require('../src/data/watchAndChoose.ts');

if (!Array.isArray(store.videos) || store.videos.length === 0) {
  store.videos = WATCH_AND_CHOOSE_VIDEOS.map(v => ({
    id: v.id,
    order: v.order,
    platform: v.platform,
    post_type: v.postType,
    url: v.url,
    video_id: v.videoId || null,
    shortcode: v.shortcode || null,
    categories: v.categories,
    thumbnail: v.thumbnail,
    hq_thumbnail: v.hqThumbnail || null,
    embed_url: v.embedUrl,
    status: v.status || 'published',
    is_trashed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log(`Initialized store.json with ${store.videos.length} videos`);
} else {
  console.log(`store.json already has ${store.videos.length} videos`);
}
