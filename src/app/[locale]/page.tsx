"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/common/Image";
import { Truck, ShieldCheck, Headphones, Lock } from "lucide-react";
import type { Product } from "@/graphql/ecommerce/queries/product";

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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden bg-muted"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                <div className="relative p-6 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">{i + 1 < 10 ? `0${i + 1}` : i + 1}</p>
                  <p className="mt-1 text-[20px] font-semibold">{cat.name}</p>
                  <p className="mt-2 inline-flex items-center text-[13px] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Бүтээгдэхүүн харах <span className="ml-2">→</span>
                  </p>
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
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[28px] font-normal">{t("home.featured")}</h2>
          <Link href="/products" className="text-[13px] underline">{t("home.viewAll")}</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Quote request */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="border border-border p-10 text-center">
          <h2 className="text-[24px] font-normal">{t("home.newsletter")}</h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] text-muted-foreground">{t("home.newsletterText")}</p>
          <form
            className="mx-auto mt-6 flex max-w-xl flex-col gap-4 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input type="text" placeholder="Нэр" />
              <Input type="tel" placeholder="Утас" />
            </div>
            <Input type="email" placeholder="Имэйл (заавал биш)" />
            <Textarea
              placeholder="Төслийн тайлбар, тоо хэмжээ, хэмжээ гэх мэт..."
              className="min-h-[120px]"
            />
            <Button type="submit" className="self-center text-[13px] uppercase tracking-wider">
              {t("home.subscribe")}
            </Button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
