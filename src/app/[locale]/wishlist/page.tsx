"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { cartItemsAtom } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useAtom(wishlistItemsAtom);
  const [, setCartItems] = useAtom(cartItemsAtom);

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((item) => item.productId !== productId));

  const addToCart = (item: (typeof items)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, count: i.count + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: item.productId,
          count: 1,
          unitPrice: item.unitPrice || 0,
          productName: item.productName,
          productImgUrl: item.productImgUrl,
        },
      ];
    });
    remove(item.productId);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col">
        {/* Hero */}
        <section className="relative h-[280px] w-full overflow-hidden sm:h-[320px]">
          <Image
            src="/images/products/mako2.jpg"
            alt={t("wishlist.title")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Дуртай бүтээгдэхүүн
              </p>
              <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
                {t("wishlist.title")}
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
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-8 text-[24px] font-bold text-foreground">
              {t("wishlist.empty")}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Та одоогоор дуртай бүтээгдэхүүн сонгоогүй байна. Дэлгүүр хэсэж бүтээгдэхүүн сонгоно уу.
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
          src="/images/products/mako2.jpg"
          alt={t("wishlist.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Дуртай бүтээгдэхүүн
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("wishlist.title")}
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
        >
          <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-[18px] font-bold">
              Бүтээгдэхүүнүүд ({items.length})
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ShoppingBag className="h-4 w-4" />
              Дэлгүүр хэсэх
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <Link href={`/products/${item.productId}`} className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={item.productImgUrl}
                    alt={item.productName || ""}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(item.productId);
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-muted-foreground shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Устгах"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="mt-2 text-[15px] font-medium text-primary">
                    {formatPrice(item.unitPrice)}
                  </p>

                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Сагсанд нэмэх
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
