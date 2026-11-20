import React from "react";
import { ColorsManagerClient } from "@/components/admin/colors/ColorsManagerClient";

export const metadata = {
  title: "Color Management | Timex Ceramic Admin",
  description: "Manage tile colors dynamically for product specifications and the frontend BY COLOR mega menu.",
};

export default function AdminColorsPage() {
  return <ColorsManagerClient />;
}
