const fs = require('fs');

const rawData = `
https://www.youtube.com/shorts/snFVohurL0E	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/lE4OLTwlCeg	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/8q0ikBFD64c	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/uJD3N5id5j0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/ouWCcKUBxDU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/1RmMjpSwx8Q	DESIGN TIPS, PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/vT0Hk4CerF8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/OeGf8Epb_HU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/b05jui30UPs	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/jPQcSyGunpo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/JUfXZTLoBnQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/8jIpfe2Gkiw	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/eQAvoVF4zXs	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/7-zrKlueQxI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/O1QLB3H4i30	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/XLZiN10M9ts	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/sB03mdLIWjk	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/bjO9KxEcrFo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/4AzD7IAcHLs	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/qEcNrVlQO58	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/mcSchQTG3wM	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/dsDnmxcigE0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/2JDXvqivTyI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/aHcF16UOE94	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/7sR46bVTIlI	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/wdPuhX3X3CY	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/JrPAi2OylZk	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/zq6IIH0d3CE	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/FRqlFy7owBY	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/bYuOgIdtfKY	PRODUCT HIGHLIGHTS, DESIGN TIPS, TRENDS
https://www.youtube.com/shorts/M8Uog0RpgLo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/CtxoLDM9UzI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/-KbLoo0SRHQ	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/8HzBA-qiOyU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/q0lbn8VV7lM	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/4wc_RvcSf_s	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/LCBgCqpapvA	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/4WMH7VpYY_w	PRODUCT HIGHLIGHTS, BEHIND THE SCENES
https://www.youtube.com/shorts/MqffmPySHVc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/GUaMGFDeF44	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/8zr9m0zzX30	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/a1W-tIDvi-k	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/hp7Yag2Vm_w	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/l1a3t5jKh_s	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/K2YGIuZBYO0	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/VX4MJV1uGQ4	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/sr88MeEtazk	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/VLC_Ehkeyps	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/VnKFiFwVO8w	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/jDuj5nJ6cvw	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/UqB3AzERXdU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/WiLpeqnLK_A	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/8NxcHm_mAD8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/0BKA4WGmHBI	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/EkQyvVbb7s8	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/-iATP4xrT4k	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/wOoFRAfnX04	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/zebC0QSFhCY	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/NduN-XXu8Eo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/g409pnwt-_g	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/NG14_VZ-heU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/K9e9skUhgj0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/dIkV98nArLI	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/vNFbZwoVy7A	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/3-aoS0IqtWc	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/Izmp3d5KIb4	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Apgy1n0u2CY	DESIGN TIPS
https://www.youtube.com/shorts/4VnjeKPBZvA	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/VE8phrgKv0A	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/9cxDFu7c7Zc	PRODUCT HIGHLIGHTS, DESIGN TIPS, TRENDS
https://www.youtube.com/shorts/ZwXLXrfKWjw	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/JZ965vmBPeo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Aa4FtmZmhOU	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/-DJ9wjjYeyQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/JYeRBSMPOTE	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/xVkDOPJJ_nk	PRODUCT HIGHLIGHTS, TRENDS, DESIGN TIPS
https://www.youtube.com/shorts/YMlPLkNt6GI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/c86dneDAroM	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/ag0AMNCtGho	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Yn2getqH4pk	PRODUCT HIGHLIGHTS, TRENDS, DESIGN TIPS
https://www.youtube.com/shorts/_S5qIFmQQFU	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/1n3HzgjA-Vk	DESIGN TIPS
https://www.youtube.com/shorts/e2F80erTNqI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/6h4ERcExWAY	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/dDXtei73MR4	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/C5KFbyRx1Dc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/8TL1BmjQ1nQ	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/4Pez7LZVgBY	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/_yObqS6yrYY	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/NI5rjj697cI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/XlgmipLAiW4	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/ESKWY-lyfNI	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/iR5pZ7EUC84	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/V6r6t6rWR4U	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/CYszQOBOU2s	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/5lEos1CVRPk	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/UfCtK1qUD_k	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/FqGAfJ7AOgY	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/d4VNckIySnk	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/m4Zk8pVsCC4	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/uv0fTNHakD4	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/AjSx34j5W1I	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/f-KGATRxlDI	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/ekHJ8ew0t-o	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Am_oRYDgExQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/4FGWuePNIwc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/-vNdgiDlBg8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/oFENBPlQj6o	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/U2k9HkirPiI	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/dKLnLEQSTaQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/qDd0xO-IC1o	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/9-hnnFUIDvY	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/E2NEra1U5Qc	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/14OUL6gxq1M	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/dCUeYvvBY4E	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/67m42pNKTN0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/nAMYjWKKgt8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/VYyheMI-yTQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Wm6ka0tbEeU	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/M40xYZHD6-g	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/r5zixlTWEGA	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/4E3_dPVGgA0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/M0FoExS-wEQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/ZvKcgeweLFI	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/OQemaQe4hgo	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/4boE7pwE4Pc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/4SzrDIKx3Ic	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/HgOhE0vKTtM	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/429GsMgKdmc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/IdUpxhH-ew8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/OI2V777t_0o	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Fi8ATdw-H54	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/IFs_TBkR0hc	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/4u1rsdQMwaY	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/0M7-MGiAv48	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/n74R_jyU3vQ	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/BiHryBm15Yk	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/GiYNt5pemKs	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/sZllvBbOQbg	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/C0x-RJeO8hE	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/1Niqp8fy6kc	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Lx_zxFGfdgo	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/qLrMgCs4jIo	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/Q9k3AXWkpVo	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/l7EMhPFdfbw	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/n3OXsCfGnt0	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/Y8rpcclfySE	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/TMNfNad4KmI	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/cprAlhfGVz0	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/nQMC6v12D_M	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/tsJVCXiixWM	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/XBlSGde5KUs	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.youtube.com/shorts/_6h2LqUbb8s	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/uzH4tsllW5o	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/xiJ4RQd5lY8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/31NQTxk2XJ8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/cHF53VEr6h8	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/QrhDnH9orvw	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/KHKS1vYIYsM	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/0ARf2h-3Jh4	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/9d5Lr-Peitw	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/qjiMq9xAq8M	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/XgV_PeKfI64	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/gsizxAK4uOY	PRODUCT HIGHLIGHTS, REAL SPACES
https://www.youtube.com/shorts/RQ-DP40A8ZU	PRODUCT HIGHLIGHTS
https://www.youtube.com/shorts/YfE4GAEYHgo	PRODUCT HIGHLIGHTS, TRENDS
https://www.youtube.com/shorts/w_P455f8l2E	PRODUCT HIGHLIGHTS
	
https://www.instagram.com/p/DaVstXnxj_f/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/p/Dd4IiYBi1dz/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/p/DUQoBxeEmxN/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/p/DfPyF48ynxI/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DfKlRN9SDJO/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DfFP3igSy4F/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DfC4E6Qy92Q/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/De9sR6skjqu/?img_index=1	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/Dew0VpJyIe6/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DernwKESx31/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/p/DepC2zRyBW3/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/p/DemeEtPyF3C/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/Dej80cbyVh6/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/p/Dee3EFMSOKR/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DecQY-wykfC/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DeZp_kMSJQp/	PRODUCT HIGHLIGHTS
https://www.instagram.com/p/DeMw3N1S8hz/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/p/DeHl7S0C9DN/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/reel/Dd9SfUby5TW/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/Dd1ldy3irHG/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/Ddt02kjCb6Z/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/DdotOaQiWhP/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/DdZTPMDSe6E/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DdJ6xc9yHf7/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/reel/DdEnFNOSuPR/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/Dc_cXXpyw_C/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DctedK8S6BI/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/Dbqlizvy_xF/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DblXmSey6tM/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DbOMZIfzoaK/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/DbBRmUyTbgl/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/Da5sCsDTz71/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/reel/DavNucCRZoL/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DadR5Q6RIqx/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DaQXiZJxPct/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DYoz1J6Pl9X/	PRODUCT HIGHLIGHTS, TRENDS
https://www.instagram.com/reel/DYfCmMDiZAK/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DYNCdYsCkFA/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DWO0l-Ugj-U/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DT0WhIvkurK/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/reel/DTfs03_EqGe/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DJ1v5MqyotK/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DH8gtvryG2p/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DG5wIlKy_6D/	PRODUCT HIGHLIGHTS, DESIGN TIPS
https://www.instagram.com/reel/DEm394kBqLG/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/DCmVGubyCPl/	PRODUCT HIGHLIGHTS, DESIGN TIPS, TRENDS
https://www.instagram.com/reel/C9z78fgIFPG/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/C66bvv2Itle/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/C2VC2J9yxOA/	PRODUCT HIGHLIGHTS
https://www.instagram.com/reel/C0MkK7TSiCz/	PRODUCT HIGHLIGHTS
`;

