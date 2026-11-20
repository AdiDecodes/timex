import React from "react";
import { SeoManagerClient } from "@/components/admin/seo/SeoManagerClient";

export const metadata = {
  title: "SEO Management Engine | Timex Ceramic Admin",
  description: "Comprehensive SEO tooling, schema management, sitemaps, robots.txt, and redirects.",
};

export default function AdminSeoPage() {
  return <SeoManagerClient />;
}
