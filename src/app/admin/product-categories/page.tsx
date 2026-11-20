import React from "react";
import { ProductCategoriesManagerClient } from "@/components/admin/categories/ProductCategoriesManagerClient";

export const metadata = {
  title: "Product Categories | Timex Ceramic Admin",
  description: "Manage product categories, subcategory relationships, media banners, and SEO metadata.",
};

export default function AdminProductCategoriesPage() {
  return <ProductCategoriesManagerClient />;
}
