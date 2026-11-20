import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogs, getBlogBySlug } from "@/services/blog";
import { Reveal } from "@/components/animations/Reveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { BlogDetailClient } from "./BlogDetailClient";

import type { Metadata } from "next";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateStaticParams() {
  const blogs = await getBlogs();
  const { BLOG_POSTS } = await import("@/data/blogs");
  const slugSet = new Set<string>();
  blogs.forEach((b) => b.slug && slugSet.add(b.slug));
  BLOG_POSTS.forEach((b) => b.slug && slugSet.add(b.slug));
  return Array.from(slugSet).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const seo = await getSeoMetadata(`/blogs/${resolvedParams.slug}`);
  return buildPageMetadata(seo);
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const seo = await getSeoMetadata(`/blogs/${resolvedParams.slug}`);

  // Related articles
  const allBlogs = await getBlogs();
  const relatedPosts = allBlogs.filter((p) => p.slug !== post.slug).slice(0, 2);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.timexceramic.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.timexceramic.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category || "Design Tips",
        item: "https://www.timexceramic.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `https://www.timexceramic.com/blogs/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {seo.schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seo.schemaData }}
        />
      )}
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
