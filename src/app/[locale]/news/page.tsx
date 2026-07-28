"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";

const NEWS_ITEMS = [
  {
    _id: "1",
    title: "Хуванцар цонхны материалын шинэ бараа ирлээ",
    excerpt:
      "2024 оны шинэ улирлын бүтээгдэхүүнүүд бэлэн боллоо. Блокны хөөс, түгжээ, тавцан болон ус чийг тусгаарлагч материалуудаас сонголтоо хийнэ үү.",
    date: "2024.12.15",
    readTime: "3 мин",
    image: "/images/products/foam.jpg",
    category: "Бүтээгдэхүүн",
    featured: true,
  },
  {
    _id: "2",
    title: "Өвлийн улиралд цонхоо дулаалах зөвлөмж",
    excerpt:
      "Цонхны хөөс болон резинээр завсрыг битүүмжлэх нь дулааны алдагдлыг 30% хүртэл бууруулдаг. Манай мэргэжилтнүүдийн зөвлөгөөг уншина уу.",
    date: "2024.12.08",
    readTime: "5 мин",
    image: "/images/products/mako2.jpg",
    category: "Зөвлөгөө",
  },
  {
    _id: "3",
    title: "Гэр Групп ХХК шинэ салбар нээлээ",
    excerpt:
      "Харилцагчиддаа ойртох, хүргэлтийн хугацааг богиносгох зорилгоор Улаанбаатар хотод гурав дахь салбараа нээлээ.",
    date: "2024.11.28",
    readTime: "4 мин",
    image: "/images/products/tavtsan.jpg",
    category: "Компани",
  },
  {
    _id: "4",
    title: "Барилгын материалын үнийн өөрчлөлтийн мэдээлэл",
    excerpt:
      "Дэлхийн зах зээл дэх түүхий эдийн үнийн өөрчлөлтөөс хамаарч зарим бүтээгдэхүүний үнэ тохируулагдсан тухай мэдээлэл.",
    date: "2024.11.15",
    readTime: "2 мин",
    image: "/images/products/rubber-category.jpg",
    category: "Маркет",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function NewsPage() {
  const t = useTranslations();
  const [featured, ...rest] = NEWS_ITEMS;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[320px] w-full overflow-hidden sm:h-[380px]"
      >
        <Image
          src="/images/products/mako2.jpg"
          alt={t("news.title")}
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
              Компанийн мэдээ
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("news.title")}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/70">
              Манай компанийн шинэ бүтээгдэхүүн, үйлчилгээ, болон салбарын мэдээллүүдийг эндээс хүлээн авна уу.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
        {/* Featured article */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="mt-10 lg:mt-14"
        >
          <Link
            href={`/news/${featured._id}`}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <article className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute left-5 top-5 rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Онцлох мэдээ
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary">
                    {featured.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {featured.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime} унших
                  </div>
                </div>

                <h2 className="mt-5 text-[24px] font-bold leading-tight transition-colors group-hover:text-primary sm:text-[30px]">
                  {featured.title}
                </h2>

                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-primary transition-colors">
                  {t("news.readMore")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          </Link>
        </motion.div>

        {/* Latest heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="mb-8 mt-16 flex items-end justify-between lg:mt-20"
        >
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
              Сүүлийн нийтлэлүүд
            </p>
            <h2 className="mt-2 text-[24px] font-bold">Бусад мэдээ</h2>
          </div>
          <span className="text-[14px] text-muted-foreground">
            {rest.length} мэдээ
          </span>
        </motion.div>

        {/* News grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {rest.map((item) => (
            <motion.article
              key={item._id}
              variants={itemVariants}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Link href={`/news/${item._id}`} className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                  <span className="font-semibold text-primary">{item.category}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>{item.date}</span>
                </div>

                <Link href={`/news/${item._id}`}>
                  <h3 className="mt-3 text-[18px] font-semibold leading-snug transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                </Link>

                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>

                <Link
                  href={`/news/${item._id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors"
                >
                  {t("news.readMore")}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="mt-20 rounded-2xl bg-primary p-8 text-white sm:p-10 lg:p-12"
        >
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[22px] font-bold sm:text-[26px]">
                Мэдээний мэдээлэл тогтмол хүлээн авахыг хүсэж байна уу?
              </h3>
              <p className="mt-2 max-w-xl text-[15px] text-white/70">
                Бидний шинэ бүтээгдэхүүн, урамшуулал, мэдээ мэдээллийг цаг алдалгүй хүлээн аваарай.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Холбогдох
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
