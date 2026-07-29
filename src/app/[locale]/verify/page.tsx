"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Check, ArrowRight, Phone } from "lucide-react";

type LastOrder = {
  number: string;
  total: number;
  name: string;
};

export default function VerifyPage() {
  const t = useTranslations();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as LastOrder);
        sessionStorage.removeItem("lastOrder");
      } catch {
        setOrder(null);
      }
    }
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
      >
        <Check className="h-10 w-10 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="mt-8 text-[28px] font-bold">{t("checkout.thankYou")}</h1>

        {order && (
          <div className="mt-6 rounded-2xl bg-slate-50 px-8 py-6">
            <p className="text-[13px] text-muted-foreground">Захиалгын дугаар</p>
            <p className="mt-1 text-[22px] font-bold text-primary">{order.number}</p>
            <p className="mt-3 text-[13px] text-muted-foreground">Нийт дүн</p>
            <p className="mt-1 text-[18px] font-semibold">{formatPrice(order.total)}</p>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
          {t("checkout.verifyText")} Хүргэлтийн компани удахгүй тантай холбогдож,
          захиалгыг хүргэлтэнд гаргах болно.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
          <Phone className="h-4 w-4 text-primary" />
          <span>Асуулт байвал: 11 433995</span>
        </div>

        <Link href="/products" className="mt-8 inline-block">
          <Button className="h-12 gap-2 rounded-lg bg-primary px-8 text-[14px] font-semibold uppercase tracking-wider text-white hover:bg-primary/90">
            {t("cart.continue")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
