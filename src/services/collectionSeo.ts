import { CollectionSeoData, getDefaultCollectionSeo } from "@/data/collectionSeoData";

export async function getCollectionSeoData(slug: string): Promise<CollectionSeoData> {
  const normSlug = (slug || "stone").toLowerCase().trim();
  const aliasSlug = normSlug === "colourful" ? "colorful" : normSlug === "colorful" ? "colourful" : normSlug;
  const defaultData = getDefaultCollectionSeo(normSlug);

  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const storePath = path.resolve(process.cwd(), "server/data/store.json");
      if (fs.existsSync(storePath)) {
        const content = fs.readFileSync(storePath, "utf8");
        const data = JSON.parse(content);
        let result: CollectionSeoData = { ...defaultData };

        // 1. Base collection_seo entry if configured
        if (data.collection_seo && typeof data.collection_seo === "object") {
          const seoEntry = data.collection_seo[normSlug] || data.collection_seo[aliasSlug];
          if (seoEntry) {
            result = {
              ...result,
              ...seoEntry,
            };
          }
        }

        // 2. Override from custom_categories if saved in Product Categories manager
        if (Array.isArray(data.custom_categories)) {
          const cat = data.custom_categories.find(
            (c: any) =>
              (c.slug && (c.slug.toLowerCase() === normSlug || c.slug.toLowerCase() === aliasSlug)) ||
              (c.id && (c.id.toLowerCase() === normSlug || c.id.toLowerCase() === aliasSlug))
          );
          if (cat) {
            if (cat.seoTitle) result.metaTitle = cat.seoTitle.trim();
            if (cat.metaDescription) result.metaDescription = cat.metaDescription.trim();
            if (cat.banner) result.banner = cat.banner;
            if (cat.name) result.name = cat.name;
          }
        }

        // 3. Highest priority override: store.seo_metadata (from SEO Manager)
        if (Array.isArray(data.seo_metadata)) {
          const catPath = `/product-category/${normSlug}`;
          const collPath = `/collections/${normSlug}`;
          const aliasCatPath = `/product-category/${aliasSlug}`;
          const aliasCollPath = `/collections/${aliasSlug}`;
          const custom = data.seo_metadata.find(
            (s: any) =>
              s.page_path === catPath ||
              s.page_path === collPath ||
              s.page_path === `${catPath}/` ||
              s.page_path === `${collPath}/` ||
              s.page_path === aliasCatPath ||
              s.page_path === aliasCollPath ||
              s.page_path === `${aliasCatPath}/` ||
              s.page_path === `${aliasCollPath}/`
          );
          if (custom) {
            const customTitle = (custom.seo_title || custom.meta_title || "").trim();
            const customDesc = (custom.meta_description || "").trim();
            if (customTitle) result.metaTitle = customTitle;
            if (customDesc) result.metaDescription = customDesc;
            if (custom.og_image) result.ogImage = custom.og_image;
            if (custom.banner) result.banner = custom.banner;
          }
        }

        // Match category FAQs from store.category_faqs
        if (Array.isArray(data.category_faqs)) {
          const matchingFaqs = data.category_faqs
            .filter((f: any) => {
              const cId = String(f.categoryId || f.category_id || "").toLowerCase().trim();
              const cNorm = cId.replace(/^cat-/, "");
              return (
                cId === normSlug ||
                cId === `cat-${normSlug}` ||
                cNorm === normSlug ||
                cId === aliasSlug ||
                cId === `cat-${aliasSlug}` ||
                cNorm === aliasSlug
              );
            })
            .sort((a: any, b: any) => Number(a.displayOrder || a.order || 0) - Number(b.displayOrder || b.order || 0));

          if (matchingFaqs.length > 0) {
            // Only published FAQs are returned for public display
            result.faqs = matchingFaqs
              .filter((f: any) => f.status !== "draft")
              .map((f: any, idx: number) => ({
                id: f.id || `faq-${normSlug}-${idx + 1}`,
                question: f.question,
                answer: f.answer,
                status: f.status || "published",
              }));
          }
        }

        return result;
      }
    } catch (e) {
      console.warn("Could not read store.json for collection SEO:", e);
    }
  }

  return defaultData;
}

export async function saveCollectionSeoData(slug: string, seoData: CollectionSeoData): Promise<boolean> {
  const normSlug = (slug || "stone").toLowerCase().trim();

  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const storePath = path.resolve(process.cwd(), "server/data/store.json");
      
      let store: Record<string, any> = {};
      if (fs.existsSync(storePath)) {
        const content = fs.readFileSync(storePath, "utf8");
        store = JSON.parse(content);
      }

      if (!store.collection_seo) {
        store.collection_seo = {};
      }

      store.collection_seo[normSlug] = {
        ...seoData,
        slug: normSlug,
        updated_at: new Date().toISOString(),
      };

      // Also sync to store.seo_metadata
      if (!Array.isArray(store.seo_metadata)) {
        store.seo_metadata = [];
      }
      const pagePath = `/product-category/${normSlug}`;
      const existingSeoIdx = store.seo_metadata.findIndex((s: any) => s.page_path === pagePath || s.page_path === `/collections/${normSlug}`);
      const seoRecord = {
        id: existingSeoIdx >= 0 ? store.seo_metadata[existingSeoIdx].id : `seo-${normSlug}`,
        page_path: pagePath,
        content_type: "category",
        title: seoData.name || normSlug,
        meta_title: seoData.metaTitle || seoData.title || "",
        seo_title: seoData.metaTitle || seoData.title || "",
        meta_description: seoData.metaDescription || "",
        og_title: seoData.metaTitle || seoData.title || "",
        og_description: seoData.metaDescription || "",
        og_image: seoData.banner || seoData.image || "",
        updated_at: new Date().toISOString(),
      };
      if (existingSeoIdx >= 0) {
        store.seo_metadata[existingSeoIdx] = { ...store.seo_metadata[existingSeoIdx], ...seoRecord };
      } else {
        store.seo_metadata.push(seoRecord);
      }

      // Also sync to store.custom_categories
      if (Array.isArray(store.custom_categories)) {
        const catIdx = store.custom_categories.findIndex(
          (c: any) =>
            (c.slug && c.slug.toLowerCase() === normSlug) ||
            (c.id && c.id.toLowerCase() === normSlug)
        );
        if (catIdx >= 0) {
          if (seoData.metaTitle) store.custom_categories[catIdx].seoTitle = seoData.metaTitle;
          if (seoData.metaDescription) store.custom_categories[catIdx].metaDescription = seoData.metaDescription;
        }
      }

      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
      return true;
    } catch (e) {
      console.error("Could not save store.json for collection SEO:", e);
      return false;
    }
  }

  return false;
}
