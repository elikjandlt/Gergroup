"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart.store";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useAtom(cartItemsAtom);
  const [total] = useAtom(cartTotalAtom);
  const { user } = useAuth();

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((item) => item.productId !== productId));

  const updateQuantity = (productId: string, count: number) => {
    if (count <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, count } : item
      )
    );
  };

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col">
        {/* Hero */}
        <section className="relative h-[280px] w-full overflow-hidden sm:h-[320px]">
          <Image
            src="/images/products/foam.jpg"
            alt={t("cart.title")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Худалдан авалт
              </p>
              <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
                {t("cart.title")}
              </h1>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-8 text-[24px] font-bold text-foreground">
              {t("cart.empty")}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Таны сагсанд одоогоор бүтээгдэхүүн байхгүй байна. Дэлгүүр хэсэж бүтээгдэхүүн сонгоно уу.
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="mt-8 h-14 gap-2 rounded-lg bg-primary px-8 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
            >
              {t("cart.continue")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[280px] w-full overflow-hidden sm:h-[320px]">
        <Image
          src="/images/products/foam.jpg"
          alt={t("cart.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Худалдан авалт
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("cart.title")}
            </h1>
            <p className="mt-3 text-[15px] text-white/70">
              {items.length} бүтээгдэхүүн
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {/* Cart items */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-[18px] font-bold">
                Бүтээгдэхүүнүүд ({items.length})
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Дэлгүүр хэсэх
              </Link>
            </div>

            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-6 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={item.productImgUrl}
                    alt={item.productName || ""}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <h3 className="text-[16px] font-semibold leading-snug">
                      {item.productName}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium text-primary">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.productId, item.count - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-[16px] font-medium transition-colors hover:bg-muted"
                      >
                        −
                      </button>
                      <span className="min-w-[32px] text-center text-[16px] font-semibold">
                        {item.count}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.count + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-[16px] font-medium transition-colors hover:bg-muted"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Устгах"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-[18px] font-bold">
              {t("cart.summary")}
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-between text-[15px]">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-muted-foreground">{t("cart.shipping")}</span>
                <span className="font-medium text-primary">{t("cart.free")}</span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-[18px] font-bold">
                  <span>{t("cart.total")}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="mt-8 h-14 w-full gap-2 rounded-lg bg-primary text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
            >
              {t("cart.checkout")}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="mt-4 text-center text-[13px] text-muted-foreground">
              Хүргэлт Улаанбаатар хотод үнэгүй
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
