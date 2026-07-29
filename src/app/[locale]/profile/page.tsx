"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <p className="text-muted-foreground">{t("auth.notLoggedIn")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("profile.title")}</h1>
      <div className="max-w-md border border-border p-8">
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.firstName")}</span>
          <span className="text-[15px]">{user.firstName}</span>
        </div>
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-[11px] uppercase text-muted-foreground">{t("checkout.lastName")}</span>
          <span className="text-[15px]">{user.lastName}</span>
        </div>
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-[11px] uppercase text-muted-foreground">{t("auth.email")}</span>
          <span className="text-[15px]">{user.email}</span>
        </div>
        <div className="mb-8 flex flex-col gap-1">
          <span className="text-[11px] uppercase text-muted-foreground">{t("auth.phone")}</span>
          <span className="text-[15px]">{user.phone}</span>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/orders">
            <Button variant="outline" className="w-full">{t("orders.title")}</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            {t("auth.logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
