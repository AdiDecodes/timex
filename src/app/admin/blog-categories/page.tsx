import React from "react";
import { BlogCategoriesManagerClient } from "@/components/admin/categories/BlogCategoriesManagerClient";

export const metadata = {
  title: "Blog Categories | Timex Ceramic Admin",
  description: "Manage editorial blog categories, topic metadata, and visual banners.",
};

export default function AdminBlogCategoriesPage() {
  return <BlogCategoriesManagerClient />;
}
