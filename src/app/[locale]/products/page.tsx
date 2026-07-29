"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/common/Loader";
import Image from "@/components/common/Image";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/graphql/ecommerce/queries/product";
import { CP_PAGES, type CpPagesData } from "@/graphql/cms/queries/page";
import { CP_POSTS, type CpPostsData, type Post } from "@/graphql/cms/queries/post";
import { CP_CATEGORIES, type CpCategoriesData } from "@/graphql/cms/queries/category";

const FALLBACK_CATEGORIES = ["Хөөс", "Түгжээ", "Хуванцар тавцан", "Хуванцар амалгаа", "Ус уур чийг тусгаарлагч", "Резин"];

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

function getCustomField(post: Post, field: string): unknown {
  const data = post.customFieldsData;
  if (Array.isArray(data)) {
    const found = data.find(
      (item) => item && typeof item === "object" && (item as { field?: string }).field === field
    );
    return (found as { value?: unknown } | undefined)?.value;
  }
  if (data && typeof data === "object") {
    return (data as Record<string, unknown>)[field];
  }
  return undefined;
}

export function postToProduct(post: Post): Product {
  const price = getCustomField(post, "price");
  return {
    _id: post.slug || post._id,
    name: post.title,
    unitPrice: typeof price === "number" ? price : Number(price) || 0,
    attachment: post.thumbnail?.url ? { url: post.thumbnail.url } : undefined,
  };
}

export function getPostCategory(post: Post): string {
  if (post.categories && post.categories.length > 0) {
    return post.categories[0]?.name ?? "";
  }
  const category = getCustomField(post, "category");
  return typeof category === "string" ? category : "";
}

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const { data: pagesData } = useQuery<CpPagesData>(CP_PAGES, {
    variables: { language: locale },
    fetchPolicy: "cache-and-network",
  });

  const { data: postsData, loading } = useQuery<CpPostsData>(CP_POSTS, {
    variables: { language: locale, status: "published", limit: 100 },
    fetchPolicy: "cache-and-network",
  });

  const { data: categoriesData } = useQuery<CpCategoriesData>(CP_CATEGORIES, {
    variables: { language: locale },
    fetchPolicy: "cache-and-network",
  });

  const productsPage = pagesData?.cpPages?.find((p) => p.slug === "products");

  const cmsProducts = useMemo(() => {
    const posts = (postsData?.cpPosts ?? []).filter((post) => post.type === "product");
    return posts;
  }, [postsData]);

  const categoryNames = useMemo(() => {
    const list = categoriesData?.cpCategories?.list ?? [];
    const names = list.map((cat) => cat.name ?? "").filter(Boolean);
    return names.length > 0 ? names : FALLBACK_CATEGORIES;
  }, [categoriesData]);

  const effectiveCategory = selectedCategory || searchParams.get("category") || categoryNames[0] || "";

  const filtered = useMemo(() => {
    let result = cmsProducts.filter((p) => {
      const matchesSearch = !searchValue || p.title?.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory = getPostCategory(p) === effectiveCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-asc")
      result = [...result].sort(
        (a, b) => (Number(getCustomField(a, "price")) || 0) - (Number(getCustomField(b, "price")) || 0)
      );
    if (sortBy === "price-desc")
      result = [...result].sort(
        (a, b) => (Number(getCustomField(b, "price")) || 0) - (Number(getCustomField(a, "price")) || 0)
      );
    if (sortBy === "name")
      result = [...result].sort((a, b) => (a.title || "").localeCompare(b.title || "", "mn"));

    return result;
  }, [searchValue, effectiveCategory, sortBy, cmsProducts]);

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const sortLabel: Record<SortOption, string> = {
    featured: t("products.sortFeatured"),
    "price-asc": t("products.sortPriceAsc"),
    "price-desc": t("products.sortPriceDesc"),
    name: t("products.sortName"),
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedCategory("");
    setSortBy("featured");
    setPage(1);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[320px] w-full overflow-hidden sm:h-[380px]"
      >
        <Image
          src="/images/products/foam.jpg"
          alt={t("products.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Бүтээгдэхүүний каталог
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {productsPage?.name ?? t("products.title")}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/70">
              {productsPage?.description ?? "Манай хуванцар цонхны үндсэн болон туслах материалын бүх бүтээгдэхүүнийг эндээс үзнэ үү."}
            </p>
          </div>
        </div>
      </motion.section>

      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-[32px] font-bold">
            {effectiveCategory} <span className="text-muted-foreground">({filtered.length})</span>
          </h1>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="hidden items-center gap-2 text-[15px] font-semibold transition-opacity hover:opacity-70 lg:flex"
            >
              {showFilters ? "Шүүлтүүр нуух" : "Шүүлтүүр харуулах"}
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setPage(1);
                }}
                className="appearance-none bg-transparent pr-6 text-[15px] font-semibold outline-none"
              >
                {(Object.keys(sortLabel) as SortOption[]).map((key) => (
                  <option key={key} value={key}>
                    {sortLabel[key]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-60 lg:flex-shrink-0">
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("products.searchPlaceholder")}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setPage(1);
                    }}
                    className="h-11 border-0 bg-muted px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <nav>
                <ul className="flex flex-col gap-3">
                  {categoryNames.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setPage(1);
                        }}
                        className={cn(
                          "text-left text-[16px] transition-colors",
                          effectiveCategory === cat
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <PageLoader />
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <p className="text-[16px] font-medium text-muted-foreground">{t("products.notFound")}</p>
                <button
                  onClick={clearFilters}
                  className="text-[15px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {t("products.clearFilters")}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map((post, i) => (
                    <ProductCard
                      key={post._id}
                      product={postToProduct(post)}
                      index={i}
                      category={getPostCategory(post)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-14 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                      {t("common.previous")}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "min-w-[28px] text-[15px] font-semibold transition-colors",
                          page === p
                            ? "text-foreground underline underline-offset-4"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                      {t("common.next")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
