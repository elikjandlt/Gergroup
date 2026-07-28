"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { CLIENT_PORTAL_USER_REGISTER } from "@/graphql/auth/mutations/register";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
} from "@/graphql/auth/mutations/loginWithCredentials";
import Image from "@/components/common/Image";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();
  const [registerMutation] = useMutation(CLIENT_PORTAL_USER_REGISTER);
  const [loginMutation] = useMutation<ClientPortalUserLoginWithCredentialsData>(
    CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerMutation({
        variables: {
          firstName,
          lastName,
          email,
          phone,
          password,
          userType: "customer",
          clientPortalId: process.env.NEXT_PUBLIC_CLIENT_PORTAL_ID,
          clientPortalIds: [process.env.NEXT_PUBLIC_CLIENT_PORTAL_ID],
        },
      });
      const { data } = await loginMutation({
        variables: { email, password },
      });
      const result = data?.clientPortalUserLoginWithCredentials;
      const token =
        typeof result === "string"
          ? result
          : (result as { token?: string } | undefined)?.token;
      if (!token) throw new Error("Register failed");
      login(token);
      router.push("/");
    } catch {
      setError(t("auth.registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col">
      {/* Hero */}
      <section className="relative h-[280px] w-full overflow-hidden sm:h-[320px]">
        <Image
          src="/images/products/block-foam.jpg"
          alt={t("auth.register")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Шинэ хэрэглэгч
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("auth.register")}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/70">
              Бүртгэл үүсгэж захиалгаа хянаж, дуртай бүтээгдэхүүнээ хадгалаарай.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[520px]"
        >
          <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-[24px] font-bold text-foreground">
                {t("auth.register")}
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                Хурдан бөгөөд хялбар бүртгэл
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-foreground">
                    {t("checkout.firstName")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Нэр"
                      className="h-12 w-full rounded-lg border border-border bg-slate-50 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-foreground">
                    {t("checkout.lastName")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Овог"
                      className="h-12 w-full rounded-lg border border-border bg-slate-50 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-foreground">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Имэйл хаяг"
                    className="h-12 w-full rounded-lg border border-border bg-slate-50 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-foreground">
                  {t("auth.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Утасны дугаар"
                    className="h-12 w-full rounded-lg border border-border bg-slate-50 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-foreground">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Нууц үг"
                    className="h-12 w-full rounded-lg border border-border bg-slate-50 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[13px] text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? t("common.loading") : t("auth.register")}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-[14px] text-muted-foreground">
                {t("auth.hasAccount")}{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {t("auth.login")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
