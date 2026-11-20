import React from "react";
import { MediaManagerClient } from "@/components/admin/media/MediaManagerClient";

export const metadata = {
  title: "Media Library | Timex Ceramic Admin",
  description: "Manage uploaded photographs, textures, vectors, and documents.",
};

export default function AdminMediaPage() {
  return <MediaManagerClient />;
}
