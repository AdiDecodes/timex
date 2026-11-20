import React from "react";
import { DashboardOverviewClient } from "@/components/admin/DashboardOverviewClient";

export const metadata = {
  title: "Admin Dashboard | Timex Ceramic",
  description: "Executive control center for products, blogs, media, SEO, and enquiries.",
};

export default function AdminPage() {
  return <DashboardOverviewClient />;
}
