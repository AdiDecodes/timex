import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/disclaimer");
  return buildPageMetadata({
    ...seo,
    title: seo.title || "Disclaimer | Timex Ceramic",
    description:
      seo.description ||
      "Disclaimer, limitation of liability, and website terms of use for Timex Ceramic.",
    canonicalUrl: seo.canonicalUrl || "https://www.timexceramic.com/disclaimer",
  });
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#333333] pt-28 pb-20 px-6 md:px-10 selection:bg-[#C95745] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-8 md:p-14 shadow-xs">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#C95745] hover:text-[#101B38] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="space-y-3 pb-6 border-b border-[#EDEAE4]">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-[1px] bg-[#C95745]"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C95745] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Legal Notice</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#101B38] tracking-tight">
            Disclaimer
          </h1>
        </div>

        {/* Disclaimer Content */}
        <div className="space-y-6 text-sm sm:text-base text-[#101B38] leading-relaxed">
          {/* Paragraph 1 */}
          <p className="font-semibold text-justify sm:text-left">
            All ideas and/or information provided or gained from this site would not necessarily reflect the views of TIMEX CERAMIC or its directors or employees.
          </p>

          {/* Paragraph 2 */}
          <p className="font-semibold text-justify sm:text-left">
            The materials and/or information available or obtained at/through this site (timexceramic.com) is/are not guaranteed or warranted in terms of completeness, correctness, accuracy, reliability or otherwise howsoever by TIMEX CERAMIC or its directors or employees.
          </p>

          {/* NIL LIABILITY Section */}
          <div className="pt-4 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] tracking-tight pt-2 border-t border-[#EDEAE4]">
              NIL LIABILITY
            </h2>

            {/* Paragraph 3 */}
            <p className="font-semibold text-justify sm:text-left">
              Under no circumstances, including but not limited to negligence, shall TIMEX CERAMIC or its directors or employees be liable for any special or consequential damages that are alleged to have resulted from the use and/or inability to use this site or information contained within, even if Timex and/or its employees or directors have been notified of the possibilities of potential damages or losses.
            </p>

            {/* Paragraph 4 */}
            <p className="font-semibold text-justify sm:text-left">
              In no case shall TIMEX CERAMIC or its directors or employees be liable to any person or entity for any damages or losses resulting either directly or indirectly from accessing this site. The information provided herein and any communications subsequently entertained or responded to are/shall be gratis an are/shall be outside the purview of any consumer protection law. Any recipient or user of any information or material in this site may use/rely upon the information or material entirely at his/its own risk.
            </p>

            {/* Paragraph 5 */}
            <p className="font-semibold text-justify sm:text-left">
              The contents of this site shall not be reproduced, distributed or published in whole or in part by the recipient hereof or any other person for any purpose without the prior written approval of TIMEX CERAMIC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
