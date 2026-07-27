"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/common/Image";
import { Truck, ShieldCheck, Headphones, Lock, ArrowRight, ShoppingBag, Check, Clock, Mail, Phone, Send } from "lucide-react";
import type { Product } from "@/graphql/ecommerce/queries/product";
import { cartItemsAtom } from "@/store/cart.store";
import { useAtom } from "jotai";
import { formatPrice } from "@/lib/utils";

const FEATURED_PRODUCTS: Product[] = [
  { _id: "block-khoos", name: "БЛОКНЫ ХӨӨС", unitPrice: 45000, attachment: { url: "/images/products/block-foam.jpg" } },
  { _id: "khoosnii-buu", name: "ХӨӨСНИЙ БУУ", unitPrice: 75000, attachment: { url: "/images/products/foam-gun.jpg" } },
  { _id: "mako2", name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ", unitPrice: 85000, attachment: { url: "/images/products/mako2.jpg" } },
  { _id: "tavtsan-40", name: "ХУВАНЦАР ТАВЦАН 40СМ", unitPrice: 180000, attachment: { url: "/images/products/tavtsan.jpg" } },
];

const CATEGORIES = [
  { name: "Хөөс", slug: "Хөөс", image: "/images/products/foam.jpg" },
  { name: "Түгжээ", slug: "Түгжээ", image: "/images/products/mako2.jpg" },
  { name: "Хуванцар тавцан", slug: "Хуванцар тавцан", image: "/images/products/tavtsan-category.jpg" },
  { name: "Хуванцар амалгаа", slug: "Хуванцар амалгаа", image: "/images/products/amalgaa-category.jpg" },
  { name: "Ус уур чийг тусгаарлагч", slug: "Ус уур чийг тусгаарлагч", image: "/images/products/us-uur.jpg" },
  { name: "Резин", slug: "Резин", image: "/images/products/rubber-category.jpg" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function getProductCategory(name?: string | null) {
  if (!name) return "";
  if (name.includes("ХӨӨС")) return "Хөөс";
  if (name.includes("ТҮГЖЭЭ")) return "Түгжээ";
  if (name.includes("ТАВЦАН")) return "Хуванцар тавцан";
  if (name.includes("АМАЛГАА") || name.includes("АМАЛГААНЫ")) return "Хуванцар амалгаа";
  if (name.includes("УС УУР ЧИЙГ ТУСГААРЛАГЧ")) return "Ус уур чийг тусгаарлагч";
  if (name.includes("РЕЗИН")) return "Резин";
  return "";
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const [, setCartItems] = useAtom(cartItemsAtom);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = false; // Simplified for featured card
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          count: 1,
          unitPrice: product.unitPrice || 0,
          productName: product.name,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="group flex flex-col"
    >
      <Link href={`/products/${product._id}`} className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted p-6">
        <Image
          src={product.attachment?.url}
          alt={product.name || ""}
          fill
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {getProductCategory(product.name)}
        </p>
        <Link href={`/products/${product._id}`}>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-[15px] font-semibold">{formatPrice(product.unitPrice)}</p>
        <Button
          onClick={addToCart}
          variant="default"
          size="sm"
          className="mt-4 w-full gap-2 text-[12px] font-semibold uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Сагсанд нэмэх
        </Button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[560px] w-full overflow-hidden">
        <Image src="/images/hero.jpg" alt="Гэр Групп ХХК" fill className="object-cover" priority />
      </section>

      {/* Trust badges */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 py-16"
      >
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: t("home.freeDelivery"), desc: "Хүргэлтийн үйлчилгээ", icon: Truck },
            { title: t("home.quality"), desc: "Баталгаат чанар", icon: ShieldCheck },
            { title: t("home.support"), desc: "24/7 тусламж", icon: Headphones },
            { title: t("home.securePayment"), desc: "Аюулгүй төлбөр", icon: Lock },
          ].map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group flex flex-col items-center gap-4 bg-background py-12 text-center transition-colors hover:bg-muted"
            >
              <badge.icon className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-foreground" />
              <div>
                <p className="text-[15px] font-semibold">{badge.title}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Бүтээгдэхүүний ангилал</p>
            <h2 className="mt-2 text-[28px] font-bold">{t("home.categories")}</h2>
          </div>
          <Link href="/products" className="text-[14px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70">
            {t("home.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-border bg-background p-3 transition-colors hover:border-foreground"
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-[14px] font-semibold text-foreground">{cat.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Бидний санал болгож буй
            </p>
            <h2 className="mt-2 text-[28px] font-bold">{t("home.featured")}</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[14px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            {t("home.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product, i) => (
            <FeaturedProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Quote request */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="w-full bg-slate-50 py-24"
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 sm:px-10 lg:grid-cols-2">
          {/* Left info card */}
          <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-blue-600">
              Мэргэжлийн зөвлөгөө
            </p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight text-foreground sm:text-[32px]">
              {t("home.newsletter")}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {t("home.newsletterText")}
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {[
                { icon: Clock, text: "24 цагийн дотор" },
                { icon: Phone, text: "Утасаар холбогдох" },
                { icon: Mail, text: "Имэйлээр илгээх" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[16px] font-medium text-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right form card */}
          <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-foreground">Нэр</label>
                  <Input type="text" placeholder="Таны нэр" className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-foreground">Утас</label>
                  <Input type="tel" placeholder="Таны утас" className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-foreground">Имэйл</label>
                <Input type="email" placeholder="Таны имэйл (заавал биш)" className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-foreground">Төслийн тайлбар</label>
                <Textarea
                  placeholder="Төслийн тайлбар, тоо хэмжээ, хэмжээ гэх мэт..."
                  rows={6}
                  className="rounded-lg border-border bg-slate-50 px-4 py-3 text-[14px]"
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-14 w-full gap-2 rounded-lg bg-blue-600 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700"
              >
                {t("home.subscribe")}
                <Send className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Check className="h-4 w-4 text-blue-600" />
                <span>Мэдээлэл нь нууцлагдана</span>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
