import React, { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Timex Ceramic",
  description: "Secure Administrator Portal Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#c5a880] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
