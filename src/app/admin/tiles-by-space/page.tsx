import React from "react";
import { TilesBySpaceManagerClient } from "@/components/admin/spaces/TilesBySpaceManagerClient";

export const metadata = {
  title: "Tiles by Space Management | Timex Ceramic Admin",
  description: "Manage visual banners, direct routes, and SEO metadata for all 16 space collections.",
};

export default function AdminTilesBySpacePage() {
  return <TilesBySpaceManagerClient />;
}
