"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import Card from "@/components/ui/Card";
import {
  Calendar,
  Clock,
  Share2,
  Check,
  Quote,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface BlogDetailClientProps {
  post: any;
  relatedPosts: any[];
}

export function BlogDetailClient({ post: initialPost, relatedPosts }: BlogDetailClientProps) {
  const [post, setPost] = useState(initialPost);

  // Live Database Rehydration: ensures blog edits in /admin appear immediately
  useEffect(() => {
    const slug = initialPost?.slug || (initialPost as any)?.id;
    if (slug) {
      fetch(`/api/v1/blogs/${slug}?_t=` + Date.now())
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.blog) {
            setPost(data.blog);
          }
        })
        .catch(() => {});
    }
  }, [initialPost?.slug, (initialPost as any)?.id]);

  // Dynamically update document title & meta description
  useEffect(() => {
    if (post?.metaTitle || post?.title) {
      document.title = post.metaTitle || `${post.title} | Timex Ceramic Blog`;
    }
    if (post?.metaDescription || post?.excerpt) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", post.metaDescription || post.excerpt || "");
      }
    }
  }, [post?.metaTitle, post?.title, post?.metaDescription, post?.excerpt]);

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article className="min-h-screen bg-[#F7F5F0] pb-24">
      {/* 1. Header Banner & Breadcrumbs */}
      <section className="bg-[#101B38] text-[#FCFBF8] pt-24 pb-20 relative overflow-hidden border-b border-[#101B38]">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-[10px] uppercase font-medium tracking-widest text-[#EDEAE4]/70">
            <Link href="/" className="hover:text-[#C95745] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-[#C95745] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#C95745] truncate max-w-[200px]">{post.category}</span>
          </nav>

          {/* Category Pill & Reading Time */}
          <div className="flex items-center space-x-3 text-[10px] font-medium uppercase tracking-widest">
            <span className="bg-[#C95745] text-[#FCFBF8] px-3.5 py-1 rounded-[2px]">
              {post.category}
            </span>
            <span className="text-[#EDEAE4]/80 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#C95745]" />
              <span>{post.readTime}</span>
            </span>
            <span className="text-[#EDEAE4]/40">•</span>
            <span className="text-[#EDEAE4]/80 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#C95745]" />
              <span>{post.date}</span>
            </span>
          </div>

          {/* Article Title & Excerpt */}
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#FCFBF8] leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm md:text-base text-[#EDEAE4]/80 font-light leading-relaxed max-w-3xl">
            {post.subtitle || post.excerpt}
          </p>

          {/* Author Bar & Share Actions */}
          <div className="pt-6 border-t border-[#EDEAE4]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt={post.author?.name || "Author"}
                className="w-12 h-12 rounded-[2px] object-cover border border-[#EDEAE4]/30"
              />
              <div>
                <p className="text-sm font-medium text-[#FCFBF8]">{post.author?.name || "Timex Editorial"}</p>
                <p className="text-xs text-[#EDEAE4]/60 font-light">{post.author?.role || "Editorial Desk"}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-[2px] bg-[#FCFBF8]/10 border border-[#FCFBF8]/20 hover:bg-[#FCFBF8] hover:text-[#101B38] text-xs font-medium text-[#FCFBF8] transition-colors flex items-center space-x-2 cursor-pointer"
                title="Copy Article Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied!" : "Share Link"}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-[2px] bg-[#FCFBF8]/10 border border-[#FCFBF8]/20 hover:bg-[#C95745] text-[#FCFBF8] transition-colors cursor-pointer"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.156 4.229 4.29-1.127z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Article Content Container */}
      <section className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        {/* Main Cover Image Frame */}
        <div className="relative h-[320px] md:h-[480px] w-full rounded-[2px] overflow-hidden shadow-md border-4 border-[#FCFBF8] bg-[#EDEAE4] mb-12">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>

        {/* Key Takeaways Callout Box */}
        {post.content?.keyTakeaways && (
          <div className="mb-12 p-8 md:p-10 bg-[#EDEAE4] rounded-[2px] border border-[#DED9D0] space-y-4">
            <div className="flex items-center space-x-2 text-[#C95745] font-semibold uppercase text-[10px] tracking-[0.25em]">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Key Takeaways</span>
            </div>
            <ul className="space-y-3 font-sans text-xs md:text-sm text-[#101B38]">
              {Array.isArray(post.content?.keyTakeaways) && post.content.keyTakeaways.map((item: string, i: number) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C95745] mt-2 flex-shrink-0" />
                  <span className="leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rich Blog Content */}
        {typeof post?.content === "string" && post.content.trim().length > 0 ? (
          <div
            className="prose max-w-none mb-16 text-[#333333] font-sans leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-[#101B38] [&>h2]:border-l-4 [&>h2]:border-[#C95745] [&>h2]:pl-4 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-[#101B38] [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-base [&>p]:leading-relaxed [&>p]:font-light [&>p]:text-[#333333]/80 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#101B38] [&>blockquote]:bg-[#EDEAE4] [&>blockquote]:p-6 [&>blockquote]:rounded-[2px] [&>blockquote]:italic [&>blockquote]:text-[#101B38] [&>blockquote]:my-6 [&>img]:rounded-[2px] [&>img]:shadow-sm [&>img]:my-8 [&>img]:w-full [&>img]:max-h-[500px] [&>img]:object-cover [&>a]:text-[#C95745] [&>a]:underline [&>strong]:text-[#101B38] [&>strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <>
            {/* Article Intro Paragraph */}
            {(() => {
              const intro = (post?.content as any)?.intro || post?.excerpt || "";
              if (!intro) return null;
              return (
                <div className="prose max-w-none mb-12">
                  <p className="font-sans text-base md:text-lg text-[#333333] leading-relaxed font-light">
                    <span className="float-left text-5xl font-serif font-bold text-[#101B38] mr-3 leading-none">
                      {intro.charAt(0)}
                    </span>
                    {intro.slice(1)}
                  </p>
                </div>
              );
            })()}

            {/* Article Content Sections */}
            {Array.isArray((post?.content as any)?.sections) && (post.content as any).sections.length > 0 && (
              <div className="space-y-16">
                {(post.content as any).sections.map((sec: any, idx: number) => (
                  <Reveal key={idx} direction="up" delay={idx * 0.1}>
                    <div className="space-y-6">
                      <div className="space-y-2 border-l-4 border-[#C95745] pl-4">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#101B38]">
                          {sec.heading}
                        </h2>
                        {sec.subheading && (
                          <p className="text-xs text-[#C95745] font-semibold uppercase tracking-wider">
                            {sec.subheading}
                          </p>
                        )}
                      </div>

                      {Array.isArray(sec.body) && sec.body.map((p: string, pIdx: number) => (
                        <p key={pIdx} className="text-sm md:text-base text-[#333333]/80 font-light leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {/* Editorial Pull Quote */}
                      {sec.quote && (
                        <div className="my-8 p-8 bg-[#EDEAE4] rounded-[2px] border-l-4 border-[#101B38] flex space-x-4 italic text-[#101B38]">
                          <Quote className="w-8 h-8 text-[#C95745] flex-shrink-0" />
                          <p className="font-serif text-base md:text-lg font-semibold leading-relaxed">
                            &ldquo;{sec.quote}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Section Illustrative Image */}
                      {sec.image && (
                        <div className="space-y-2 my-8">
                          <div className="relative h-[300px] md:h-[420px] w-full rounded-[2px] overflow-hidden shadow-xs bg-[#EDEAE4]">
                            <Image src={sec.image} alt={sec.heading} fill className="object-cover" />
                          </div>
                          {sec.imageCaption && (
                            <p className="text-[11px] text-[#333333]/60 font-light text-center italic">
                              {sec.imageCaption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        {/* Featured Products Spotlight */}
        {post.featuredProducts && post.featuredProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EDEAE4] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#C95745] tracking-[0.25em] uppercase block">
                Featured Surfaces in this Article
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#101B38]">Featured Surface Products</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.isArray(post.featuredProducts) && post.featuredProducts.map((prod: any) => (
                <Card
                  key={prod.slug}
                  className="p-4 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] flex space-x-4 items-center shadow-xs hover:border-[#101B38]/30 transition-all"
                >
                  <div className="w-20 h-20 bg-[#EDEAE4] rounded-[2px] overflow-hidden flex-shrink-0 relative border border-[#EDEAE4]">
                    <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] text-[#101B38] font-mono font-medium uppercase">{prod.code}</span>
                    <h4 className="font-serif text-base font-bold text-[#101B38]">{prod.name}</h4>
                    <p className="text-[10px] text-[#C95745] font-semibold uppercase tracking-wider">Price on Request</p>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="group/spec inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#101B38] hover:text-[#C95745] pb-1 border-b border-[#EDEAE4] hover:border-[#C95745] uppercase tracking-wider pt-1 transition-colors font-sans"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="w-3 h-3 group-hover/spec:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trade Consultation CTA */}
        <div className="mt-16 p-8 md:p-12 bg-[#101B38] text-[#FCFBF8] rounded-[2px] shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 border border-[#101B38]">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[9px] text-[#C95745] font-semibold tracking-[0.25em] uppercase block">
              Architectural Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FCFBF8]">Planning a Surface Specification?</h3>
            <p className="text-xs text-[#EDEAE4]/80 font-light max-w-md leading-relaxed">
              Consult with our surface design specialists to receive physically mounted sample boards, high-res texture BIM blocks, or custom price quotes.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#FCFBF8] hover:text-[#C95745] pb-2 border-b border-[#EDEAE4]/35 hover:border-[#C95745] uppercase tracking-wider transition-colors whitespace-nowrap font-sans"
          >
            <span>Consult Design Team</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* 3. Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#EDEAE4] space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#101B38]">More Articles to Explore</h3>
              <Link
                href="/blogs"
                className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] inline-flex items-center gap-1.5 pb-1.5 border-b border-[#EDEAE4] hover:border-[#C95745] transition-colors uppercase tracking-wider font-sans"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rel) => (
                <Link key={rel.slug} href={`/blogs/${rel.slug}`} className="block group">
                  <Card className="p-6 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-xs hover:border-[#101B38]/30 transition-all space-y-4">
                    <div className="relative h-48 w-full rounded-[2px] overflow-hidden bg-[#EDEAE4]">
                      <Image src={rel.coverImage} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] text-[#C95745] font-semibold uppercase tracking-widest">{rel.category}</span>
                      <h4 className="font-serif text-xl font-bold text-[#101B38] group-hover:text-[#C95745] transition-colors">{rel.title}</h4>
                      <p className="text-xs text-[#333333]/70 font-light line-clamp-2">{rel.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
