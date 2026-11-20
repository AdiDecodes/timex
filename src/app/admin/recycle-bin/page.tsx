import React from "react";
import { RecycleBinClient } from "@/components/admin/trash/RecycleBinClient";

export const metadata = {
  title: "Recycle Bin | Timex Ceramic Admin",
  description: "Restore or permanently delete archived items.",
};

export default function AdminRecycleBinPage() {
  return <RecycleBinClient />;
}
