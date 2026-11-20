import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryDrawer } from "@/components/enquiry/EnquiryDrawer";
import { ExploreTilesMegaMenuSection } from "@/components/home/ExploreTilesMegaMenuSection";
import { LiveSeoUpdater } from "@/components/seo/LiveSeoUpdater";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <LiveSeoUpdater />
      <Header />
      <main className="flex-grow">{children}</main>
      <ExploreTilesMegaMenuSection />
      <Footer />
      <EnquiryDrawer />
      <MobileBottomNav />
    </div>
  );
}