const lines = rawData.split('\n').map(l => l.trim()).filter(Boolean);

console.log('Total raw non-empty lines:', lines.length);

const entries = [];
let ytCount = 0;
let igCount = 0;

for (const line of lines) {
  const parts = line.split('\t');
  let url = parts[0].trim();
  let catStr = parts.length > 1 ? parts[1].trim() : '';
  
  if (!url.startsWith('http')) continue;

  const categories = catStr.split(',').map(c => c.trim()).filter(Boolean);
  
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isInstagram = url.includes('instagram.com');

  if (isYouTube) ytCount++;
  if (isInstagram) igCount++;

  entries.push({
    url,
    platform: isYouTube ? 'YouTube' : isInstagram ? 'Instagram' : 'Unknown',
    categories
  });
}

console.log('Parsed total entries:', entries.length);
console.log('YouTube entries:', ytCount);
console.log('Instagram entries:', igCount);

// Check duplicate URLs
const urlMap = new Map();
const duplicates = [];

entries.forEach((item, idx) => {
  // Normalize URL (strip trailing slash and query params for comparison)
  const cleanUrl = item.url.replace(/\?.*$/, '').replace(/\/$/, '');
  if (urlMap.has(cleanUrl)) {
    duplicates.push({
      originalUrl: item.url,
      firstSeenIdx: urlMap.get(cleanUrl).originalIndex,
      currentIdx: idx,
      categories: item.categories
    });
    // Merge categories
    const existing = urlMap.get(cleanUrl);
    item.categories.forEach(cat => {
      if (!existing.categories.includes(cat)) {
        existing.categories.push(cat);
      }
    });
  } else {
    urlMap.set(cleanUrl, {
      ...item,
      cleanUrl,
      originalIndex: idx
    });
  }
});

console.log('Unique URLs:', urlMap.size);
console.log('Duplicates found:', duplicates.length);
if (duplicates.length > 0) {
  console.log('Duplicate details:', JSON.stringify(duplicates, null, 2));
}

// Check category breakdown
const allCategories = new Set();
urlMap.forEach(item => {
  item.categories.forEach(c => allCategories.add(c));
});
console.log('All unique categories across unique items:', Array.from(allCategories));

const categoryCounts = {};
allCategories.forEach(c => {
  categoryCounts[c] = Array.from(urlMap.values()).filter(item => item.categories.includes(c)).length;
});
console.log('Category item counts:', categoryCounts);
