export interface SpaceItem {
  id: string;
  name: string;
  slug: string;
  spaceArea: string;
  pageTitle: string;
  description: string;
  image: string;
  mediaId?: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  keywords?: string[] | string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robots?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  schemaType: string;
  schemaData: string;
  seoScore: number;
  status?: "published" | "draft";
  order?: number;
  productCount?: number;
  updatedAt?: string;
}

export const PREDEFINED_SPACES_MAP: Record<string, { name: string; slug: string }> = {
  "bathroom-tiles": { name: "Bathroom Tiles", slug: "bathroom-tiles" },
  "kitchen-tiles": { name: "Kitchen Tiles", slug: "kitchen-tiles" },
  "living-dining-room-tiles": { name: "Living & Dining Room Tiles", slug: "living-dining-room-tiles" },
  "bedroom-tiles": { name: "Bedroom Tiles", slug: "bedroom-tiles" },
  "balcony-terrace-tiles": { name: "Balcony & Terrace Tiles", slug: "balcony-terrace-tiles" },
  "elevation-exterior-tiles": { name: "Elevation & Exterior Tiles", slug: "elevation-exterior-tiles" },
  "hotel-hospitality-tiles": { name: "Hotel & Hospitality Tiles", slug: "hotel-hospitality-tiles" },
  "cafe-restaurant-tiles": { name: "Café & Restaurant Tiles", slug: "cafe-restaurant-tiles" },
  "commercial-office-tiles": { name: "Commercial & Office Tiles", slug: "commercial-office-tiles" },
  "spa-wellness-tiles": { name: "Spa & Wellness Tiles", slug: "spa-wellness-tiles" },
  "swimming-pool-tiles": { name: "Swimming Pool Tiles", slug: "swimming-pool-tiles" },
  "outdoor-landscape-tiles": { name: "Outdoor & Landscape Tiles", slug: "outdoor-landscape-tiles" },
};
