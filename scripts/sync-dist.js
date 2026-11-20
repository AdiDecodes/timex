const fs = require('fs');
const path = require('path');

const distHtmlPath = path.resolve(__dirname, '../dist/index.html');
const chunkPath = path.resolve(__dirname, '../dist/_next/static/chunks/app/(site)/page-e1a74fd05e28feb8.js');

let html = fs.readFileSync(distHtmlPath, 'utf8');

// ============================================================================
// 1. Video Talk Section Updates (Requests 1 & 2)
// ============================================================================
// 1.1 Change 4-column row to 2-column x 2-row grid
html = html.replace(
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 items-stretch',
  'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch'
);

// 1.2 Remove the black caption strip and quotes beneath video thumbnails
const captionRegex = /<div class="absolute bottom-0 inset-x-0 bg-black\/80 backdrop-blur-xs px-3 py-1\.5 z-10"><p class="font-serif italic text-\[11px\] sm:text-xs text-white\/95 truncate">“<!-- -->[\s\S]*?<!-- -->”<\/p><\/div>/g;
html = html.replace(captionRegex, '');

// 1.3 Make thumbnail container clean aspect-video
html = html.replaceAll(
  'aspect-[16/10] w-full overflow-hidden bg-black/90',
  'aspect-video w-full overflow-hidden bg-[#FCFBF8]'
);

// ============================================================================
// 2. Inspiration Section Updates (Requests 3 & 4)
// ============================================================================
// 2.1 Remove eyebrow text
const eyebrowHtml = '<div class="jsx-4869495ddb9ca42c flex items-center space-x-3"><span class="jsx-4869495ddb9ca42c text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">TILE INSPIRATION | DESIGN IDEAS &amp; TRENDS</span><span class="jsx-4869495ddb9ca42c w-8 h-[1.5px] bg-[#C95745]"></span></div>';
html = html.replace(eyebrowHtml, '');

// 2.2 Update main heading
const oldHeading = '<h2 class="jsx-4869495ddb9ca42c font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15]">Tile Design Ideas, Trends &amp;<!-- --> <span class="jsx-4869495ddb9ca42c text-[#C95745] italic">Inspiration</span><span class="jsx-4869495ddb9ca42c text-[#C95745]">.</span></h2>';
const newHeading = '<h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15]">Transform Your Space with the Power of Design</h2>';
html = html.replace(oldHeading, newHeading);

const oldDescRegex = /Get inspired by premium imported tiles, designer wall and floor tiles, ceramic and porcelain tiles through expert videos[\s\S]*?hospitality projects\./;
const newDesc = `Your space is more than just walls and floors-it’s a reflection of your personality, taste, and lifestyle. From kitchens to living rooms, and bathrooms to outdoor spaces, our designs are crafted to elevate every corner of your home. Let these inspiring images spark your creativity and help you envision the perfect space. Whether you dream of a minimalist retreat or a bold and vibrant setting, your transformation is just a tile away. Explore, imagine, and create a home that truly reflects you with <a href="https://www.timexceramic.com/about-us/" class="underline underline-offset-2 hover:text-[#C95745] font-medium transition-colors">Timex Ceramic</a>.`;
html = html.replace(oldDescRegex, newDesc);

// 2.4 Update inspiration images with the 8 requested images
const inspImages = [
  { id: "insp-1", src: "/uploads/products/1002-2.webp", alt: "Timex Ceramic Tile 1002-2" },
  { id: "insp-2", src: "/uploads/products/5109-insparation-3.webp", alt: "Timex Ceramic Tile 5109-3" },
  { id: "insp-3", src: "/uploads/products/gm91-insparation-1.webp", alt: "Timex Ceramic Tile GM91-1" },
  { id: "insp-4", src: "/uploads/products/allowy-insparation-1.webp", alt: "Timex Ceramic Tile Allowy-1" },
  { id: "insp-5", src: "/uploads/products/zelij-insparation.webp", alt: "Timex Ceramic Tile Zelij" },
  { id: "insp-6", src: "/uploads/products/wood-story-insparation.webp", alt: "Timex Ceramic Tile Wood Story" },
  { id: "insp-7", src: "/uploads/products/6016-insparation.webp", alt: "Timex Ceramic Tile 6016" },
  { id: "insp-8", src: "/uploads/products/6014-instaration.webp", alt: "Timex Ceramic Tile 6014" },
];

const col1 = [inspImages[0], inspImages[2], inspImages[4], inspImages[6]];
const col2 = [inspImages[1], inspImages[3], inspImages[5], inspImages[7]];
const col1Items = [...col1, ...col1];
const col2Items = [...col2, ...col2];

const renderCol = (items, animClass) => `
<div class="overflow-hidden relative h-full">
  <div class="flex flex-col gap-3 sm:gap-4 md:gap-6 ${animClass}">
    ${items.map((item, idx) => `
      <div key="col-${item.id}-${idx}" class="group/card relative aspect-[3/4] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#DED9D0] shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0">
        <img alt="${item.alt}" loading="lazy" decoding="async" class="object-cover w-full h-full transition-transform duration-700 group-hover/card:scale-105" src="${item.src}" />
      </div>
    `).join('')}
  </div>
</div>
`;

