"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/common/Loader";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/graphql/ecommerce/queries/product";

const MOCK_PRODUCTS: Product[] = [
  { _id: "suulgalt-khoos", name: "СУУЛГАЛТЫН ХӨӨС", unitPrice: 29700, attachment: { url: "/images/products/foam.jpg" } },
  { _id: "block-khoos", name: "БЛОКНЫ ХӨӨС", unitPrice: 45000, attachment: { url: "/images/products/block-foam.jpg" } },
  { _id: "shurdeg-khoos", name: "ШҮРШДЭГ ХӨӨС", unitPrice: 52000, attachment: { url: "/images/products/foam.jpg" } },
  { _id: "khoos-tseverlegch", name: "ХӨӨС ЦЭВЭРЛЭГЧ", unitPrice: 18000, attachment: { url: "/images/products/foam-cleaner.jpg" } },
  { _id: "khoosnii-buu", name: "ХӨӨСНИЙ БУУ", unitPrice: 75000, attachment: { url: "/images/products/foam-gun.jpg" } },
  { _id: "khoos-idewkhijulegch", name: "ХӨӨС ИДЭВХИЖҮҮЛЭГЧ", unitPrice: 12000, attachment: { url: "/images/products/foam-activator.jpg" } },
  { _id: "mako2", name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ", unitPrice: 85000, attachment: { url: "/images/products/mako2.jpg" } },
  { _id: "kinlong", name: "КИНЛОНГ ТҮГЖЭЭ", unitPrice: 95000, attachment: { url: "/images/products/kinlong.jpg" } },
  { _id: "amalgaa-45", name: "ХУВАНЦАР АМАЛГАА 45СМ", unitPrice: 95000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-60", name: "ХУВАНЦАР АМАЛГАА 60СМ", unitPrice: 120000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-zam", name: "АМАЛГААНЫ ЗАМ", unitPrice: 35000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-tag", name: "АМАЛГААНЫ ТАГ", unitPrice: 18000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "tavtsan-20", name: "ХУВАНЦАР ТАВЦАН 20СМ", unitPrice: 120000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-25", name: "ХУВАНЦАР ТАВЦАН 25СМ", unitPrice: 135000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-30", name: "ХУВАНЦАР ТАВЦАН 30СМ", unitPrice: 150000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-35", name: "ХУВАНЦАР ТАВЦАН 35СМ", unitPrice: 165000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-40", name: "ХУВАНЦАР ТАВЦАН 40СМ", unitPrice: 180000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-45", name: "ХУВАНЦАР ТАВЦАН 45СМ", unitPrice: 195000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-50", name: "ХУВАНЦАР ТАВЦАН 50СМ", unitPrice: 210000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-60", name: "ХУВАНЦАР ТАВЦАН 60СМ", unitPrice: 240000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "us-uur-inside", name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ INSIDE", unitPrice: 180000, attachment: { url: "/images/products/us-uur.jpg" } },
  { _id: "us-uur-outside", name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ OUTSIDE", unitPrice: 240000, attachment: { url: "/images/products/us-uur.jpg" } },
  { _id: "epdm-rm228", name: "EPDM РЕЗИН РМ-228", unitPrice: 65000, attachment: { url: "/images/products/epdm.jpg" } },
  { _id: "epdm-pru05016", name: "EPDM РЕЗИН ПРУ-05016", unitPrice: 72000, attachment: { url: "/images/products/epdm.jpg" } },
  { _id: "epdm-rm124", name: "EPDM РЕЗИН РМ-124", unitPrice: 68000, attachment: { url: "/images/products/epdm.jpg" } },
  { _id: "epdm-rm050", name: "EPDM РЕЗИН РМ-050", unitPrice: 55000, attachment: { url: "/images/products/epdm.jpg" } },
];

const CATEGORIES = ["Хөөс", "Түгжээ", "Хуванцар тавцан", "Хуванцар амалгаа", "Ус уур чийг тусгаарлагч", "Резин"];

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export default function ProductsPage() {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Хөөс");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const categoryCount = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const count = MOCK_PRODUCTS.filter((p) => {
        if (cat === "Хөөс") return p.name?.toLowerCase().includes("хөөс");
        if (cat === "Түгжээ") return p.name?.includes("ТҮГЖЭЭ");
        if (cat === "Хуванцар тавцан") return p.name?.includes("ТАВЦАН");
        if (cat === "Хуванцар амалгаа") return p.name?.includes("АМАЛГАА") || p.name?.includes("АМАЛГААНЫ");
        if (cat === "Ус уур чийг тусгаарлагч") return p.name?.includes("УС УУР ЧИЙГ ТУСГААРЛАГЧ");
        if (cat === "Резин") return p.name?.includes("РЕЗИН");
        return false;
      }).length;
      return { name: cat, count };
    });
  }, []);

  const filtered = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name?.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory =
        (selectedCategory === "Хөөс" && p.name?.toLowerCase().includes("хөөс")) ||
        (selectedCategory === "Түгжээ" && p.name?.includes("ТҮГЖЭЭ")) ||
        (selectedCategory === "Хуванцар тавцан" && p.name?.includes("ТАВЦАН")) ||
        (selectedCategory === "Хуванцар амалгаа" && (p.name?.includes("АМАЛГАА") || p.name?.includes("АМАЛГААНЫ"))) ||
        (selectedCategory === "Ус уур чийг тусгаарлагч" && p.name?.includes("УС УУР ЧИЙГ ТУСГААРЛАГЧ")) ||
        (selectedCategory === "Резин" && p.name?.includes("РЕЗИН"));
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-asc") result = [...result].sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
    if (sortBy === "price-desc") result = [...result].sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
    if (sortBy === "name") result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || "", "mn"));

    return result;
  }, [searchValue, selectedCategory, sortBy]);

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const loading = false;

  const sortLabel: Record<SortOption, string> = {
    featured: t("products.sortFeatured"),
    "price-asc": t("products.sortPriceAsc"),
    "price-desc": t("products.sortPriceDesc"),
    name: t("products.sortName"),
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedCategory("Хөөс");
    setSortBy("featured");
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      {/* Page header */}
      <div className="mb-10 flex flex-col gap-2 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t("products.categories")}</p>
          <h1 className="mt-1 text-[28px] font-normal">{t("products.title")}</h1>
        </div>
        <p className="text-[13px] text-muted-foreground">
          {filtered.length} {t("products.count")}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("products.searchPlaceholder")}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPage(1);
            }}
            className="h-11 pl-10"
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-border px-3 py-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setPage(1);
              }}
              className="bg-transparent text-[13px] outline-none"
            >
              {(Object.keys(sortLabel) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabel[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 text-[11px] uppercase tracking-wider text-muted-foreground">{t("products.categories")}</p>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
            {categoryCount.map(({ name, count }) => {
              const active = selectedCategory === name;
              return (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedCategory(name);
                    setPage(1);
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-between border px-4 py-3 text-left text-[13px] transition-colors lg:flex-none",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  )}
                >
                  <span>{name}</span>
                  <span className={cn("ml-3 text-[11px]", active ? "text-background/70" : "text-muted-foreground")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <PageLoader />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-border py-24 text-center">
              <p className="text-[14px] text-muted-foreground">{t("products.notFound")}</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                {t("products.clearFilters")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    {t("common.previous")}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="min-w-[40px]"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
