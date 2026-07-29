"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { CP_PAGES, type CpPagesData } from "@/graphql/cms/queries/page";
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, Award } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Чанарын баталгаа",
    desc: "Албан ёсны эрхтэй худалдаа, бүх бүтээгдэхүүн чанарын стандартад нийцсэн.",
  },
  {
    icon: Truck,
    title: "Хурдан хүргэлт",
    desc: "Улаанбаатар хотод 24-48 цагийн дотор хүргэж өгнө.",
  },
  {
    icon: Award,
    title: "Мэргэжлийн зөвлөгөө",
    desc: "Төслийн хэмжээнээс хамаарсан үнийн санал, мэргэжлийн дэмжлэг.",
  },
];

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();

  const { data, loading } = useQuery<CpPagesData>(CP_PAGES, {
    variables: { language: locale },
    fetchPolicy: "cache-and-network",
  });

  const cmsPage = useMemo(
    () => data?.cpPages?.find((page) => page.slug === "about"),
    [data]
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[320px] w-full overflow-hidden sm:h-[380px]"
      >
        <Image
          src="/images/products/tavtsan.jpg"
          alt={cmsPage?.name ?? "Бидний тухай"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("news.back")}
            </Link>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Компанийн тухай
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {loading ? "Бидний тухай" : (cmsPage?.name ?? "Бидний тухай")}
            </h1>
            {cmsPage?.description && (
              <p className="mt-3 max-w-xl text-[15px] text-white/70">
                {cmsPage.description}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Content from CMS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
              Бид хэн бэ
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight">
              Гэр Групп ХХК
            </h2>
            {cmsPage?.content ? (
              <div
                className="mt-6 text-[15px] leading-relaxed text-muted-foreground [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: cmsPage.content }}
              />
            ) : (
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                Гэр Групп ХХК нь хуванцар цонхны материалын албан ёсны эрхтэй
                худалдаагаар үйл ажиллагаа явуулдаг компани юм. Бид чанарын
                баталгаат бүтээгдэхүүн, хурдан хүргэлт, мэргэжлийн зөвлөгөөг
                үйлчлүүлэгчдэдээ санал болгодог.
              </p>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/products/amalgaa.jpg"
              alt="Гэр Групп ХХК"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="w-full bg-slate-50 py-16"
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
            Яагаад биднийг сонгох вэ
          </p>
          <h2 className="mt-2 text-[24px] font-bold">Бидний давуу тал</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold">{value.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10"
      >
        <div className="rounded-2xl bg-primary p-8 text-white sm:p-10 lg:p-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[22px] font-bold sm:text-[26px]">
                Бүтээгдэхүүнтэй танилцахыг хүсэж байна уу?
              </h3>
              <p className="mt-2 max-w-xl text-[15px] text-white/70">
                Манай бүтээгдэхүүний каталогийг үзэж, төслийн хэмжээнд үнийн санал аваарай.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t("products.title")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
