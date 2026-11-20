export type InstagramCategory =
  | "PRODUCT HIGHLIGHTS"
  | "DESIGN TIPS"
  | "TRENDS"
  | "REAL SPACES"
  | "HOW TO"
  | "BEHIND THE SCENES";

export type InstagramPostType = "Reel" | "Post";

export interface InstagramInspirationItem {
  id: string;
  order: number;
  url: string;
  shortcode: string;
  postType: InstagramPostType;
  categories: InstagramCategory[];
  embedUrl: string;
  previewImage: string;
  status: "published";
}

export const INSTAGRAM_CATEGORIES = [
  "ALL VIDEOS",
  "PRODUCT HIGHLIGHTS",
  "DESIGN TIPS",
  "TRENDS",
  "REAL SPACES",
  "HOW TO",
  "BEHIND THE SCENES",
] as const;

export type InstagramCategoryFilter = (typeof INSTAGRAM_CATEGORIES)[number];

export const INSTAGRAM_INSPIRATION_ITEMS: InstagramInspirationItem[] = [
  {
    id: "ig-1",
    order: 1,
    url: "https://www.instagram.com/reel/DFnd5sJSeHY/",
    shortcode: "DFnd5sJSeHY",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/reel/DFnd5sJSeHY/embed/",
    previewImage: "/images/instagram/ig-1.jpg",
    status: "published",
  },
  {
    id: "ig-2",
    order: 2,
    url: "https://www.instagram.com/reel/DHQ8D2mod6O/",
    shortcode: "DHQ8D2mod6O",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS"],
    embedUrl: "https://www.instagram.com/reel/DHQ8D2mod6O/embed/",
    previewImage: "/images/instagram/ig-2.jpg",
    status: "published",
  },
  {
    id: "ig-3",
    order: 3,
    url: "https://www.instagram.com/reel/DHYqqcHRMKQ/",
    shortcode: "DHYqqcHRMKQ",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/reel/DHYqqcHRMKQ/embed/",
    previewImage: "/images/instagram/ig-3.jpg",
    status: "published",
  },
  {
    id: "ig-4",
    order: 4,
    url: "https://www.instagram.com/reel/DTslNDykjTS/",
    shortcode: "DTslNDykjTS",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/reel/DTslNDykjTS/embed/",
    previewImage: "/images/instagram/ig-4.jpg",
    status: "published",
  },
  {
    id: "ig-5",
    order: 5,
    url: "https://www.instagram.com/p/DTS4R9skr4J/",
    shortcode: "DTS4R9skr4J",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/DTS4R9skr4J/embed/",
    previewImage: "/images/instagram/ig-5.jpg",
    status: "published",
  },
  {
    id: "ig-6",
    order: 6,
    url: "https://www.instagram.com/p/DTPw6qyDFiX/",
    shortcode: "DTPw6qyDFiX",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/DTPw6qyDFiX/embed/",
    previewImage: "/images/instagram/ig-6.jpg",
    status: "published",
  },
  {
    id: "ig-7",
    order: 7,
    url: "https://www.instagram.com/p/DTNrO2Ikgb_/",
    shortcode: "DTNrO2Ikgb_",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/DTNrO2Ikgb_/embed/",
    previewImage: "/images/instagram/ig-7.jpg",
    status: "published",
  },
  {
    id: "ig-8",
    order: 8,
    url: "https://www.instagram.com/p/DTIhj6BEpHC/",
    shortcode: "DTIhj6BEpHC",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS", "TRENDS"],
    embedUrl: "https://www.instagram.com/p/DTIhj6BEpHC/embed/",
    previewImage: "/images/instagram/ig-8.jpg",
    status: "published",
  },
  {
    id: "ig-9",
    order: 9,
    url: "https://www.instagram.com/p/DTH2_fXk4N2/",
    shortcode: "DTH2_fXk4N2",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS"],
    embedUrl: "https://www.instagram.com/p/DTH2_fXk4N2/embed/",
    previewImage: "/images/instagram/ig-9.jpg",
    status: "published",
  },
  {
    id: "ig-10",
    order: 10,
    url: "https://www.instagram.com/p/DaVstXnxj_f/",
    shortcode: "DaVstXnxj_f",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/DaVstXnxj_f/embed/",
    previewImage: "/images/instagram/ig-10.jpg",
    status: "published",
  },
  {
    id: "ig-11",
    order: 11,
    url: "https://www.instagram.com/p/Dd4IiYBi1dz/",
    shortcode: "Dd4IiYBi1dz",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/Dd4IiYBi1dz/embed/",
    previewImage: "/images/instagram/ig-11.jpg",
    status: "published",
  },
  {
    id: "ig-12",
    order: 12,
    url: "https://www.instagram.com/p/DUQoBxeEmxN/",
    shortcode: "DUQoBxeEmxN",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS"],
    embedUrl: "https://www.instagram.com/p/DUQoBxeEmxN/embed/",
    previewImage: "/images/instagram/ig-12.jpg",
    status: "published",
  },
  {
    id: "ig-13",
    order: 13,
    url: "https://www.instagram.com/p/DY7TtbsSFpe/",
    shortcode: "DY7TtbsSFpe",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS", "DESIGN TIPS", "TRENDS"],
    embedUrl: "https://www.instagram.com/p/DY7TtbsSFpe/embed/",
    previewImage: "/images/instagram/ig-13.jpg",
    status: "published",
  },
  {
    id: "ig-14",
    order: 14,
    url: "https://www.instagram.com/p/DfC4E6Qy92Q/",
    shortcode: "DfC4E6Qy92Q",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS"],
    embedUrl: "https://www.instagram.com/p/DfC4E6Qy92Q/embed/",
    previewImage: "/images/instagram/ig-14.jpg",
    status: "published",
  },
  {
    id: "ig-15",
    order: 15,
    url: "https://www.instagram.com/p/Dee3EFMSOKR/",
    shortcode: "Dee3EFMSOKR",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS"],
    embedUrl: "https://www.instagram.com/p/Dee3EFMSOKR/embed/",
    previewImage: "/images/instagram/ig-15.jpg",
    status: "published",
  },
  {
    id: "ig-16",
    order: 16,
    url: "https://www.instagram.com/p/DecQY-wykfC/",
    shortcode: "DecQY-wykfC",
    postType: "Reel",
    categories: ["PRODUCT HIGHLIGHTS"],
    embedUrl: "https://www.instagram.com/p/DecQY-wykfC/embed/",
    previewImage: "/images/instagram/ig-16.jpg",
    status: "published",
  },
];
