export interface MediaUsageRef {
  type: "Product" | "Blog" | "Page" | "Collection" | "SEO";
  id: string;
  name: string;
  slug?: string;
  is_trashed?: boolean;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  fileType: "image" | "svg" | "video" | "document";
  size: number; // in bytes
  dimensions?: string; // e.g. "1200 x 800"
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy?: string;
  is_trashed?: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
  altText?: string;
  caption?: string;
  usedBy?: MediaUsageRef[];
  usedByCount?: number;
}

export interface MediaStats {
  totalMedia: number;
  totalImages: number;
  totalSvgs: number;
  totalVideos: number;
  totalDocuments: number;
  totalSize: number; // in bytes
  trashedCount: number;
  recentlyUploadedCount: number;
}
