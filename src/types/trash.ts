export type TrashEntityType = "Product" | "Blog" | "Media" | "Page";

export interface TrashItem {
  id: string;
  name: string;
  type: TrashEntityType;
  originalCategory?: string;
  deleted_at: string;
  deleted_by?: string;
  previewUrl?: string;
  slug?: string;
  code?: string;
  details?: Record<string, any>;
  usedByCount?: number;
  usedByNames?: string[];
  safeToDelete?: boolean;
}

export interface TrashStats {
  total: number;
  products: number;
  blogs: number;
  media: number;
  pages: number;
}
