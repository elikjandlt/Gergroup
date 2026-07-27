import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-10 py-16 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-[18px] font-normal uppercase tracking-[4px] text-[#0077c8]">
            Гэр Групп ХХК
          </Link>
          <p className="max-w-xs text-[13px] text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] uppercase text-muted-foreground">{t("footer.shop")}</span>
          <Link href="/products" className="text-[13px] hover:text-muted-foreground">{t("nav.products")}</Link>
          <Link href="/cart" className="text-[13px] hover:text-muted-foreground">{t("nav.cart")}</Link>
          <Link href="/wishlist" className="text-[13px] hover:text-muted-foreground">{t("nav.wishlist")}</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] uppercase text-muted-foreground">{t("footer.help")}</span>
          <Link href="/contact" className="text-[13px] hover:text-muted-foreground">{t("home.contact")}</Link>
          <Link href="/news" className="text-[13px] hover:text-muted-foreground">{t("nav.news")}</Link>
          <Link href="/orders" className="text-[13px] hover:text-muted-foreground">{t("orders.title")}</Link>
          <Link href="/profile" className="text-[13px] hover:text-muted-foreground">{t("nav.profile")}</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] uppercase text-muted-foreground">{t("footer.social")}</span>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] hover:text-muted-foreground"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/GerGroupLTD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] hover:text-muted-foreground"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-10 py-6 lg:flex-row">
          <p className="text-[12px] text-muted-foreground">© {new Date().getFullYear()} Гэр Групп ХХК. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
