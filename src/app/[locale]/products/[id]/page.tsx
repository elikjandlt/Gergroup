"use client";

import { useState, use, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useQuery } from "@apollo/client/react";
import { Link, useRouter } from "@/i18n/routing";
import { cartItemsAtom } from "@/store/cart.store";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/common/Image";
import { CP_POST, type CpPostData } from "@/graphql/cms/queries/post";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Truck, Check } from "lucide-react";

function getCustomField(data: unknown, field: string): unknown {
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const { id: productSlug } = use(params);

  const { data, loading } = useQuery<CpPostData>(CP_POST, {
    variables: { slug: productSlug, language: locale },
    fetchPolicy: "cache-first",
  });

  const product = data?.cpPost;

  const price = useMemo(() => {
    const value = getCustomField(product?.customFieldsData, "price");
    return typeof value === "number" ? value : Number(value) || 0;
  }, [product]);

  const category = useMemo(() => {
    const value = getCustomField(product?.customFieldsData, "category");
    return typeof value === "string" ? value : "";
  }, [product]);

  const inStock = useMemo(() => {
    const value = getCustomField(product?.customFieldsData, "inStock");
    return value !== false;
  }, [product]);

  const [, setCartItems] = useAtom(cartItemsAtom);
  const [wishlistItems, setWishlistItems] = useAtom(wishlistItemsAtom);

  const addToCart = () => {
    if (!product) return;
    setIsPending(true);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, count: item.count + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          count: quantity,
          unitPrice: price,
          productName: product.title,
          productImgUrl: product.thumbnail?.url,
        },
      ];
    });
    setTimeout(() => setIsPending(false), 400);
  };

  const toggleWishlist = () => {
    if (!product) return;
    const existing = wishlistItems.find((item) => item.productId === product._id);
    if (existing) {
      setWishlistItems((prev) => prev.filter((item) => item.productId !== product._id));
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          productId: product._id,
          productName: product.title,
          unitPrice: price,
          productImgUrl: product.thumbnail?.url,
        },
      ]);
    }
  };

  const isInWishlist = wishlistItems.some((item) => item.productId === product?._id);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] items-center justify-center px-10 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-start justify-center px-10 py-16">
        <p className="text-[16px] font-medium text-muted-foreground">{t("products.notFound")}</p>
        <Button onClick={() => router.push("/products")} className="mt-6">
          {t("products.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("products.back")}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-muted"
        >
          <Image
            src={product.thumbnail?.url}
            alt={product.title ?? ""}
            fill
            className="object-contain p-8"
            priority
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          {category && (
            <p className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
              {category}
            </p>
          )}
          <h1 className="mt-2 text-[28px] font-bold leading-tight">{product.title}</h1>
          <p className="mt-4 text-[24px] font-semibold">{formatPrice(price)}</p>
          {product.excerpt && (
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {product.excerpt}
            </p>
          )}

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
              Тоо хэмжээ
            </span>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center bg-muted text-[15px] font-semibold transition-colors hover:bg-muted/80"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-[15px] font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center bg-muted text-[15px] font-semibold transition-colors hover:bg-muted/80"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={addToCart}
              disabled={!inStock || isPending}
              className="h-12 w-full gap-2 bg-primary text-[14px] font-semibold uppercase tracking-wider text-white hover:bg-primary/90"
            >
              <ShoppingBag className="h-4 w-4" />
              {inStock ? t("product.addToCart") : "Бараа дууссан"}
            </Button>
            <Button
              variant="ghost"
              onClick={toggleWishlist}
              className={`h-12 w-full gap-2 text-[14px] font-semibold uppercase tracking-wider ${
                isInWishlist ? "text-red-500 hover:text-red-600" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
              {isInWishlist ? "Дуртайд нэмсэн" : t("product.addToWishlist")}
            </Button>
          </div>

          {/* Delivery note */}
          <div className="mt-8 flex items-start gap-3 border-t border-border pt-6">
            <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-[14px] font-semibold">Хүргэлтийн мэдээлэл</p>
              <p className="text-[13px] text-muted-foreground">
                Улаанбаатар хотод 24-48 цагийн дотор хүргэж өгнө. 100,000₮-өөс дээш захиалга үнэгүй хүргэлттэй.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description from CMS */}
      {product.content && (
        <div className="mt-20 max-w-3xl">
          <h2 className="text-[20px] font-bold">Бүтээгдэхүүний тайлбар</h2>
          <div
            className="mt-4 text-[15px] leading-relaxed text-muted-foreground [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
          <div className="mt-6 flex items-center gap-2 text-[14px] text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Албан ёсны эрхтэй худалдаа, чанарын баталгаатай</span>
          </div>
        </div>
      )}
    </div>
  );
}
