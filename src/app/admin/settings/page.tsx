import React from "react";
import { SettingsManagerClient } from "@/components/admin/SettingsManagerClient";

export const metadata = {
  title: "Administrator Settings | Timex Ceramic Admin",
  description: "Manage credentials, encryption standards, and server environment.",
};

export default function AdminSettingsPage() {
  return <SettingsManagerClient />;
}
