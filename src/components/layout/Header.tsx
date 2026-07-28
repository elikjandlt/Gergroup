"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { Link, usePathname } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartCountAtom } from "@/store/cart.store";
import { wishlistCountAtom } from "@/store/wishlist.store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "@/components/common/Image";
import { Menu, ShoppingBag, User, Heart } from "lucide-react";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useAuth();
  const [cartCount] = useAtom(cartCountAtom);
  const [wishlistCount] = useAtom(wishlistCountAtom);
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.news"), href: "/news" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-10">
        <Link href="/" className="flex items-center gap-3 text-[20px] font-normal uppercase tracking-[4px] text-primary">
          <Image src="/images/logo.png" alt="Гэр Групп ХХК" width={40} height={40} className="object-contain" unoptimized />
          Гэр Групп ХХК
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] uppercase tracking-wider transition-opacity ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="relative hidden lg:block">
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href={user ? "/profile" : "/login"}>
            <User className="h-[18px] w-[18px]" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-[18px] w-[18px]" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
              <nav className="mt-10 flex flex-col gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-[13px] uppercase tracking-wider"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="text-[13px] uppercase tracking-wider"
                >
                  {t("nav.wishlist")}
                </Link>
                <Link
                  href={user ? "/profile" : "/login"}
                  onClick={() => setOpen(false)}
                  className="text-[13px] uppercase tracking-wider"
                >
                  {user ? t("nav.profile") : t("nav.login")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
