"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useQuery } from "@apollo/client/react";
import { CP_DEALS, type CpDealsData, type Deal } from "@/graphql/hotel/queries/booking";
import { useAuth } from "@/lib/auth/AuthContext";
import { PageLoader } from "@/components/common/Loader";
import Image from "@/components/common/Image";
import { Package, ChevronRight } from "lucide-react";

function getDealTotal(deal: Deal): number {
  if (!Array.isArray(deal.productsData)) return 0;
  return deal.productsData.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
}

function formatMnt(value: number): string {
  return `${value.toLocaleString("mn-MN")} ₮`;
}

export default function OrdersPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const { data, loading } = useQuery<CpDealsData>(CP_DEALS, {
    variables: {
      limit: 50,
      ...(user?._id ? { customerIds: [user._id] } : {}),
    },
    fetchPolicy: "cache-and-network",
  });

  const deals = (data?.cpDeals?.list ?? [])
    .slice()
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  if (loading) {
    return (
      <div className="mx-auto flex h-96 max-w-[1440px] items-center justify-center px-10">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[240px] w-full overflow-hidden sm:h-[280px]">
        <Image
          src="/images/products/amalgaa.jpg"
          alt={t("orders.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Миний захиалга
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("orders.title")}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <p className="text-[16px] font-medium text-muted-foreground">{t("orders.empty")}</p>
            <Link
              href="/products"
              className="text-[14px] font-semibold text-primary underline underline-offset-4"
            >
              {t("cart.continue")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {deals.map((deal) => (
              <Link
                key={deal._id}
                href={`/orders/${deal._id}`}
                className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold transition-colors group-hover:text-primary">
                    {deal.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {deal.createdAt
                      ? new Date(deal.createdAt).toLocaleDateString("mn-MN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary">
                    {deal.status === "active" ? "Шинэ захиалга" : deal.status}
                  </span>
                  <span className="text-[16px] font-bold">{formatMnt(getDealTotal(deal))}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
