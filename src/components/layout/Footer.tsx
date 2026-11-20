"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useTileExpertModal } from "@/store/useTileExpertModal";
import { TalkToTileExpertModal } from "@/components/modals/TalkToTileExpertModal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const openTileExpertModal = useTileExpertModal((state) => state.openModal);

  return (
    <footer className="bg-[#101B38] text-[#EDEAE4] pt-16 pb-8 border-t border-white/10 relative z-10 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Section (3 Cols) */}
          <div className="space-y-5 lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                src="/timex-logo.png"
                alt="TIMEX CERAMIC Logo"
                width={80}
                height={88}
                className="h-12 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#FCFBF8] tracking-wide">
                TIMEX CERAMIC
              </h3>
              <span className="text-[#C95745] font-medium text-xs tracking-wide block mt-1">
                Surfaces That Define Extraordinary Spaces
              </span>
            </div>

            <p className="text-xs text-[#EDEAE4]/80 font-normal leading-relaxed">
              Timex Ceramic brings premium imported ceramic and porcelain tiles to India, combining global design trends, exceptional quality and timeless aesthetics. With 25+ years of industry experience, we offer curated tile collections for residential, commercial and architectural spaces.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/timexceramic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-[2px] border border-white/20 text-[#EDEAE4] hover:bg-[#C95745] hover:border-[#C95745] hover:text-[#FCFBF8] flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/timexceramic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-[2px] border border-white/20 text-[#EDEAE4] hover:bg-[#C95745] hover:border-[#C95745] hover:text-[#FCFBF8] flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/timex-ceramic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-[2px] border border-white/20 text-[#EDEAE4] hover:bg-[#C95745] hover:border-[#C95745] hover:text-[#FCFBF8] flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://www.pinterest.com/timexceramic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-[2px] border border-white/20 text-[#EDEAE4] hover:bg-[#C95745] hover:border-[#C95745] hover:text-[#FCFBF8] flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/timexceramic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-[2px] border border-white/20 text-[#EDEAE4] hover:bg-[#C95745] hover:border-[#C95745] hover:text-[#FCFBF8] flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-.997-1.078-1.782-2.106-2.051C19.502 3.5 12 3.5 12 3.5s-7.502 0-9.392.612c-1.028.269-1.834 1.054-2.106 2.051C.1 8.051.1 12 .1 12s0 3.949.502 5.837c.272.997 1.078 1.782 2.106 2.051C4.498 20.5 12 20.5 12 20.5s7.502 0 9.392-.612c1.028-.269 1.834-1.054 2.106-2.051.502-1.888.502-5.837.502-5.837s0-3.949-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* PRODUCTS Section (4 Cols: 3 Sub-columns for 20 Collections) */}
          <div className="space-y-4 lg:col-span-4">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#FCFBF8] border-b border-[#C95745]/40 pb-2.5 inline-block">
              PRODUCTS
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs text-[#EDEAE4]/80 font-normal pt-1">
              {/* Column 1 */}
              <ul className="space-y-2">
                <li><Link href="/product-category/brick" className="hover:text-[#C95745] transition-colors">Brick</Link></li>
                <li><Link href="/product-category/marble" className="hover:text-[#C95745] transition-colors">Marble</Link></li>
                <li><Link href="/product-category/hexagon" className="hover:text-[#C95745] transition-colors">Hexagon</Link></li>
                <li><Link href="/product-category/modular" className="hover:text-[#C95745] transition-colors">Modular</Link></li>
                <li><Link href="/product-category/stone" className="hover:text-[#C95745] transition-colors">Stone</Link></li>
                <li><Link href="/product-category/subway" className="hover:text-[#C95745] transition-colors">Subway</Link></li>
                <li><Link href="/product-category/moroccan" className="hover:text-[#C95745] transition-colors">Moroccan</Link></li>
              </ul>

              {/* Column 2 */}
              <ul className="space-y-2">
                <li><Link href="/product-category/octagonal" className="hover:text-[#C95745] transition-colors">Octagonal</Link></li>
                <li><Link href="/product-category/wooden" className="hover:text-[#C95745] transition-colors">Wooden</Link></li>
                <li>
                  <Link href="/product-category/texture" className="hover:text-[#C95745] transition-colors flex items-center space-x-1">
                    <span>Texture</span>
                    <span className="bg-[#C95745] text-[#FCFBF8] text-[8px] font-bold px-1 rounded-[2px] uppercase">NEW</span>
                  </Link>
                </li>
                <li><Link href="/product-category/colorful" className="hover:text-[#C95745] transition-colors">Colorful</Link></li>
                <li><Link href="/product-category/terrazzo" className="hover:text-[#C95745] transition-colors">Terrazzo</Link></li>
                <li><Link href="/product-category/tropical" className="hover:text-[#C95745] transition-colors">Tropical</Link></li>
                <li><Link href="/product-category/metallic" className="hover:text-[#C95745] transition-colors">Metallic</Link></li>
              </ul>

              {/* Column 3 */}
              <ul className="space-y-2">
                <li><Link href="/product-category/highlighter" className="hover:text-[#C95745] transition-colors">Highlighter</Link></li>
                <li><Link href="/product-category/white" className="hover:text-[#C95745] transition-colors">White</Link></li>
                <li><Link href="/product-category/mosaic" className="hover:text-[#C95745] transition-colors">Mosaic</Link></li>
                <li><Link href="/product-category/boutique" className="hover:text-[#C95745] transition-colors">Boutique</Link></li>
                <li><Link href="/product-category/french-frames" className="hover:text-[#C95745] transition-colors">French Frames</Link></li>
                <li><Link href="/product-category/fabric" className="hover:text-[#C95745] transition-colors">Fabric</Link></li>
              </ul>
            </div>

            <div className="pt-3">
              <Link
                href="/collections"
                className="text-[#C95745] text-xs font-semibold uppercase tracking-wider hover:text-[#FCFBF8] inline-flex items-center space-x-1.5 transition-colors group"
              >
                <span>VIEW ALL TILES</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* INFORMATION Section (2 Cols) */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#FCFBF8] border-b border-[#C95745]/40 pb-2.5 inline-block">
              INFORMATION
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EDEAE4]/80 font-normal pt-1">
              <li>
                <Link href="/about" className="hover:text-[#C95745] transition-colors">
                  About Timex Ceramic
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#C95745] transition-colors">
                  Our Collections
                </Link>
              </li>
              <li>
                <Link href="/world-of-tiles" className="hover:text-[#C95745] transition-colors">
                  World of Tiles
                </Link>
              </li>
              <li>
                <Link href="/inspiration" className="hover:text-[#C95745] transition-colors">
                  Inspiration
                </Link>
              </li>
              <li>
                <Link href="/watch-and-choose" className="hover:text-[#C95745] transition-colors flex items-center gap-1.5">
                  <span>Watch &amp; Choose</span>
                  <span className="bg-[#C95745] text-white text-[8px] font-bold px-1 rounded-[2px] uppercase">VIDEOS</span>
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-[#C95745] transition-colors">
                  Blog
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={openTileExpertModal}
                  className="w-full bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] border border-white/20 hover:border-[#C95745] px-5 py-3 rounded-[2px] text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-xs cursor-pointer group"
                >
                  <span>REQUEST A QUOTE</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* GET IN TOUCH Section (3 Cols) */}
          <div className="space-y-4 lg:col-span-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#FCFBF8] border-b border-[#C95745]/40 pb-2.5 inline-block">
              GET IN TOUCH
            </h4>
            
            <div className="space-y-3 text-xs text-[#EDEAE4]/80 font-normal pt-1">
              {/* Office Address */}
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C95745] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px] text-[#EDEAE4]/90">
                  <span className="font-semibold text-[#FCFBF8] block">Chandan Exports</span>
                  402, Pratik Avenue, Opp. Shiv Sagar Restaurant,<br />
                  Nehru Road, Vile Parle (E),<br />
                  Mumbai – 400 057, India
                </div>
              </div>

              {/* Phone */}
              <div className="pt-1 flex items-center space-x-2.5 text-xs font-medium text-[#EDEAE4]/90">
                <Phone className="w-4 h-4 text-[#C95745] flex-shrink-0" />
                <span>
                  Phone:{" "}
                  <a
                    href="tel:+912226122960"
                    className="hover:text-[#C95745] transition-colors"
                  >
                    +91 22 2612 2960
                  </a>
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2.5 text-xs font-medium text-[#EDEAE4]/90">
                <Mail className="w-4 h-4 text-[#C95745] flex-shrink-0" />
                <span>
                  Email:{" "}
                  <a
                    href="mailto:info@timexceramic.com"
                    className="hover:text-[#C95745] transition-colors"
                  >
                    info@timexceramic.com
                  </a>
                </span>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center space-x-2.5 text-xs font-medium text-[#EDEAE4]/90">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fill="#25D366"
                    d="M12.004 2C6.479 2 2 6.479 2 12.004c0 1.84.498 3.565 1.365 5.053L2 22l5.093-1.336c1.442.809 3.097 1.266 4.911 1.266 5.525 0 10.004-4.479 10.004-10.004C22.008 6.479 17.529 2 12.004 2z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.526s-.678-1.632-.929-2.235c-.244-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509c0 1.48 1.079 2.911 1.229 3.112.151.2 2.123 3.242 5.144 4.546.719.311 1.28.497 1.718.636.722.229 1.379.197 1.898.119.579-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-.15-.075-.125-.276-.2-.577-.35z"
                  />
                </svg>
                <span>
                  WhatsApp:{" "}
                  <a
                    href="https://api.whatsapp.com/send/?phone=919323777787&text=Hello%21+I+found+Timex+Ceramic+through+your+website+and+I%27m+interested+in+your+premium+tile+collection.+Please+share+your+latest+catalogue%2C+pricing%2C+available+sizes%2C+finishes%2C+and+help+me+choose+the+right+tiles+for+my+project.+I+would+also+like+to+know+about+product+availability+and+delivery+timelines.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C95745] transition-colors"
                  >
                    +91 93237 77787
                  </a>
                </span>
              </div>
            </div>

            {/* Footer CTA Button triggering Popup Modal */}
            <div className="pt-2">
              <button
                type="button"
                onClick={openTileExpertModal}
                className="w-full bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] border border-white/20 hover:border-[#C95745] px-5 py-3 rounded-[2px] text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-xs cursor-pointer group"
              >
                <span>CONNECT WITH OUR TILE EXPERTS</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Subfooter Copyright Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#EDEAE4]/70 font-normal space-y-4 md:space-y-0">
          <div>
            &copy; {currentYear} Timex Ceramic. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/disclaimer" className="hover:text-[#C95745] transition-colors">
              Disclaimer
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/sitemap" className="hover:text-[#C95745] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Global Talk to a Tile Expert Popup Modal */}
      <TalkToTileExpertModal />
    </footer>
  );
}
