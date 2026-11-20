export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      subheading?: string;
      body: string[];
      quote?: string;
      image?: string;
      imageCaption?: string;
    }[];
    keyTakeaways: string[];
  };
  featuredProducts?: {
    name: string;
    code: string;
    slug: string;
    image: string;
    price: number;
    category: string;
  }[];
  tags: string[];
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  updatedAt?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "curated-chaos-unexpected-red",
    title: "Curated Chaos: Why Unexpected Red Needs a Silent Partner",
    subtitle: "Beyond minimalism: the art of the unexpected red minimalism in modern interiors.",
    category: "TRENDS",
    date: "May 18, 2024",
    readTime: "5 Min Read",
    author: {
      name: "Elena Vance",
      role: "Senior Architectural Stylist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Beyond minimalism: the art of the unexpected red minimalism, for a long time, has been the safe choice. We've been conditioned to believe that clean means luxury.",
    content: {
      intro:
        "Beyond minimalism: the art of the unexpected red minimalism, for a long time, has been the safe choice. We've been conditioned to believe that clean means luxury.",
      sections: [
        {
          heading: "1. The Power of Accent Color Balance",
          body: [
            "Unexpected red accents create instant dramatic tension when paired with warm neutral tile grounds, turning ordinary spaces into curated architectural statements."
          ]
        }
      ],
      keyTakeaways: ["Balance bold primary accents with neutral ceramic grounds.", "Use satin glazed finishes for tactile warmth."]
    },
    tags: ["TRENDS", "Red Tiles", "Color Palette", "Interior Architecture"]
  },
  {
    slug: "language-of-colour-room-emotion",
    title: "The Language of Colour: How to Choose Your Room's Emotion",
    subtitle: "Before we notice texture or form, we feel colour in architectural spaces.",
    category: "DESIGN TIPS",
    date: "May 12, 2024",
    readTime: "6 Min Read",
    author: {
      name: "Sophia Chen",
      role: "Senior Interior Architect",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Before we notice texture or form, we feel colour. It is instinctive, emotional, and immediate. The blue that slows your heart rate.",
    content: {
      intro:
        "Before we notice texture or form, we feel colour. It is instinctive, emotional, and immediate. The blue that slows your heart rate.",
      sections: [
        {
          heading: "1. Color Psychology in Spatial Design",
          body: [
            "Subtle hues and artisanal finishes dictate how light interacts with living spaces, fostering tranquility in bedrooms and vitality in social lounges."
          ]
        }
      ],
      keyTakeaways: ["Select wall tile glazes based on psychological atmosphere.", "Use silk matte glazes to minimize harsh glare."]
    },
    tags: ["DESIGN TIPS", "Color Psychology", "Interior Design", "Living Room"]
  },
  {
    slug: "timeless-motifs-basketweave-checkerboard",
    title: "Timeless Motifs, Modern Masterpieces: Basketweave & Checkerboard Reimagined",
    subtitle: "Some patterns don't merely decorate a space, they organize it.",
    category: "MATERIALS",
    date: "May 05, 2024",
    readTime: "7 Min Read",
    author: {
      name: "Rajesh Malhotra",
      role: "Technical Surfaces Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Some patterns don't merely decorate a space, they organize it. The checkerboard floors of old cafés and Parisian bistros reimagined for modern homes.",
    content: {
      intro:
        "Some patterns don't merely decorate a space, they organize it. The checkerboard floors of old cafés and Parisian bistros reimagined for modern homes.",
      sections: [
        {
          heading: "1. Heritage Geometry Meets Modern Vitrified Precision",
          body: [
            "Classic herringbone, subway offset, and basketweave layouts bring architectural cadence and rhythm to kitchen backsplashes and master baths."
          ]
        }
      ],
      keyTakeaways: ["Reimagine classic key-dot and checkerboard patterns with porcelain slabs.", "Use contrasting epoxy grouts for crisp geometric definitions."]
    },
    tags: ["MATERIALS", "Subway Tiles", "Basketweave", "Checkerboard"]
  },
  {
    slug: "2026-tile-design-trends",
    title: "2026 Architectural Tile Trends: Large-Format Slabs & 3D Tactile Reliefs",
    subtitle: "From Milan Design Week highlights to luxury penthouse installations across Mumbai and Dubai.",
    category: "SPACES",
    date: "July 12, 2026",
    readTime: "6 Min Read",
    author: {
      name: "Elena Vance",
      role: "Senior Architectural Stylist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    excerpt: "Discover how large-format vitrified porcelain and textured 3D wall reliefs are taking center stage in luxury penthouses and high-end hospitality venues.",
    content: {
      intro:
        "Architectural surfaces are experiencing a fundamental renaissance in 2026. The shift from standard grid tiling to continuous, seamless vitrified slabs and tactile 3D relief tiles has redefined how interior designers approach space, light, and texture.",
      sections: [
        {
          heading: "1. The Rise of Seamless Slabs",
          body: ["Fewer grout joints translate directly into expansive visual harmony."]
        }
      ],
      keyTakeaways: ["Specify oversized vitrified slabs to eliminate visual clutter."]
    },
    tags: ["PROJECTS", "Vitrified Slabs", "Italian Design"]
  },
  {
    slug: "how-to-choose-bathroom-tiles",
    title: "The Ultimate Guide: How to Select Perfect Bathroom Tiles",
    subtitle: "A practical guide covering anti-skid ratings (R10/R11), zero-absorption porcelain, and space expansion tricks.",
    category: "DESIGN TIPS",
    date: "June 28, 2026",
    readTime: "5 Min Read",
    author: {
      name: "Rajesh Malhotra",
      role: "Technical Surfaces Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    excerpt: "A comprehensive guide on slip-resistance rating (PEI / R-value), waterproofing, and choosing colors for small bathrooms.",
    content: {
      intro:
        "Selecting tiles for a wet environment requires balancing aesthetics with technical performance. Bathrooms present unique environmental challenges—constant water exposure, steam humidity, chemical cleaners, and slip hazards.",
      sections: [
        {
          heading: "1. Understanding Anti-Skid Ratings (R-Value)",
          body: [
            "For shower floors and wet areas, safety is non-negotiable. Always verify the R-rating of your floor tiles. An R10 or R11 anti-skid surface finish provides sufficient micro-grip when wet."
          ]
        }
      ],
      keyTakeaways: ["Use R10/R11 anti-skid vitrified tiles on shower floor zones."]
    },
    tags: ["Bathroom Tiles", "Anti-Skid", "Porcelain Guide", "Safety"]
  },
  {
    slug: "moroccan-accent-walls",
    title: "The Timeless Allure of Moroccan Art Tiles in Contemporary Living",
    subtitle: "Bringing vibrant handcrafted Mediterranean patterns into modern minimalist homes.",
    category: "Installation Tips",
    date: "May 15, 2026",
    readTime: "4 min read",
    author: {
      name: "Sophia Chen",
      role: "Senior Interior Architect",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    excerpt: "Learn how to introduce Moroccan patterned ceramic and boutique art tiles to create beautiful focal points in kitchens and courtyard patios.",
    content: {
      intro:
        "Moroccan tiles bring historic geometric intricacy and rich Mediterranean colorways into modern spaces. Used strategically as kitchen backsplashes, dining feature walls, or outdoor patio accents, Moroccan ceramic patterns break monochrome monotony with artistic personality.",
      sections: [
        {
          heading: "1. The Focal Wall Rule in Kitchen Backsplashes",
          body: [
            "When using bold geometric Moroccan patterns, allow the tiles to be the undisputed hero element. Pair them with neutral quartz countertops and matte flat-panel cabinetry to maintain visual equilibrium.",
            "Timex Moroccan tile collections feature high-precision digital glaze rendering, reproducing authentic hand-painted zellige variation with modern stain resistance."
          ]
        }
      ],
      keyTakeaways: [
        "Limit vibrant Moroccan patterns to single focal walls to prevent visual overwhelm.",
        "Match grout color to the background tile tone to make complex geometric patterns pop.",
        "Seal outdoor tile joints with epoxy grout for zero discoloration under sunlight."
      ]
    },
    tags: ["Moroccan Tiles", "Backsplash", "Kitchen Design", "Artisan"]
  }
];
