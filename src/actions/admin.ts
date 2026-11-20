import { updateCMSConfig } from "@/services/cms";
import { CollectionSeoData } from "@/data/collectionSeoData";
import { getCollectionSeoData, saveCollectionSeoData } from "@/services/collectionSeo";

export async function resolveInquiry(_id: string, _status: string) {
  return { success: true };
}

export async function updateCMSHero(config: {
  videoUrl: string;
  fallbackImage: string;
  titlePrimary: string;
  titleSecondary: string;
  ctaText: string;
  ctaLink: string;
}) {
  try {
    const success = await updateCMSConfig("HOMEPAGE_HERO", config);
    return { success };
  } catch {
    return { success: false, error: "Failed to update CMS config." };
  }
}

export async function getAuditLogs() {
  return [];
}

export async function getCollectionSeoAction(slug: string): Promise<CollectionSeoData> {
  return getCollectionSeoData(slug);
}

export async function saveCollectionSeoAction(slug: string, data: CollectionSeoData) {
  try {
    const success = await saveCollectionSeoData(slug, data);
    return { success };
  } catch (error) {
    console.error("Failed to save collection SEO action:", error);
    return { success: false, error: "Failed to save collection SEO content." };
  }
}
