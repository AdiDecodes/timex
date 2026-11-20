import type { Metadata } from "next";
import { WatchAndChooseClient } from "@/components/watch-and-choose/WatchAndChooseClient";

export const metadata: Metadata = {
  title: "Watch and Choose | Tile Videos, Design Ideas & Inspiration – Timex Ceramic",
  description:
    "Explore tile videos, product highlights, design tips, trends and real-space inspiration through YouTube Shorts and Instagram Reels at Timex Ceramic.",
  alternates: {
    canonical: "/watch-and-choose",
  },
  openGraph: {
    title: "Watch and Choose | Tile Videos, Design Ideas & Inspiration – Timex Ceramic",
    description:
      "Explore tile videos, product highlights, design tips, trends and real-space inspiration through YouTube Shorts and Instagram Reels at Timex Ceramic.",
    url: "/watch-and-choose",
    siteName: "Timex Ceramic",
    type: "website",
    images: [
      {
        url: "/images/instagram/ig-1.jpg",
        width: 1080,
        height: 1920,
        alt: "Timex Ceramic Watch and Choose Video Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch and Choose | Tile Videos, Design Ideas & Inspiration – Timex Ceramic",
    description:
      "Explore tile videos, product highlights, design tips, trends and real-space inspiration through YouTube Shorts and Instagram Reels at Timex Ceramic.",
  },
};

export default function WatchAndChoosePage() {
  return <WatchAndChooseClient />;
}
