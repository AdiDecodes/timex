import React from "react";
import { EnquiriesManagerClient } from "@/components/admin/EnquiriesManagerClient";

export const metadata = {
  title: "Customer Enquiries | Timex Ceramic Admin",
  description: "View and manage incoming customer leads and sample requests.",
};

export default function AdminEnquiriesPage() {
  return <EnquiriesManagerClient />;
}
