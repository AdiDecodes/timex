import React from "react";
import { PagesManagerClient } from "@/components/admin/pages/PagesManagerClient";

export const metadata = {
  title: "Pages Manager | Timex Ceramic Admin",
  description: "View and manage website pages and route alignments.",
};

export default function AdminPagesPage() {
  return <PagesManagerClient />;
}
