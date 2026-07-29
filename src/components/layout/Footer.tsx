"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@apollo/client/react";
import { Link } from "@/i18n/routing";
import { CP_MENUS, type CpMenusData, type MenuItem } from "@/graphql/cms/queries/menu";
import { CP_PAGES, type CpPagesData } from "@/graphql/cms/queries/page";

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

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const { data: menuData } = useQuery<CpMenusData>(CP_MENUS, {
    variables: { language: locale, kind: "footer" },
    fetchPolicy: "cache-first",
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

  const contactItems = [
    { icon: PhoneIcon, label: "Утас", value: cmsPhone || "11 433995", href: `tel:${(cmsPhone || "11433995").replace(/\s/g, "")}` },
    { icon: MailIcon, label: "Имэйл", value: cmsEmail || "info@ubgroup.mn", href: `mailto:${cmsEmail || "info@ubgroup.mn"}` },
    { icon: MapPinIcon, label: "Хаяг", value: cmsAddress || "Улаанбаатар, Монгол" },
    { icon: ClockIcon, label: "Ажлын цаг", value: cmsHours || "Да-Ба 09:00 - 18:00" },
  ];

  const facebookUrl = cmsFacebook || "https://www.facebook.com/GerGroupLTD";
  const instagramUrl = cmsInstagram || "https://www.instagram.com";

  const footerColumns = useMemo(() => {
    const items: MenuItem[] = menuData?.cpMenus ?? [];
    const parents = items
      .filter((item) => !item.parentId && !item.parent)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (parents.length === 0) return [];

    return parents.map((parent) => ({
      label: parent.label ?? "",
      children: items
        .filter((item) => item.parentId === parent._id || item.parent?._id === parent._id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({ label: item.label ?? "", href: item.url ?? "/" })),
    }));
  }, [menuData]);

  const fallbackColumns = [
    {
      label: t("footer.shop"),
      children: [
        { label: t("nav.products"), href: "/products" },
        { label: t("nav.cart"), href: "/cart" },
        { label: t("nav.wishlist"), href: "/wishlist" },
        { label: t("orders.title"), href: "/orders" },
      ],
    },
    {
      label: t("footer.help"),
      children: [
        { label: t("home.contact"), href: "/contact" },
        { label: t("nav.news"), href: "/news" },
        { label: t("nav.profile"), href: "/profile" },
      ],
    },
  ];

  const columns = footerColumns.length > 0 ? footerColumns : fallbackColumns;

  return (
    <footer className="w-full bg-primary text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Brand & contact */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-[18px] font-semibold uppercase tracking-[4px] text-white">
                Гэр Групп ХХК
              </Link>
              <p className="max-w-sm text-[13px] leading-relaxed text-white/60">
                {t("footer.tagline")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-0.5 text-[14px] font-medium text-white transition-colors hover:text-white/80"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="mt-0.5 text-[14px] font-medium text-white">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu columns from CMS */}
          {columns.map((column) => (
            <div key={column.label} className="flex flex-col gap-4 lg:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {column.label}
              </span>
              <div className="flex flex-col gap-2">
                {column.children.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="text-[13px] text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              {t("footer.social")}
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white hover:text-primary"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white hover:text-primary"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white hover:text-primary"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white hover:text-primary"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-4 sm:px-10 lg:flex-row">
          <p className="text-[12px] text-white/50">
            © {new Date().getFullYear()} Гэр Групп ХХК. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
