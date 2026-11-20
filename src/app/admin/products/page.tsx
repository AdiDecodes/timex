import React from "react";
import { ProductsManagerClient } from "@/components/admin/ProductsManagerClient";

export const metadata = {
  title: "Products Management | Timex Ceramic Admin",
  description: "Manage tile catalogue, dimensions, finishes, packaging, and color swatches.",
};

export default function AdminProductsPage() {
  return <ProductsManagerClient />;
}
