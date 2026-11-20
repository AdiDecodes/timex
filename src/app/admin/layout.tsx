import React from "react";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";


export const metadata = {
  title: "Admin Portal | Timex Ceramic",
  description: "Secure Content Management System for Timex Ceramic.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
