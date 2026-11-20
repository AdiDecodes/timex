import { prisma, getDbStatus } from "@/lib/prisma";

// Fallback high-end mock assets for luxury design system
const DEFAULT_CONFIGS: Record<string, any> = {
  HOMEPAGE_HERO: {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-elegant-minimalist-decor-41712-large.mp4",
    fallbackImage: "/images/banners/hero.webp",
    titlePrimary: "ELEGANCE IN EVERY SURFACE",
    titleSecondary: "Crafting International Premium Ceramic Slabs & Luxury Tiles",
    ctaText: "Explore Collections",
    ctaLink: "/products",
    visualiserCtaText: "Virtual Visualiser",
    visualiserCtaLink: "/visualiser",
  },
  HOMEPAGE_COLLECTIONS: [
    {
      id: "coll-1",
      name: "Italian Marble Look",
      slug: "marble-look",
      desc: "Ultra-glossy surfaces mimicking rare Carrara and Calacatta veins.",
      image: "/images/collections/stone.svg",
    },
    {
      id: "coll-2",
      name: "Royal Wood Grain",
      slug: "wood-grain",
      desc: "Impeccably detailed textures delivering wood warmth with vitrified durability.",
      image: "/images/collections/wooden.svg",
    },
    {
      id: "coll-3",
      name: "Minimalist Concrete",
      slug: "concrete-slabs",
      desc: "Raw, industrial, and refined matte finishes designed for architectural depth.",
      image: "/images/collections/stone.svg",
    },
  ],
  HOMEPAGE_SPACES: [
    { name: "Bathrooms", image: "/images/spaces/bathroom.svg", href: "/products?room=bathroom" },
    { name: "Living Rooms", image: "/images/spaces/living-room.svg", href: "/products?room=living-room" },
    { name: "Kitchens", image: "/images/spaces/kitchen.svg", href: "/products?room=kitchen" },
    { name: "Outdoors", image: "/images/spaces/outdoor.svg", href: "/products?room=outdoor" },
  ],
  HOMEPAGE_TESTIMONIALS: [
    {
      id: "1",
      quote: "Timex Ceramic slabs transformed our penthouse design. The high-gloss marble shine is indistinguishable from real Italian quarry stone, and installation was incredibly smooth.",
      author: "Rajesh Malhotra",
      role: "Lead Architect, Malhotra & Partners",
    },
    {
      id: "2",
      quote: "The durability of their anti-skid outdoor tiles exceeded our expectations for the commercial plaza project. Exceptional aesthetics combined with engineering excellence.",
      author: "Priya Sharma",
      role: "Director of Projects, Oberoi Designs",
    },
  ],
};

export async function getCMSConfig(key: string): Promise<any> {
  if (!getDbStatus()) {
    return DEFAULT_CONFIGS[key] || null;
  }
  try {
    const config = await prisma.cMSConfig.findUnique({
      where: { key },
    });
    if (config && config.value) {
      return config.value;
    }
  } catch (error) {
    // If DB is not migrated/ready, fail silently and return defaults
    console.warn(`CMS key "${key}" reading failed, falling back to static config:`, error);
  }
  return DEFAULT_CONFIGS[key] || null;
}

export async function updateCMSConfig(key: string, value: any): Promise<boolean> {
  try {
    await prisma.cMSConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return true;
  } catch (error) {
    console.error(`Failed to update CMS key "${key}":`, error);
    return false;
  }
}
