import { BLOG_POSTS, BlogPost } from "@/data/blogs";

export interface BlogFilterInput {
  search?: string;
  category?: string;
  status?: string;
  includeTrashed?: boolean;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStoredBlogs(): any[] {
  if (typeof window === "undefined") {
    try {
      const fs = eval("require")("fs");
      const path = eval("require")("path");
      const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const storePath = (isServerless && fs.existsSync("/tmp/data/store.json"))
        ? "/tmp/data/store.json"
        : path.resolve(process.cwd(), "server/data/store.json");
      if (fs.existsSync(storePath)) {
        const content = fs.readFileSync(storePath, "utf8");
        const data = JSON.parse(content);
        if (Array.isArray(data.blogs) && data.blogs.length > 0) {
          return data.blogs;
        }
      }
    } catch (e) {
      console.warn("Could not read store.json in getStoredBlogs:", e);
    }
  }
  return BLOG_POSTS;
}

export async function getBlogs(filters?: BlogFilterInput): Promise<any[]> {
  const blogs = getStoredBlogs();
  let result = blogs.filter((b) => {
    if (!filters?.includeTrashed && (b.is_trashed || b.isTrashed)) return false;
    return true;
  });

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.subtitle?.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.slug?.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== "ALL") {
      const cat = filters.category.toLowerCase().trim();
      result = result.filter((b) => b.category?.toLowerCase().trim() === cat);
    }
    if (filters.status && filters.status !== "ALL") {
      const st = filters.status.toLowerCase().trim();
      result = result.filter((b) => (b.status || "Published").toLowerCase().trim() === st);
    }
  }

  return result;
}

export async function getBlogBySlug(slug: string, includeTrashed = false): Promise<any | null> {
  const norm = (slug || "").toString().toLowerCase().trim();
  if (!norm) return null;

  const blogs = getStoredBlogs();
  const found = blogs.find(
    (b) =>
      b.slug?.toLowerCase().trim() === norm ||
      b.id?.toLowerCase().trim() === norm
  );

  if (!found) return null;
  if (!includeTrashed && (found.is_trashed || found.isTrashed)) return null;
  return found;
}
