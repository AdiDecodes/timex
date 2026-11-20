// Authoritative Watch and Choose Video Dataset
// Extracted and verified from the latest 217 entries (167 YouTube Shorts + 50 Instagram Posts/Reels)
// Zero duplicates; all categories preserved exactly.

export type WatchAndChoosePlatform = "YouTube" | "Instagram";
export type WatchAndChoosePostType = "Short" | "Reel" | "Post";

export const WATCH_AND_CHOOSE_CATEGORIES = [
  "ALL VIDEOS",
  "PRODUCT HIGHLIGHTS",
  "DESIGN TIPS",
  "TRENDS",
  "REAL SPACES",
  "BEHIND THE SCENES",
] as const;

export type WatchAndChooseCategory = (typeof WATCH_AND_CHOOSE_CATEGORIES)[number];

export interface WatchAndChooseItem {
  id: string;
  order: number;
  platform: WatchAndChoosePlatform;
  postType: WatchAndChoosePostType;
  url: string;
  videoId?: string;
  shortcode?: string;
  categories: WatchAndChooseCategory[];
  thumbnail: string;
  hqThumbnail?: string;
  embedUrl: string;
  status: "published";
}

export const WATCH_AND_CHOOSE_VIDEOS: WatchAndChooseItem[] = [
  {
    "id": "wac-yt-1",
    "order": 1,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "snFVohurL0E",
    "url": "https://www.youtube.com/shorts/snFVohurL0E",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/snFVohurL0E?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/snFVohurL0E/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/snFVohurL0E/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-2",
    "order": 2,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "lE4OLTwlCeg",
    "url": "https://www.youtube.com/shorts/lE4OLTwlCeg",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/lE4OLTwlCeg?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/lE4OLTwlCeg/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/lE4OLTwlCeg/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-3",
    "order": 3,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8q0ikBFD64c",
    "url": "https://www.youtube.com/shorts/8q0ikBFD64c",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8q0ikBFD64c?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8q0ikBFD64c/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8q0ikBFD64c/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-4",
    "order": 4,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "uJD3N5id5j0",
    "url": "https://www.youtube.com/shorts/uJD3N5id5j0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/uJD3N5id5j0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/uJD3N5id5j0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/uJD3N5id5j0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-5",
    "order": 5,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ouWCcKUBxDU",
    "url": "https://www.youtube.com/shorts/ouWCcKUBxDU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ouWCcKUBxDU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ouWCcKUBxDU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ouWCcKUBxDU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-6",
    "order": 6,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "1RmMjpSwx8Q",
    "url": "https://www.youtube.com/shorts/1RmMjpSwx8Q",
    "categories": [
      "DESIGN TIPS",
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/1RmMjpSwx8Q?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/1RmMjpSwx8Q/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/1RmMjpSwx8Q/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-7",
    "order": 7,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "vT0Hk4CerF8",
    "url": "https://www.youtube.com/shorts/vT0Hk4CerF8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/vT0Hk4CerF8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/vT0Hk4CerF8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/vT0Hk4CerF8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-8",
    "order": 8,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "OeGf8Epb_HU",
    "url": "https://www.youtube.com/shorts/OeGf8Epb_HU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/OeGf8Epb_HU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/OeGf8Epb_HU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/OeGf8Epb_HU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-9",
    "order": 9,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "b05jui30UPs",
    "url": "https://www.youtube.com/shorts/b05jui30UPs",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/b05jui30UPs?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/b05jui30UPs/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/b05jui30UPs/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-10",
    "order": 10,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "jPQcSyGunpo",
    "url": "https://www.youtube.com/shorts/jPQcSyGunpo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/jPQcSyGunpo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/jPQcSyGunpo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/jPQcSyGunpo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-11",
    "order": 11,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "JUfXZTLoBnQ",
    "url": "https://www.youtube.com/shorts/JUfXZTLoBnQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/JUfXZTLoBnQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/JUfXZTLoBnQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/JUfXZTLoBnQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-12",
    "order": 12,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8jIpfe2Gkiw",
    "url": "https://www.youtube.com/shorts/8jIpfe2Gkiw",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8jIpfe2Gkiw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8jIpfe2Gkiw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8jIpfe2Gkiw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-13",
    "order": 13,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "eQAvoVF4zXs",
    "url": "https://www.youtube.com/shorts/eQAvoVF4zXs",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/eQAvoVF4zXs?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/eQAvoVF4zXs/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/eQAvoVF4zXs/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-14",
    "order": 14,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "7-zrKlueQxI",
    "url": "https://www.youtube.com/shorts/7-zrKlueQxI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/7-zrKlueQxI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/7-zrKlueQxI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/7-zrKlueQxI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-15",
    "order": 15,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "O1QLB3H4i30",
    "url": "https://www.youtube.com/shorts/O1QLB3H4i30",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/O1QLB3H4i30?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/O1QLB3H4i30/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/O1QLB3H4i30/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-16",
    "order": 16,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "XLZiN10M9ts",
    "url": "https://www.youtube.com/shorts/XLZiN10M9ts",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/XLZiN10M9ts?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/XLZiN10M9ts/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/XLZiN10M9ts/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-17",
    "order": 17,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "sB03mdLIWjk",
    "url": "https://www.youtube.com/shorts/sB03mdLIWjk",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/sB03mdLIWjk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/sB03mdLIWjk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/sB03mdLIWjk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-18",
    "order": 18,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "bjO9KxEcrFo",
    "url": "https://www.youtube.com/shorts/bjO9KxEcrFo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/bjO9KxEcrFo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/bjO9KxEcrFo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/bjO9KxEcrFo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-19",
    "order": 19,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4AzD7IAcHLs",
    "url": "https://www.youtube.com/shorts/4AzD7IAcHLs",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4AzD7IAcHLs?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4AzD7IAcHLs/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4AzD7IAcHLs/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-20",
    "order": 20,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "qEcNrVlQO58",
    "url": "https://www.youtube.com/shorts/qEcNrVlQO58",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/qEcNrVlQO58?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/qEcNrVlQO58/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/qEcNrVlQO58/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-21",
    "order": 21,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "mcSchQTG3wM",
    "url": "https://www.youtube.com/shorts/mcSchQTG3wM",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/mcSchQTG3wM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/mcSchQTG3wM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/mcSchQTG3wM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-22",
    "order": 22,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "dsDnmxcigE0",
    "url": "https://www.youtube.com/shorts/dsDnmxcigE0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/dsDnmxcigE0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/dsDnmxcigE0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/dsDnmxcigE0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-23",
    "order": 23,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "2JDXvqivTyI",
    "url": "https://www.youtube.com/shorts/2JDXvqivTyI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/2JDXvqivTyI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/2JDXvqivTyI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/2JDXvqivTyI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-24",
    "order": 24,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "aHcF16UOE94",
    "url": "https://www.youtube.com/shorts/aHcF16UOE94",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/aHcF16UOE94?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/aHcF16UOE94/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/aHcF16UOE94/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-25",
    "order": 25,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "7sR46bVTIlI",
    "url": "https://www.youtube.com/shorts/7sR46bVTIlI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/7sR46bVTIlI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/7sR46bVTIlI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/7sR46bVTIlI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-26",
    "order": 26,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "wdPuhX3X3CY",
    "url": "https://www.youtube.com/shorts/wdPuhX3X3CY",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/wdPuhX3X3CY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/wdPuhX3X3CY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/wdPuhX3X3CY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-27",
    "order": 27,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "JrPAi2OylZk",
    "url": "https://www.youtube.com/shorts/JrPAi2OylZk",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/JrPAi2OylZk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/JrPAi2OylZk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/JrPAi2OylZk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-28",
    "order": 28,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "zq6IIH0d3CE",
    "url": "https://www.youtube.com/shorts/zq6IIH0d3CE",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/zq6IIH0d3CE?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/zq6IIH0d3CE/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/zq6IIH0d3CE/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-29",
    "order": 29,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "FRqlFy7owBY",
    "url": "https://www.youtube.com/shorts/FRqlFy7owBY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/FRqlFy7owBY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/FRqlFy7owBY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/FRqlFy7owBY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-30",
    "order": 30,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "bYuOgIdtfKY",
    "url": "https://www.youtube.com/shorts/bYuOgIdtfKY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/bYuOgIdtfKY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/bYuOgIdtfKY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/bYuOgIdtfKY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-31",
    "order": 31,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "M8Uog0RpgLo",
    "url": "https://www.youtube.com/shorts/M8Uog0RpgLo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/M8Uog0RpgLo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/M8Uog0RpgLo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/M8Uog0RpgLo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-32",
    "order": 32,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "CtxoLDM9UzI",
    "url": "https://www.youtube.com/shorts/CtxoLDM9UzI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/CtxoLDM9UzI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/CtxoLDM9UzI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/CtxoLDM9UzI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-33",
    "order": 33,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "-KbLoo0SRHQ",
    "url": "https://www.youtube.com/shorts/-KbLoo0SRHQ",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/-KbLoo0SRHQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/-KbLoo0SRHQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/-KbLoo0SRHQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-34",
    "order": 34,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8HzBA-qiOyU",
    "url": "https://www.youtube.com/shorts/8HzBA-qiOyU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8HzBA-qiOyU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8HzBA-qiOyU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8HzBA-qiOyU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-35",
    "order": 35,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "q0lbn8VV7lM",
    "url": "https://www.youtube.com/shorts/q0lbn8VV7lM",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/q0lbn8VV7lM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/q0lbn8VV7lM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/q0lbn8VV7lM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-36",
    "order": 36,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4wc_RvcSf_s",
    "url": "https://www.youtube.com/shorts/4wc_RvcSf_s",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4wc_RvcSf_s?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4wc_RvcSf_s/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4wc_RvcSf_s/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-37",
    "order": 37,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "LCBgCqpapvA",
    "url": "https://www.youtube.com/shorts/LCBgCqpapvA",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/LCBgCqpapvA?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/LCBgCqpapvA/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/LCBgCqpapvA/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-38",
    "order": 38,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4WMH7VpYY_w",
    "url": "https://www.youtube.com/shorts/4WMH7VpYY_w",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "BEHIND THE SCENES"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4WMH7VpYY_w?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4WMH7VpYY_w/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4WMH7VpYY_w/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-39",
    "order": 39,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "MqffmPySHVc",
    "url": "https://www.youtube.com/shorts/MqffmPySHVc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/MqffmPySHVc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/MqffmPySHVc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/MqffmPySHVc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-40",
    "order": 40,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "GUaMGFDeF44",
    "url": "https://www.youtube.com/shorts/GUaMGFDeF44",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/GUaMGFDeF44?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/GUaMGFDeF44/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/GUaMGFDeF44/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-41",
    "order": 41,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8zr9m0zzX30",
    "url": "https://www.youtube.com/shorts/8zr9m0zzX30",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8zr9m0zzX30?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8zr9m0zzX30/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8zr9m0zzX30/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-42",
    "order": 42,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "a1W-tIDvi-k",
    "url": "https://www.youtube.com/shorts/a1W-tIDvi-k",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/a1W-tIDvi-k?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/a1W-tIDvi-k/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/a1W-tIDvi-k/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-43",
    "order": 43,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "hp7Yag2Vm_w",
    "url": "https://www.youtube.com/shorts/hp7Yag2Vm_w",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/hp7Yag2Vm_w?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/hp7Yag2Vm_w/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/hp7Yag2Vm_w/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-44",
    "order": 44,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "l1a3t5jKh_s",
    "url": "https://www.youtube.com/shorts/l1a3t5jKh_s",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/l1a3t5jKh_s?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/l1a3t5jKh_s/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/l1a3t5jKh_s/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-45",
    "order": 45,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "K2YGIuZBYO0",
    "url": "https://www.youtube.com/shorts/K2YGIuZBYO0",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/K2YGIuZBYO0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/K2YGIuZBYO0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/K2YGIuZBYO0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-46",
    "order": 46,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "VX4MJV1uGQ4",
    "url": "https://www.youtube.com/shorts/VX4MJV1uGQ4",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/VX4MJV1uGQ4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/VX4MJV1uGQ4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/VX4MJV1uGQ4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-47",
    "order": 47,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "sr88MeEtazk",
    "url": "https://www.youtube.com/shorts/sr88MeEtazk",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/sr88MeEtazk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/sr88MeEtazk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/sr88MeEtazk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-48",
    "order": 48,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "VLC_Ehkeyps",
    "url": "https://www.youtube.com/shorts/VLC_Ehkeyps",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/VLC_Ehkeyps?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/VLC_Ehkeyps/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/VLC_Ehkeyps/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-49",
    "order": 49,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "VnKFiFwVO8w",
    "url": "https://www.youtube.com/shorts/VnKFiFwVO8w",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/VnKFiFwVO8w?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/VnKFiFwVO8w/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/VnKFiFwVO8w/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-50",
    "order": 50,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "jDuj5nJ6cvw",
    "url": "https://www.youtube.com/shorts/jDuj5nJ6cvw",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/jDuj5nJ6cvw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/jDuj5nJ6cvw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/jDuj5nJ6cvw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-51",
    "order": 51,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "UqB3AzERXdU",
    "url": "https://www.youtube.com/shorts/UqB3AzERXdU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/UqB3AzERXdU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/UqB3AzERXdU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/UqB3AzERXdU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-52",
    "order": 52,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "WiLpeqnLK_A",
    "url": "https://www.youtube.com/shorts/WiLpeqnLK_A",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/WiLpeqnLK_A?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/WiLpeqnLK_A/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/WiLpeqnLK_A/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-53",
    "order": 53,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8NxcHm_mAD8",
    "url": "https://www.youtube.com/shorts/8NxcHm_mAD8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8NxcHm_mAD8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8NxcHm_mAD8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8NxcHm_mAD8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-54",
    "order": 54,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "0BKA4WGmHBI",
    "url": "https://www.youtube.com/shorts/0BKA4WGmHBI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/0BKA4WGmHBI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/0BKA4WGmHBI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/0BKA4WGmHBI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-55",
    "order": 55,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "EkQyvVbb7s8",
    "url": "https://www.youtube.com/shorts/EkQyvVbb7s8",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/EkQyvVbb7s8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/EkQyvVbb7s8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/EkQyvVbb7s8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-56",
    "order": 56,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "-iATP4xrT4k",
    "url": "https://www.youtube.com/shorts/-iATP4xrT4k",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/-iATP4xrT4k?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/-iATP4xrT4k/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/-iATP4xrT4k/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-57",
    "order": 57,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "wOoFRAfnX04",
    "url": "https://www.youtube.com/shorts/wOoFRAfnX04",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/wOoFRAfnX04?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/wOoFRAfnX04/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/wOoFRAfnX04/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-58",
    "order": 58,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "zebC0QSFhCY",
    "url": "https://www.youtube.com/shorts/zebC0QSFhCY",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/zebC0QSFhCY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/zebC0QSFhCY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/zebC0QSFhCY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-59",
    "order": 59,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "NduN-XXu8Eo",
    "url": "https://www.youtube.com/shorts/NduN-XXu8Eo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/NduN-XXu8Eo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/NduN-XXu8Eo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/NduN-XXu8Eo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-60",
    "order": 60,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "g409pnwt-_g",
    "url": "https://www.youtube.com/shorts/g409pnwt-_g",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/g409pnwt-_g?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/g409pnwt-_g/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/g409pnwt-_g/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-61",
    "order": 61,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "NG14_VZ-heU",
    "url": "https://www.youtube.com/shorts/NG14_VZ-heU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/NG14_VZ-heU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/NG14_VZ-heU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/NG14_VZ-heU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-62",
    "order": 62,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "K9e9skUhgj0",
    "url": "https://www.youtube.com/shorts/K9e9skUhgj0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/K9e9skUhgj0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/K9e9skUhgj0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/K9e9skUhgj0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-63",
    "order": 63,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "dIkV98nArLI",
    "url": "https://www.youtube.com/shorts/dIkV98nArLI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/dIkV98nArLI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/dIkV98nArLI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/dIkV98nArLI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-64",
    "order": 64,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "vNFbZwoVy7A",
    "url": "https://www.youtube.com/shorts/vNFbZwoVy7A",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/vNFbZwoVy7A?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/vNFbZwoVy7A/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/vNFbZwoVy7A/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-65",
    "order": 65,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "3-aoS0IqtWc",
    "url": "https://www.youtube.com/shorts/3-aoS0IqtWc",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/3-aoS0IqtWc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/3-aoS0IqtWc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/3-aoS0IqtWc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-66",
    "order": 66,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Izmp3d5KIb4",
    "url": "https://www.youtube.com/shorts/Izmp3d5KIb4",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Izmp3d5KIb4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Izmp3d5KIb4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Izmp3d5KIb4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-67",
    "order": 67,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Apgy1n0u2CY",
    "url": "https://www.youtube.com/shorts/Apgy1n0u2CY",
    "categories": [
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Apgy1n0u2CY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Apgy1n0u2CY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Apgy1n0u2CY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-68",
    "order": 68,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4VnjeKPBZvA",
    "url": "https://www.youtube.com/shorts/4VnjeKPBZvA",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4VnjeKPBZvA?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4VnjeKPBZvA/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4VnjeKPBZvA/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-69",
    "order": 69,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "VE8phrgKv0A",
    "url": "https://www.youtube.com/shorts/VE8phrgKv0A",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/VE8phrgKv0A?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/VE8phrgKv0A/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/VE8phrgKv0A/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-70",
    "order": 70,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "9cxDFu7c7Zc",
    "url": "https://www.youtube.com/shorts/9cxDFu7c7Zc",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/9cxDFu7c7Zc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/9cxDFu7c7Zc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/9cxDFu7c7Zc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-71",
    "order": 71,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ZwXLXrfKWjw",
    "url": "https://www.youtube.com/shorts/ZwXLXrfKWjw",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ZwXLXrfKWjw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ZwXLXrfKWjw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ZwXLXrfKWjw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-72",
    "order": 72,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "JZ965vmBPeo",
    "url": "https://www.youtube.com/shorts/JZ965vmBPeo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/JZ965vmBPeo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/JZ965vmBPeo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/JZ965vmBPeo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-73",
    "order": 73,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Aa4FtmZmhOU",
    "url": "https://www.youtube.com/shorts/Aa4FtmZmhOU",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Aa4FtmZmhOU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Aa4FtmZmhOU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Aa4FtmZmhOU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-74",
    "order": 74,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "-DJ9wjjYeyQ",
    "url": "https://www.youtube.com/shorts/-DJ9wjjYeyQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/-DJ9wjjYeyQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/-DJ9wjjYeyQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/-DJ9wjjYeyQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-75",
    "order": 75,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "JYeRBSMPOTE",
    "url": "https://www.youtube.com/shorts/JYeRBSMPOTE",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/JYeRBSMPOTE?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/JYeRBSMPOTE/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/JYeRBSMPOTE/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-76",
    "order": 76,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "xVkDOPJJ_nk",
    "url": "https://www.youtube.com/shorts/xVkDOPJJ_nk",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/xVkDOPJJ_nk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/xVkDOPJJ_nk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/xVkDOPJJ_nk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-77",
    "order": 77,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "YMlPLkNt6GI",
    "url": "https://www.youtube.com/shorts/YMlPLkNt6GI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/YMlPLkNt6GI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/YMlPLkNt6GI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/YMlPLkNt6GI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-78",
    "order": 78,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "c86dneDAroM",
    "url": "https://www.youtube.com/shorts/c86dneDAroM",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/c86dneDAroM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/c86dneDAroM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/c86dneDAroM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-79",
    "order": 79,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ag0AMNCtGho",
    "url": "https://www.youtube.com/shorts/ag0AMNCtGho",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ag0AMNCtGho?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ag0AMNCtGho/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ag0AMNCtGho/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-80",
    "order": 80,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Yn2getqH4pk",
    "url": "https://www.youtube.com/shorts/Yn2getqH4pk",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Yn2getqH4pk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Yn2getqH4pk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Yn2getqH4pk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-81",
    "order": 81,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "_S5qIFmQQFU",
    "url": "https://www.youtube.com/shorts/_S5qIFmQQFU",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/_S5qIFmQQFU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/_S5qIFmQQFU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/_S5qIFmQQFU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-82",
    "order": 82,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "1n3HzgjA-Vk",
    "url": "https://www.youtube.com/shorts/1n3HzgjA-Vk",
    "categories": [
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/1n3HzgjA-Vk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/1n3HzgjA-Vk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/1n3HzgjA-Vk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-83",
    "order": 83,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "e2F80erTNqI",
    "url": "https://www.youtube.com/shorts/e2F80erTNqI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/e2F80erTNqI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/e2F80erTNqI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/e2F80erTNqI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-84",
    "order": 84,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "6h4ERcExWAY",
    "url": "https://www.youtube.com/shorts/6h4ERcExWAY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/6h4ERcExWAY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/6h4ERcExWAY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/6h4ERcExWAY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-85",
    "order": 85,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "dDXtei73MR4",
    "url": "https://www.youtube.com/shorts/dDXtei73MR4",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/dDXtei73MR4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/dDXtei73MR4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/dDXtei73MR4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-86",
    "order": 86,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "C5KFbyRx1Dc",
    "url": "https://www.youtube.com/shorts/C5KFbyRx1Dc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/C5KFbyRx1Dc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/C5KFbyRx1Dc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/C5KFbyRx1Dc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-87",
    "order": 87,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "8TL1BmjQ1nQ",
    "url": "https://www.youtube.com/shorts/8TL1BmjQ1nQ",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/8TL1BmjQ1nQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/8TL1BmjQ1nQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/8TL1BmjQ1nQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-88",
    "order": 88,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4Pez7LZVgBY",
    "url": "https://www.youtube.com/shorts/4Pez7LZVgBY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4Pez7LZVgBY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4Pez7LZVgBY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4Pez7LZVgBY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-89",
    "order": 89,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "_yObqS6yrYY",
    "url": "https://www.youtube.com/shorts/_yObqS6yrYY",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/_yObqS6yrYY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/_yObqS6yrYY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/_yObqS6yrYY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-90",
    "order": 90,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "NI5rjj697cI",
    "url": "https://www.youtube.com/shorts/NI5rjj697cI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/NI5rjj697cI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/NI5rjj697cI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/NI5rjj697cI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-91",
    "order": 91,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "XlgmipLAiW4",
    "url": "https://www.youtube.com/shorts/XlgmipLAiW4",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/XlgmipLAiW4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/XlgmipLAiW4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/XlgmipLAiW4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-92",
    "order": 92,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ESKWY-lyfNI",
    "url": "https://www.youtube.com/shorts/ESKWY-lyfNI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ESKWY-lyfNI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ESKWY-lyfNI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ESKWY-lyfNI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-93",
    "order": 93,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "iR5pZ7EUC84",
    "url": "https://www.youtube.com/shorts/iR5pZ7EUC84",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/iR5pZ7EUC84?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/iR5pZ7EUC84/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/iR5pZ7EUC84/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-94",
    "order": 94,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "V6r6t6rWR4U",
    "url": "https://www.youtube.com/shorts/V6r6t6rWR4U",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/V6r6t6rWR4U?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/V6r6t6rWR4U/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/V6r6t6rWR4U/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-95",
    "order": 95,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "CYszQOBOU2s",
    "url": "https://www.youtube.com/shorts/CYszQOBOU2s",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/CYszQOBOU2s?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/CYszQOBOU2s/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/CYszQOBOU2s/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-96",
    "order": 96,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "5lEos1CVRPk",
    "url": "https://www.youtube.com/shorts/5lEos1CVRPk",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/5lEos1CVRPk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/5lEos1CVRPk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/5lEos1CVRPk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-97",
    "order": 97,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "UfCtK1qUD_k",
    "url": "https://www.youtube.com/shorts/UfCtK1qUD_k",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/UfCtK1qUD_k?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/UfCtK1qUD_k/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/UfCtK1qUD_k/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-98",
    "order": 98,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "FqGAfJ7AOgY",
    "url": "https://www.youtube.com/shorts/FqGAfJ7AOgY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/FqGAfJ7AOgY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/FqGAfJ7AOgY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/FqGAfJ7AOgY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-99",
    "order": 99,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "d4VNckIySnk",
    "url": "https://www.youtube.com/shorts/d4VNckIySnk",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/d4VNckIySnk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/d4VNckIySnk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/d4VNckIySnk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-100",
    "order": 100,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "m4Zk8pVsCC4",
    "url": "https://www.youtube.com/shorts/m4Zk8pVsCC4",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/m4Zk8pVsCC4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/m4Zk8pVsCC4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/m4Zk8pVsCC4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-101",
    "order": 101,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "uv0fTNHakD4",
    "url": "https://www.youtube.com/shorts/uv0fTNHakD4",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/uv0fTNHakD4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/uv0fTNHakD4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/uv0fTNHakD4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-102",
    "order": 102,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "AjSx34j5W1I",
    "url": "https://www.youtube.com/shorts/AjSx34j5W1I",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/AjSx34j5W1I?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/AjSx34j5W1I/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/AjSx34j5W1I/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-103",
    "order": 103,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "f-KGATRxlDI",
    "url": "https://www.youtube.com/shorts/f-KGATRxlDI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/f-KGATRxlDI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/f-KGATRxlDI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/f-KGATRxlDI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-104",
    "order": 104,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ekHJ8ew0t-o",
    "url": "https://www.youtube.com/shorts/ekHJ8ew0t-o",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ekHJ8ew0t-o?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ekHJ8ew0t-o/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ekHJ8ew0t-o/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-105",
    "order": 105,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Am_oRYDgExQ",
    "url": "https://www.youtube.com/shorts/Am_oRYDgExQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Am_oRYDgExQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Am_oRYDgExQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Am_oRYDgExQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-106",
    "order": 106,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4FGWuePNIwc",
    "url": "https://www.youtube.com/shorts/4FGWuePNIwc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4FGWuePNIwc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4FGWuePNIwc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4FGWuePNIwc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-107",
    "order": 107,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "-vNdgiDlBg8",
    "url": "https://www.youtube.com/shorts/-vNdgiDlBg8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/-vNdgiDlBg8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/-vNdgiDlBg8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/-vNdgiDlBg8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-108",
    "order": 108,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "oFENBPlQj6o",
    "url": "https://www.youtube.com/shorts/oFENBPlQj6o",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/oFENBPlQj6o?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/oFENBPlQj6o/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/oFENBPlQj6o/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-109",
    "order": 109,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "U2k9HkirPiI",
    "url": "https://www.youtube.com/shorts/U2k9HkirPiI",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/U2k9HkirPiI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/U2k9HkirPiI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/U2k9HkirPiI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-110",
    "order": 110,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "dKLnLEQSTaQ",
    "url": "https://www.youtube.com/shorts/dKLnLEQSTaQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/dKLnLEQSTaQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/dKLnLEQSTaQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/dKLnLEQSTaQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-111",
    "order": 111,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "qDd0xO-IC1o",
    "url": "https://www.youtube.com/shorts/qDd0xO-IC1o",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/qDd0xO-IC1o?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/qDd0xO-IC1o/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/qDd0xO-IC1o/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-112",
    "order": 112,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "9-hnnFUIDvY",
    "url": "https://www.youtube.com/shorts/9-hnnFUIDvY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/9-hnnFUIDvY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/9-hnnFUIDvY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/9-hnnFUIDvY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-113",
    "order": 113,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "E2NEra1U5Qc",
    "url": "https://www.youtube.com/shorts/E2NEra1U5Qc",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/E2NEra1U5Qc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/E2NEra1U5Qc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/E2NEra1U5Qc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-114",
    "order": 114,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "14OUL6gxq1M",
    "url": "https://www.youtube.com/shorts/14OUL6gxq1M",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/14OUL6gxq1M?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/14OUL6gxq1M/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/14OUL6gxq1M/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-115",
    "order": 115,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "dCUeYvvBY4E",
    "url": "https://www.youtube.com/shorts/dCUeYvvBY4E",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/dCUeYvvBY4E?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/dCUeYvvBY4E/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/dCUeYvvBY4E/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-116",
    "order": 116,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "67m42pNKTN0",
    "url": "https://www.youtube.com/shorts/67m42pNKTN0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/67m42pNKTN0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/67m42pNKTN0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/67m42pNKTN0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-117",
    "order": 117,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "nAMYjWKKgt8",
    "url": "https://www.youtube.com/shorts/nAMYjWKKgt8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/nAMYjWKKgt8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/nAMYjWKKgt8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/nAMYjWKKgt8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-118",
    "order": 118,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "VYyheMI-yTQ",
    "url": "https://www.youtube.com/shorts/VYyheMI-yTQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/VYyheMI-yTQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/VYyheMI-yTQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/VYyheMI-yTQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-119",
    "order": 119,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Wm6ka0tbEeU",
    "url": "https://www.youtube.com/shorts/Wm6ka0tbEeU",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Wm6ka0tbEeU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Wm6ka0tbEeU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Wm6ka0tbEeU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-120",
    "order": 120,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "M40xYZHD6-g",
    "url": "https://www.youtube.com/shorts/M40xYZHD6-g",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/M40xYZHD6-g?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/M40xYZHD6-g/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/M40xYZHD6-g/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-121",
    "order": 121,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "r5zixlTWEGA",
    "url": "https://www.youtube.com/shorts/r5zixlTWEGA",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/r5zixlTWEGA?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/r5zixlTWEGA/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/r5zixlTWEGA/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-122",
    "order": 122,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4E3_dPVGgA0",
    "url": "https://www.youtube.com/shorts/4E3_dPVGgA0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4E3_dPVGgA0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4E3_dPVGgA0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4E3_dPVGgA0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-123",
    "order": 123,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "M0FoExS-wEQ",
    "url": "https://www.youtube.com/shorts/M0FoExS-wEQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/M0FoExS-wEQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/M0FoExS-wEQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/M0FoExS-wEQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-124",
    "order": 124,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "ZvKcgeweLFI",
    "url": "https://www.youtube.com/shorts/ZvKcgeweLFI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/ZvKcgeweLFI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/ZvKcgeweLFI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/ZvKcgeweLFI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-125",
    "order": 125,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "OQemaQe4hgo",
    "url": "https://www.youtube.com/shorts/OQemaQe4hgo",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/OQemaQe4hgo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/OQemaQe4hgo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/OQemaQe4hgo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-126",
    "order": 126,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4boE7pwE4Pc",
    "url": "https://www.youtube.com/shorts/4boE7pwE4Pc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4boE7pwE4Pc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4boE7pwE4Pc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4boE7pwE4Pc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-127",
    "order": 127,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4SzrDIKx3Ic",
    "url": "https://www.youtube.com/shorts/4SzrDIKx3Ic",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4SzrDIKx3Ic?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4SzrDIKx3Ic/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4SzrDIKx3Ic/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-128",
    "order": 128,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "HgOhE0vKTtM",
    "url": "https://www.youtube.com/shorts/HgOhE0vKTtM",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/HgOhE0vKTtM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/HgOhE0vKTtM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/HgOhE0vKTtM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-129",
    "order": 129,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "429GsMgKdmc",
    "url": "https://www.youtube.com/shorts/429GsMgKdmc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/429GsMgKdmc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/429GsMgKdmc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/429GsMgKdmc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-130",
    "order": 130,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "IdUpxhH-ew8",
    "url": "https://www.youtube.com/shorts/IdUpxhH-ew8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/IdUpxhH-ew8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/IdUpxhH-ew8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/IdUpxhH-ew8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-131",
    "order": 131,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "OI2V777t_0o",
    "url": "https://www.youtube.com/shorts/OI2V777t_0o",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/OI2V777t_0o?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/OI2V777t_0o/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/OI2V777t_0o/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-132",
    "order": 132,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Fi8ATdw-H54",
    "url": "https://www.youtube.com/shorts/Fi8ATdw-H54",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Fi8ATdw-H54?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Fi8ATdw-H54/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Fi8ATdw-H54/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-133",
    "order": 133,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "IFs_TBkR0hc",
    "url": "https://www.youtube.com/shorts/IFs_TBkR0hc",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/IFs_TBkR0hc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/IFs_TBkR0hc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/IFs_TBkR0hc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-134",
    "order": 134,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "4u1rsdQMwaY",
    "url": "https://www.youtube.com/shorts/4u1rsdQMwaY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/4u1rsdQMwaY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/4u1rsdQMwaY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/4u1rsdQMwaY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-135",
    "order": 135,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "0M7-MGiAv48",
    "url": "https://www.youtube.com/shorts/0M7-MGiAv48",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/0M7-MGiAv48?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/0M7-MGiAv48/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/0M7-MGiAv48/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-136",
    "order": 136,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "n74R_jyU3vQ",
    "url": "https://www.youtube.com/shorts/n74R_jyU3vQ",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/n74R_jyU3vQ?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/n74R_jyU3vQ/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/n74R_jyU3vQ/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-137",
    "order": 137,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "BiHryBm15Yk",
    "url": "https://www.youtube.com/shorts/BiHryBm15Yk",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/BiHryBm15Yk?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/BiHryBm15Yk/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/BiHryBm15Yk/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-138",
    "order": 138,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "GiYNt5pemKs",
    "url": "https://www.youtube.com/shorts/GiYNt5pemKs",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/GiYNt5pemKs?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/GiYNt5pemKs/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/GiYNt5pemKs/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-139",
    "order": 139,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "sZllvBbOQbg",
    "url": "https://www.youtube.com/shorts/sZllvBbOQbg",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/sZllvBbOQbg?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/sZllvBbOQbg/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/sZllvBbOQbg/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-140",
    "order": 140,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "C0x-RJeO8hE",
    "url": "https://www.youtube.com/shorts/C0x-RJeO8hE",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/C0x-RJeO8hE?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/C0x-RJeO8hE/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/C0x-RJeO8hE/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-141",
    "order": 141,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "1Niqp8fy6kc",
    "url": "https://www.youtube.com/shorts/1Niqp8fy6kc",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/1Niqp8fy6kc?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/1Niqp8fy6kc/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/1Niqp8fy6kc/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-142",
    "order": 142,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Lx_zxFGfdgo",
    "url": "https://www.youtube.com/shorts/Lx_zxFGfdgo",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Lx_zxFGfdgo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Lx_zxFGfdgo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Lx_zxFGfdgo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-143",
    "order": 143,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "qLrMgCs4jIo",
    "url": "https://www.youtube.com/shorts/qLrMgCs4jIo",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/qLrMgCs4jIo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/qLrMgCs4jIo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/qLrMgCs4jIo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-144",
    "order": 144,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Q9k3AXWkpVo",
    "url": "https://www.youtube.com/shorts/Q9k3AXWkpVo",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Q9k3AXWkpVo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Q9k3AXWkpVo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Q9k3AXWkpVo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-145",
    "order": 145,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "l7EMhPFdfbw",
    "url": "https://www.youtube.com/shorts/l7EMhPFdfbw",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/l7EMhPFdfbw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/l7EMhPFdfbw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/l7EMhPFdfbw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-146",
    "order": 146,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "n3OXsCfGnt0",
    "url": "https://www.youtube.com/shorts/n3OXsCfGnt0",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/n3OXsCfGnt0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/n3OXsCfGnt0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/n3OXsCfGnt0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-147",
    "order": 147,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "Y8rpcclfySE",
    "url": "https://www.youtube.com/shorts/Y8rpcclfySE",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/Y8rpcclfySE?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/Y8rpcclfySE/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/Y8rpcclfySE/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-148",
    "order": 148,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "TMNfNad4KmI",
    "url": "https://www.youtube.com/shorts/TMNfNad4KmI",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/TMNfNad4KmI?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/TMNfNad4KmI/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/TMNfNad4KmI/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-149",
    "order": 149,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "cprAlhfGVz0",
    "url": "https://www.youtube.com/shorts/cprAlhfGVz0",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/cprAlhfGVz0?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/cprAlhfGVz0/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/cprAlhfGVz0/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-150",
    "order": 150,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "nQMC6v12D_M",
    "url": "https://www.youtube.com/shorts/nQMC6v12D_M",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/nQMC6v12D_M?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/nQMC6v12D_M/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/nQMC6v12D_M/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-151",
    "order": 151,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "tsJVCXiixWM",
    "url": "https://www.youtube.com/shorts/tsJVCXiixWM",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/tsJVCXiixWM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/tsJVCXiixWM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/tsJVCXiixWM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-152",
    "order": 152,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "XBlSGde5KUs",
    "url": "https://www.youtube.com/shorts/XBlSGde5KUs",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/XBlSGde5KUs?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/XBlSGde5KUs/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/XBlSGde5KUs/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-153",
    "order": 153,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "_6h2LqUbb8s",
    "url": "https://www.youtube.com/shorts/_6h2LqUbb8s",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/_6h2LqUbb8s?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/_6h2LqUbb8s/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/_6h2LqUbb8s/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-154",
    "order": 154,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "uzH4tsllW5o",
    "url": "https://www.youtube.com/shorts/uzH4tsllW5o",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/uzH4tsllW5o?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/uzH4tsllW5o/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/uzH4tsllW5o/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-155",
    "order": 155,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "xiJ4RQd5lY8",
    "url": "https://www.youtube.com/shorts/xiJ4RQd5lY8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/xiJ4RQd5lY8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/xiJ4RQd5lY8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/xiJ4RQd5lY8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-156",
    "order": 156,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "31NQTxk2XJ8",
    "url": "https://www.youtube.com/shorts/31NQTxk2XJ8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/31NQTxk2XJ8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/31NQTxk2XJ8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/31NQTxk2XJ8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-157",
    "order": 157,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "cHF53VEr6h8",
    "url": "https://www.youtube.com/shorts/cHF53VEr6h8",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/cHF53VEr6h8?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/cHF53VEr6h8/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/cHF53VEr6h8/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-158",
    "order": 158,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "QrhDnH9orvw",
    "url": "https://www.youtube.com/shorts/QrhDnH9orvw",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/QrhDnH9orvw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/QrhDnH9orvw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/QrhDnH9orvw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-159",
    "order": 159,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "KHKS1vYIYsM",
    "url": "https://www.youtube.com/shorts/KHKS1vYIYsM",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/KHKS1vYIYsM?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/KHKS1vYIYsM/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/KHKS1vYIYsM/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-160",
    "order": 160,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "0ARf2h-3Jh4",
    "url": "https://www.youtube.com/shorts/0ARf2h-3Jh4",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/0ARf2h-3Jh4?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/0ARf2h-3Jh4/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/0ARf2h-3Jh4/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-161",
    "order": 161,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "9d5Lr-Peitw",
    "url": "https://www.youtube.com/shorts/9d5Lr-Peitw",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/9d5Lr-Peitw?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/9d5Lr-Peitw/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/9d5Lr-Peitw/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-162",
    "order": 162,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "qjiMq9xAq8M",
    "url": "https://www.youtube.com/shorts/qjiMq9xAq8M",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/qjiMq9xAq8M?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/qjiMq9xAq8M/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/qjiMq9xAq8M/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-163",
    "order": 163,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "XgV_PeKfI64",
    "url": "https://www.youtube.com/shorts/XgV_PeKfI64",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/XgV_PeKfI64?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/XgV_PeKfI64/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/XgV_PeKfI64/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-164",
    "order": 164,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "gsizxAK4uOY",
    "url": "https://www.youtube.com/shorts/gsizxAK4uOY",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "REAL SPACES"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/gsizxAK4uOY?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/gsizxAK4uOY/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/gsizxAK4uOY/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-165",
    "order": 165,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "RQ-DP40A8ZU",
    "url": "https://www.youtube.com/shorts/RQ-DP40A8ZU",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/RQ-DP40A8ZU?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/RQ-DP40A8ZU/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/RQ-DP40A8ZU/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-166",
    "order": 166,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "YfE4GAEYHgo",
    "url": "https://www.youtube.com/shorts/YfE4GAEYHgo",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/YfE4GAEYHgo?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/YfE4GAEYHgo/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/YfE4GAEYHgo/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-yt-167",
    "order": 167,
    "platform": "YouTube",
    "postType": "Short",
    "videoId": "w_P455f8l2E",
    "url": "https://www.youtube.com/shorts/w_P455f8l2E",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.youtube-nocookie.com/embed/w_P455f8l2E?autoplay=1&rel=0&modestbranding=1",
    "thumbnail": "https://img.youtube.com/vi/w_P455f8l2E/hqdefault.jpg",
    "hqThumbnail": "https://img.youtube.com/vi/w_P455f8l2E/maxresdefault.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-168",
    "order": 168,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DaVstXnxj_f",
    "url": "https://www.instagram.com/p/DaVstXnxj_f/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/p/DaVstXnxj_f/embed/",
    "thumbnail": "/images/instagram/DaVstXnxj_f.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-169",
    "order": 169,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "Dd4IiYBi1dz",
    "url": "https://www.instagram.com/p/Dd4IiYBi1dz/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/p/Dd4IiYBi1dz/embed/",
    "thumbnail": "/images/instagram/Dd4IiYBi1dz.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-170",
    "order": 170,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DUQoBxeEmxN",
    "url": "https://www.instagram.com/p/DUQoBxeEmxN/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/p/DUQoBxeEmxN/embed/",
    "thumbnail": "/images/instagram/DUQoBxeEmxN.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-171",
    "order": 171,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DfPyF48ynxI",
    "url": "https://www.instagram.com/p/DfPyF48ynxI/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DfPyF48ynxI/embed/",
    "thumbnail": "/images/instagram/DfPyF48ynxI.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-172",
    "order": 172,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DfKlRN9SDJO",
    "url": "https://www.instagram.com/p/DfKlRN9SDJO/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DfKlRN9SDJO/embed/",
    "thumbnail": "/images/instagram/DfKlRN9SDJO.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-173",
    "order": 173,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DfFP3igSy4F",
    "url": "https://www.instagram.com/p/DfFP3igSy4F/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DfFP3igSy4F/embed/",
    "thumbnail": "/images/instagram/DfFP3igSy4F.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-174",
    "order": 174,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DfC4E6Qy92Q",
    "url": "https://www.instagram.com/p/DfC4E6Qy92Q/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DfC4E6Qy92Q/embed/",
    "thumbnail": "/images/instagram/DfC4E6Qy92Q.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-175",
    "order": 175,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "De9sR6skjqu",
    "url": "https://www.instagram.com/p/De9sR6skjqu/?img_index=1",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/De9sR6skjqu/embed/",
    "thumbnail": "/images/instagram/De9sR6skjqu.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-176",
    "order": 176,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "Dew0VpJyIe6",
    "url": "https://www.instagram.com/p/Dew0VpJyIe6/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/Dew0VpJyIe6/embed/",
    "thumbnail": "/images/instagram/Dew0VpJyIe6.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-177",
    "order": 177,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DernwKESx31",
    "url": "https://www.instagram.com/p/DernwKESx31/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/p/DernwKESx31/embed/",
    "thumbnail": "/images/instagram/DernwKESx31.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-178",
    "order": 178,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DepC2zRyBW3",
    "url": "https://www.instagram.com/p/DepC2zRyBW3/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/p/DepC2zRyBW3/embed/",
    "thumbnail": "/images/instagram/DepC2zRyBW3.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-179",
    "order": 179,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DemeEtPyF3C",
    "url": "https://www.instagram.com/p/DemeEtPyF3C/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DemeEtPyF3C/embed/",
    "thumbnail": "/images/instagram/DemeEtPyF3C.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-180",
    "order": 180,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "Dej80cbyVh6",
    "url": "https://www.instagram.com/p/Dej80cbyVh6/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/p/Dej80cbyVh6/embed/",
    "thumbnail": "/images/instagram/Dej80cbyVh6.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-181",
    "order": 181,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "Dee3EFMSOKR",
    "url": "https://www.instagram.com/p/Dee3EFMSOKR/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/Dee3EFMSOKR/embed/",
    "thumbnail": "/images/instagram/Dee3EFMSOKR.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-182",
    "order": 182,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DecQY-wykfC",
    "url": "https://www.instagram.com/p/DecQY-wykfC/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DecQY-wykfC/embed/",
    "thumbnail": "/images/instagram/DecQY-wykfC.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-183",
    "order": 183,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DeZp_kMSJQp",
    "url": "https://www.instagram.com/p/DeZp_kMSJQp/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/p/DeZp_kMSJQp/embed/",
    "thumbnail": "/images/instagram/DeZp_kMSJQp.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-184",
    "order": 184,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DeMw3N1S8hz",
    "url": "https://www.instagram.com/p/DeMw3N1S8hz/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/p/DeMw3N1S8hz/embed/",
    "thumbnail": "/images/instagram/DeMw3N1S8hz.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-185",
    "order": 185,
    "platform": "Instagram",
    "postType": "Post",
    "shortcode": "DeHl7S0C9DN",
    "url": "https://www.instagram.com/p/DeHl7S0C9DN/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/p/DeHl7S0C9DN/embed/",
    "thumbnail": "/images/instagram/DeHl7S0C9DN.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-186",
    "order": 186,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Dd9SfUby5TW",
    "url": "https://www.instagram.com/reel/Dd9SfUby5TW/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Dd9SfUby5TW/embed/",
    "thumbnail": "/images/instagram/Dd9SfUby5TW.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-187",
    "order": 187,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Dd1ldy3irHG",
    "url": "https://www.instagram.com/reel/Dd1ldy3irHG/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Dd1ldy3irHG/embed/",
    "thumbnail": "/images/instagram/Dd1ldy3irHG.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-188",
    "order": 188,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Ddt02kjCb6Z",
    "url": "https://www.instagram.com/reel/Ddt02kjCb6Z/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Ddt02kjCb6Z/embed/",
    "thumbnail": "/images/instagram/Ddt02kjCb6Z.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-189",
    "order": 189,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DdotOaQiWhP",
    "url": "https://www.instagram.com/reel/DdotOaQiWhP/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DdotOaQiWhP/embed/",
    "thumbnail": "/images/instagram/DdotOaQiWhP.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-190",
    "order": 190,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DdZTPMDSe6E",
    "url": "https://www.instagram.com/reel/DdZTPMDSe6E/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DdZTPMDSe6E/embed/",
    "thumbnail": "/images/instagram/DdZTPMDSe6E.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-191",
    "order": 191,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DdJ6xc9yHf7",
    "url": "https://www.instagram.com/reel/DdJ6xc9yHf7/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DdJ6xc9yHf7/embed/",
    "thumbnail": "/images/instagram/DdJ6xc9yHf7.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-192",
    "order": 192,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DdEnFNOSuPR",
    "url": "https://www.instagram.com/reel/DdEnFNOSuPR/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DdEnFNOSuPR/embed/",
    "thumbnail": "/images/instagram/DdEnFNOSuPR.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-193",
    "order": 193,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Dc_cXXpyw_C",
    "url": "https://www.instagram.com/reel/Dc_cXXpyw_C/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Dc_cXXpyw_C/embed/",
    "thumbnail": "/images/instagram/Dc_cXXpyw_C.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-194",
    "order": 194,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DctedK8S6BI",
    "url": "https://www.instagram.com/reel/DctedK8S6BI/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DctedK8S6BI/embed/",
    "thumbnail": "/images/instagram/DctedK8S6BI.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-195",
    "order": 195,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Dbqlizvy_xF",
    "url": "https://www.instagram.com/reel/Dbqlizvy_xF/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Dbqlizvy_xF/embed/",
    "thumbnail": "/images/instagram/Dbqlizvy_xF.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-196",
    "order": 196,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DblXmSey6tM",
    "url": "https://www.instagram.com/reel/DblXmSey6tM/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DblXmSey6tM/embed/",
    "thumbnail": "/images/instagram/DblXmSey6tM.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-197",
    "order": 197,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DbOMZIfzoaK",
    "url": "https://www.instagram.com/reel/DbOMZIfzoaK/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DbOMZIfzoaK/embed/",
    "thumbnail": "/images/instagram/DbOMZIfzoaK.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-198",
    "order": 198,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DbBRmUyTbgl",
    "url": "https://www.instagram.com/reel/DbBRmUyTbgl/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DbBRmUyTbgl/embed/",
    "thumbnail": "/images/instagram/DbBRmUyTbgl.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-199",
    "order": 199,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "Da5sCsDTz71",
    "url": "https://www.instagram.com/reel/Da5sCsDTz71/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/reel/Da5sCsDTz71/embed/",
    "thumbnail": "/images/instagram/Da5sCsDTz71.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-200",
    "order": 200,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DavNucCRZoL",
    "url": "https://www.instagram.com/reel/DavNucCRZoL/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DavNucCRZoL/embed/",
    "thumbnail": "/images/instagram/DavNucCRZoL.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-201",
    "order": 201,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DadR5Q6RIqx",
    "url": "https://www.instagram.com/reel/DadR5Q6RIqx/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DadR5Q6RIqx/embed/",
    "thumbnail": "/images/instagram/DadR5Q6RIqx.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-202",
    "order": 202,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DaQXiZJxPct",
    "url": "https://www.instagram.com/reel/DaQXiZJxPct/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DaQXiZJxPct/embed/",
    "thumbnail": "/images/instagram/DaQXiZJxPct.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-203",
    "order": 203,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DYoz1J6Pl9X",
    "url": "https://www.instagram.com/reel/DYoz1J6Pl9X/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DYoz1J6Pl9X/embed/",
    "thumbnail": "/images/instagram/DYoz1J6Pl9X.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-204",
    "order": 204,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DYfCmMDiZAK",
    "url": "https://www.instagram.com/reel/DYfCmMDiZAK/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DYfCmMDiZAK/embed/",
    "thumbnail": "/images/instagram/DYfCmMDiZAK.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-205",
    "order": 205,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DYNCdYsCkFA",
    "url": "https://www.instagram.com/reel/DYNCdYsCkFA/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DYNCdYsCkFA/embed/",
    "thumbnail": "/images/instagram/DYNCdYsCkFA.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-206",
    "order": 206,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DWO0l-Ugj-U",
    "url": "https://www.instagram.com/reel/DWO0l-Ugj-U/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DWO0l-Ugj-U/embed/",
    "thumbnail": "/images/instagram/DWO0l-Ugj-U.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-207",
    "order": 207,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DT0WhIvkurK",
    "url": "https://www.instagram.com/reel/DT0WhIvkurK/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DT0WhIvkurK/embed/",
    "thumbnail": "/images/instagram/DT0WhIvkurK.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-208",
    "order": 208,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DTfs03_EqGe",
    "url": "https://www.instagram.com/reel/DTfs03_EqGe/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DTfs03_EqGe/embed/",
    "thumbnail": "/images/instagram/DTfs03_EqGe.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-209",
    "order": 209,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DJ1v5MqyotK",
    "url": "https://www.instagram.com/reel/DJ1v5MqyotK/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DJ1v5MqyotK/embed/",
    "thumbnail": "/images/instagram/DJ1v5MqyotK.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-210",
    "order": 210,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DH8gtvryG2p",
    "url": "https://www.instagram.com/reel/DH8gtvryG2p/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DH8gtvryG2p/embed/",
    "thumbnail": "/images/instagram/DH8gtvryG2p.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-211",
    "order": 211,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DG5wIlKy_6D",
    "url": "https://www.instagram.com/reel/DG5wIlKy_6D/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DG5wIlKy_6D/embed/",
    "thumbnail": "/images/instagram/DG5wIlKy_6D.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-212",
    "order": 212,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DEm394kBqLG",
    "url": "https://www.instagram.com/reel/DEm394kBqLG/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DEm394kBqLG/embed/",
    "thumbnail": "/images/instagram/DEm394kBqLG.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-213",
    "order": 213,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "DCmVGubyCPl",
    "url": "https://www.instagram.com/reel/DCmVGubyCPl/",
    "categories": [
      "PRODUCT HIGHLIGHTS",
      "DESIGN TIPS",
      "TRENDS"
    ],
    "embedUrl": "https://www.instagram.com/reel/DCmVGubyCPl/embed/",
    "thumbnail": "/images/instagram/DCmVGubyCPl.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-214",
    "order": 214,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "C9z78fgIFPG",
    "url": "https://www.instagram.com/reel/C9z78fgIFPG/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/C9z78fgIFPG/embed/",
    "thumbnail": "/images/instagram/C9z78fgIFPG.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-215",
    "order": 215,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "C66bvv2Itle",
    "url": "https://www.instagram.com/reel/C66bvv2Itle/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/C66bvv2Itle/embed/",
    "thumbnail": "/images/instagram/C66bvv2Itle.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-216",
    "order": 216,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "C2VC2J9yxOA",
    "url": "https://www.instagram.com/reel/C2VC2J9yxOA/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/C2VC2J9yxOA/embed/",
    "thumbnail": "/images/instagram/C2VC2J9yxOA.jpg",
    "status": "published"
  },
  {
    "id": "wac-ig-217",
    "order": 217,
    "platform": "Instagram",
    "postType": "Reel",
    "shortcode": "C0MkK7TSiCz",
    "url": "https://www.instagram.com/reel/C0MkK7TSiCz/",
    "categories": [
      "PRODUCT HIGHLIGHTS"
    ],
    "embedUrl": "https://www.instagram.com/reel/C0MkK7TSiCz/embed/",
    "thumbnail": "/images/instagram/C0MkK7TSiCz.jpg",
    "status": "published"
  }
];
