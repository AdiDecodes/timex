import React from "react";
import { VideosManagerClient } from "@/components/admin/videos/VideosManagerClient";

export const metadata = {
  title: "Watch & Choose Video Manager | Timex Ceramic Admin",
  description: "Manage all YouTube Shorts and Instagram videos for the Watch and Choose gallery.",
};

export default function AdminVideosPage() {
  return <VideosManagerClient />;
}
