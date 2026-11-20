import React from "react";
import { BlogsManagerClient } from "@/components/admin/BlogsManagerClient";

export const metadata = {
  title: "Blog Management | Timex Ceramic Admin",
  description: "Publish architectural journal articles, trends, and design insights.",
};

export default function AdminBlogPage() {
  return <BlogsManagerClient />;
}
