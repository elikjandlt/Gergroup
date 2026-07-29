"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useQuery } from "@apollo/client/react";
import { CP_ORDER_DETAIL, type CpOrderDetailData } from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const { id: orderId } = params as unknown as { id: string };

  const { data, loading } = useQuery<CpOrderDetailData>(CP_ORDER_DETAIL, {
    variables: { id: orderId, customerId: user?._id || "" },
    skip: !orderId || !user?._id,
  });

  const order = data?.cpOrderDetail;

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">{t("common.loading")}</div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">{t("orders.notFound")}</div>
    );
  }

  const deliveryInfo = order.deliveryInfo as Record<string, string> | undefined;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <Button
        variant="ghost"
        onClick={() => router.push("/orders")}
        className="mb-6 px-0 text-[13px] text-muted-foreground hover:text-foreground"
      >
        ← {t("orders.back")}
      </Button>
      <h1 className="mb-10 text-[28px] font-normal">
        {t("orders.title")} #{order._id.slice(-6)}
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="border border-border p-6">
          <h2 className="mb-6 text-[13px] uppercase tracking-wider">{t("checkout.summary")}</h2>
          <div className="flex flex-col gap-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between text-[13px]">
                <span>{item.productName} x {item.count}</span>
                <span>{formatPrice((item.unitPrice || 0) * (item.count || 0))}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-[15px]">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="border border-border p-6">
          <h2 className="mb-6 text-[13px] uppercase tracking-wider">{t("checkout.delivery")}</h2>
          <div className="flex flex-col gap-4 text-[13px]">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.status")}</span>
              <span className="uppercase">{order.status}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase text-muted-foreground">{t("orders.date")}</span>
              <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("mn-MN") : ""}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.firstName")}</span>
              <span>{deliveryInfo?.firstName} {deliveryInfo?.lastName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.phone")}</span>
              <span>{deliveryInfo?.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.address")}</span>
              <span>{deliveryInfo?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
