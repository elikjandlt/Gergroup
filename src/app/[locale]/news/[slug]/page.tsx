"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Link, useRouter } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { Button } from "@/components/ui/button";
import { CP_POST, CP_POSTS, type CpPostData, type CpPostsData, type Post } from "@/graphql/cms/queries/post";
import { ArrowLeft, ArrowRight, Calendar, ChevronRight } from "lucide-react";

const FALLBACK_IMAGES = [
  "/images/products/foam.jpg",
  "/images/products/mako2.jpg",
  "/images/products/tavtsan.jpg",
  "/images/products/rubber-category.jpg",
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { slug } = use(params);

  const { data, loading } = useQuery<CpPostData>(CP_POST, {
    variables: { slug, language: locale },
    fetchPolicy: "cache-first",
  });

  const { data: allPostsData } = useQuery<CpPostsData>(CP_POSTS, {
    variables: { language: locale, status: "published", limit: 20 },
    fetchPolicy: "cache-first",
  });

  const post = data?.cpPost;

  const relatedPosts = (allPostsData?.cpPosts ?? [])
    .filter((p: Post) => p.type === "post" && p.slug !== slug)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] items-center justify-center px-10 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-start justify-center px-10 py-16">
        <p className="text-[16px] font-medium text-muted-foreground">{t("news.empty")}</p>
        <Button onClick={() => router.push("/news")} className="mt-6">
          {t("news.back")}
        </Button>
      </div>
    );
  }

  const heroImage = post.thumbnail?.url ?? FALLBACK_IMAGES[0];

  return (
    <div className="flex flex-col bg-slate-50 pb-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[320px] w-full overflow-hidden sm:h-[400px]"
      >
        <Image
          src={heroImage}
          alt={post.title ?? ""}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[900px] px-6 pb-12 sm:px-10">
            <Link
              href="/news"
              className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("news.back")}
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-white/70">
              {post.categories?.[0]?.name && (
                <span className="rounded-full bg-primary px-3 py-1 text-[12px] font-semibold text-white">
                  {post.categories[0].name}
                </span>
              )}
              {(post.publishedDate || post.createdAt) && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.publishedDate ?? post.createdAt)}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-[28px] font-bold leading-tight text-white sm:text-[38px]">
              {post.title}
            </h1>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mx-auto w-full max-w-[900px] px-6 sm:px-10"
      >
        <div className="-mt-8 rounded-2xl bg-white p-8 shadow-sm sm:p-12">
          {post.excerpt && (
            <p className="border-l-4 border-primary pl-6 text-[17px] font-medium leading-relaxed text-foreground">
              {post.excerpt}
            </p>
          )}
          {post.content && (
            <div
              className="mt-8 text-[15px] leading-relaxed text-muted-foreground [&_p]:mb-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </div>
      </motion.article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto mt-16 w-full max-w-[900px] px-6 sm:px-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-[22px] font-bold">Бусад мэдээ</h2>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {t("common.viewAll")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedPosts.map((item, i) => (
              <Link
                key={item._id}
                href={`/news/${item.slug ?? item._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.thumbnail?.url ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                    alt={item.title ?? ""}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                    {t("news.readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