const newGalleryHtml = `
<div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full">
  ${renderCol(col1Items, 'animate-marquee-up')}
  ${renderCol(col2Items, 'animate-marquee-down')}
</div>
`;

// Replace right side gallery in HTML
const galleryContainerRegex = /<div class="jsx-4869495ddb9ca42c grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
const galleryReplacement = `${newGalleryHtml}</div></div></div></div></section>`;
if (galleryContainerRegex.test(html)) {
  html = html.replace(galleryContainerRegex, galleryReplacement);
}

// ============================================================================
// 2.5 Latest Collections Section Updates
// ============================================================================
// Update NEW tag to plain text #101b38 (no background, no border, no shadow)
html = html.replaceAll(
  'text-[#C95745] bg-[#FCFBF8]/95 px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
  'text-[#101b38] bg-transparent uppercase font-sans'
);
html = html.replaceAll(
  'text-[#C95745] bg-transparent px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
  'text-[#101b38] bg-transparent uppercase font-sans'
);
html = html.replaceAll(
  'text-[#C95745] bg-[#101b38] px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
  'text-[#101b38] bg-transparent uppercase font-sans'
);

// ============================================================================
// 2.6 A Legacy of Design & Trust Section Image
// ============================================================================
html = html.replaceAll(
  '/images/spaces/outdoor.png',
  '/uploads/products/Luxury-Pool-Terrace-at-Sunset.webp'
);

// ============================================================================
// 2.7 EXPLORE BY COLLECTION Section Gradient Overlay Updates
// ============================================================================
const exploreColStart = html.indexOf('EXPLORE BY COLLECTION');
if (exploreColStart !== -1) {
  const exploreColEnd = html.indexOf('</section>', exploreColStart);
  let exploreColHtml = html.substring(exploreColStart, exploreColEnd);
  exploreColHtml = exploreColHtml.replaceAll(
    'bg-gradient-to-t from-[#101B38]/90 via-[#101B38]/30 to-transparent',
    'bg-gradient-to-t from-black/90 to-transparent'
  );
  html = html.substring(0, exploreColStart) + exploreColHtml + html.substring(exploreColEnd);
}

fs.writeFileSync(distHtmlPath, html, 'utf8');
console.log('✓ dist/index.html updated successfully');
console.log('  - Has new heading:', html.includes('Transform Your Space with the Power of Design'));
console.log('  - Has about-us link:', html.includes('https://www.timexceramic.com/about-us/'));
console.log('  - Has 2x2 grid:', html.includes('grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch'));
console.log('  - Has quote caption strip:', html.includes('Good design always stays relevant'));
console.log('  - Has old eyebrow:', html.includes('TILE INSPIRATION | DESIGN IDEAS'));
console.log('  - Has Modular in featured:', html.includes('/product-category/modular'));
console.log('  - Has ASCOT image:', html.includes('ASCOT_BLANCO'));

// ============================================================================
// 3. Client JS Bundle Updates (Hydration consistency)
// ============================================================================
if (fs.existsSync(chunkPath)) {
  let js = fs.readFileSync(chunkPath, 'utf8');

  // Replace 4-col with 2-col in client chunk
  js = js.replaceAll(
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6',
    'grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'
  );

  // Remove quote strips from client chunk
  js = js.replace(/<div className="absolute bottom-0 inset-x-0 bg-black\/80[\s\S]*?<\/div>/g, '');

  // Update aspect-[16/10] bg-black/90 to aspect-video
  js = js.replaceAll(
    'aspect-[16/10] w-full overflow-hidden bg-black/90',
    'aspect-video w-full overflow-hidden bg-[#FCFBF8]'
  );

  // Update heading and eyebrow in client chunk
  js = js.replace('TILE INSPIRATION | DESIGN IDEAS & TRENDS', '');
  js = js.replace('Tile Design Ideas, Trends &', 'Transform Your Space with the Power of Design');

  // Make NEW tag plain text #101b38 in client chunk
  js = js.replaceAll(
    'text-[#C95745] bg-[#FCFBF8]/95 px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
    'text-[#101b38] bg-transparent uppercase font-sans'
  );
  js = js.replaceAll(
    'text-[#C95745] bg-transparent px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
    'text-[#101b38] bg-transparent uppercase font-sans'
  );
  js = js.replaceAll(
    'text-[#C95745] bg-[#101b38] px-2.5 py-0.5 rounded-[2px] shadow-xs border border-[#C95745]/30 uppercase font-sans',
    'text-[#101b38] bg-transparent uppercase font-sans'
  );

  // Update Trust section image in client chunk
  js = js.replaceAll(
    '/images/spaces/outdoor.png',
    '/uploads/products/Luxury-Pool-Terrace-at-Sunset.webp'
  );

  // Update EXPLORE BY COLLECTION gradient overlay in client chunk
  js = js.replace(
    'from-[#101B38]/90 via-[#101B38]/30 to-transparent transition-opacity duration-300 opacity-85',
    'from-black/90 to-transparent transition-opacity duration-300 opacity-85'
  );

  fs.writeFileSync(chunkPath, js, 'utf8');
  console.log('✓ Client chunk updated successfully');
}

