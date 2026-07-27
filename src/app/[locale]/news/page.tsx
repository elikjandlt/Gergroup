"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { ArrowLeft } from "lucide-react";

const NEWS_ITEMS = [
  {
    _id: "1",
    title: "Хуванцар цонхны материалын шинэ бараа ирлээ",
    excerpt:
      "2024 оны шинэ улирлын бүтээгдэхүүнүүд бэлэн боллоо. Блокны хөөс, түгжээ, тавцан болон ус чийг тусгаарлагч материалуудаас сонголтоо хийнэ үү.",
    date: "2024.12.15",
    image: "/images/products/foam.jpg",
  },
  {
    _id: "2",
    title: "Өвлийн улиралд цонхоо дулаалах зөвлөмж",
    excerpt:
      "Цонхны хөөс болон резинээр завсрыг битүүмжлэх нь дулааны алдагдлыг 30% хүртэл бууруулдаг. Манай мэргэжилтнүүдийн зөвлөгөөг уншина уу.",
    date: "2024.12.08",
    image: "/images/products/mako2.jpg",
  },
  {
    _id: "3",
    title: "Гэр Групп ХХК шинэ салбар нээлээ",
    excerpt:
      "Харилцагчиддаа ойртох, хүргэлтийн хугацааг богиносгох зорилгоор Улаанбаатар хотод гурав дахь салбараа нээлээ.",
    date: "2024.11.28",
    image: "/images/products/tavtsan.jpg",
  },
  {
    _id: "4",
    title: "Барилгын материалын үнийн өөрчлөлтийн мэдээлэл",
    excerpt:
      "Дэлхийн зах зээл дэх түүхий эдийн үнийн өөрчлөлтөөс хамаарч зарим бүтээгдэхүүний үнэ тохируулагдсан тухай мэдээлэл.",
    date: "2024.11.15",
    image: "/images/products/rubber-category.jpg",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function NewsPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="mb-10"
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("news.back")}
        </Link>
        <h1 className="text-[32px] font-normal uppercase tracking-wide">{t("news.title")}</h1>
      </motion.div>

      {NEWS_ITEMS.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{t("news.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {NEWS_ITEMS.map((item, i) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
              className="group flex flex-col border border-border bg-background"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] uppercase text-muted-foreground">
                  {t("news.date")}: {item.date}
                </p>
                <h2 className="mt-2 text-[18px] font-normal leading-snug">{item.title}</h2>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center text-[13px] uppercase tracking-wider underline-offset-4 group-hover:underline">
                  {t("news.readMore")}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
