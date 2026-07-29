"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/common/Image";
import { CP_PAGES, type CpPagesData } from "@/graphql/cms/queries/page";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function getPageField(page: { customFieldsData?: Record<string, unknown> | unknown[] | null } | undefined, field: string): string {
  const data = page?.customFieldsData;
  if (Array.isArray(data)) {
    const found = data.find(
      (item) => item && typeof item === "object" && (item as { field?: string }).field === field
    );
    const value = (found as { value?: unknown } | undefined)?.value;
    return typeof value === "string" ? value : "";
  }
  if (data && typeof data === "object") {
    const value = (data as Record<string, unknown>)[field];
    return typeof value === "string" ? value : "";
  }
  return "";
}

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { data: pagesData } = useQuery<CpPagesData>(CP_PAGES, {
    variables: { language: locale },
    fetchPolicy: "cache-first",
  });

  const contactPage = pagesData?.cpPages?.find((page) => page.slug === "contact");

  const cmsPhone = getPageField(contactPage, "phone");
  const cmsEmail = getPageField(contactPage, "email");
  const cmsAddress = getPageField(contactPage, "address");
  const cmsHours = getPageField(contactPage, "hours");
  const cmsFacebook = getPageField(contactPage, "facebook");
  const cmsInstagram = getPageField(contactPage, "instagram");

  const contactInfo = [
    { label: "Имэйл", value: cmsEmail || "info@ubgroup.mn", href: `mailto:${cmsEmail || "info@ubgroup.mn"}`, icon: Mail },
    { label: "Утас", value: cmsPhone || "11 433995", href: `tel:${(cmsPhone || "11433995").replace(/\s/g, "")}`, icon: Phone },
    { label: "Хаяг", value: cmsAddress || "Улаанбаатар, Монгол", icon: MapPin },
    { label: "Ажлын цаг", value: cmsHours || "Да-Ба 09:00 - 18:00", icon: Clock },
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: cmsFacebook || "https://www.facebook.com/GerGroupLTD", label: "Facebook" },
    { icon: InstagramIcon, href: cmsInstagram || "https://www.instagram.com", label: "Instagram" },
    { icon: YoutubeIcon, href: "#", label: "Youtube" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          src="/images/products/block-foam.jpg"
          alt={t("home.contact")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Холбоо барих
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {contactPage?.name ?? t("home.contact")}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/70">
              {contactPage?.description ?? "Танд асуух зүйл байна уу? Бидэнтэй холбогдоорой. Бид таны асуултанд 24 цагийн дотор хариу өгөх болно."}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="w-full bg-slate-50 py-24">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {/* Contact info card */}
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                Холбоо барих мэдээлэл
              </p>
              <h2 className="mt-3 text-[28px] font-bold leading-tight text-foreground sm:text-[32px]">
                Бидэнтэй холбогдоорой
              </h2>
              {contactPage?.content ? (
                <div
                  className="mt-4 text-[15px] leading-relaxed text-muted-foreground [&_p]:mb-3"
                  dangerouslySetInnerHTML={{ __html: contactPage.content }}
                />
              ) : (
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Танд асуух зүйл байна уу? Бидэнтэй холбогдоорой.
                </p>
              )}

              <div className="mt-8 flex flex-col gap-6">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 text-[16px] font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-1 text-[16px] font-medium text-foreground">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Сошиал</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form card */}
            <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-foreground">{t("contact.name")}</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Таны нэр"
                      className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-foreground">{t("contact.email")}</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Имэйл хаяг"
                      className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-foreground">{t("contact.phone")}</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Утасны дугаар"
                      className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-medium text-foreground">Гарчиг</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Гарчиг"
                      className="h-12 rounded-lg border-border bg-slate-50 px-4 text-[14px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-foreground">{t("contact.message")}</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Зурвасаа бичнэ үү"
                    rows={6}
                    className="rounded-lg border-border bg-slate-50 px-4 py-3 text-[14px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 h-14 w-full gap-2 rounded-lg bg-primary text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
                >
                  {t("contact.submit")}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
