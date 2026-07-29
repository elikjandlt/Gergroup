"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useQuery } from "@apollo/client/react";
import { CP_DEALS, type CpDealsData, type Deal } from "@/graphql/hotel/queries/booking";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/Loader";
import { ArrowLeft, Package, Truck } from "lucide-react";

function formatMnt(value: number): string {
  return `${value.toLocaleString("mn-MN")} ₮`;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { id: orderId } = use(params);

  const { data, loading } = useQuery<CpDealsData>(CP_DEALS, {
    variables: { limit: 100 },
    fetchPolicy: "cache-and-network",
  });

  const deal = (data?.cpDeals?.list ?? []).find((d: Deal) => d._id === orderId);

  if (loading) {
    return (
      <div className="mx-auto flex h-96 max-w-[1440px] items-center justify-center px-10">
        <PageLoader />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1440px] flex-col items-start justify-center px-10 py-16">
        <p className="text-[16px] text-muted-foreground">{t("orders.notFound")}</p>
        <Button onClick={() => router.push("/orders")} className="mt-6 bg-primary text-white hover:bg-primary/90">
          {t("orders.back")}
        </Button>
      </div>
    );
  }

  const products = Array.isArray(deal.productsData) ? deal.productsData : [];
  const total = products.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
  const descriptionLines = (deal.description ?? "").split("\n").filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
      <Button
        variant="ghost"
        onClick={() => router.push("/orders")}
        className="mb-6 gap-2 px-0 text-[14px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("orders.back")}
      </Button>

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold">{deal.name}</h1>
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-[13px] font-semibold text-primary">
          {deal.status === "active" ? "Шинэ захиалга" : deal.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Products */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <h2 className="text-[18px] font-bold">{t("checkout.summary")}</h2>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {products.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[14px]">
                <span className="text-muted-foreground">
                  {item.productId} x {item.quantity}
                </span>
                <span className="font-semibold">{formatMnt(Number(item.amount) || 0)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-border pt-4 text-[18px] font-bold">
            <span>{t("cart.total")}</span>
            <span>{formatMnt(total)}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="text-[18px] font-bold">{t("checkout.delivery")}</h2>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("orders.date")}
              </span>
              <span className="text-[14px]">
                {deal.createdAt
                  ? new Date(deal.createdAt).toLocaleDateString("mn-MN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
            {descriptionLines.map((line, idx) => (
              <p key={idx} className="text-[14px] text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
