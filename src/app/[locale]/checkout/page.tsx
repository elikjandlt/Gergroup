"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { useRouter } from "@/i18n/routing";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart.store";
import { useAuth } from "@/lib/auth/AuthContext";
import { CP_DEALS_ADD, type CpDealsAddData } from "@/graphql/hotel/mutations/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/common/Image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Truck, ArrowRight, Check, User, Mail, Phone, MapPin, Banknote, Landmark, QrCode, CreditCard, Wallet } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "Бэлнээр хүлээлгэж өгөх",
    description: "Бараа хүргэгдсэн үед курьерээс бэлнээр төлнө.",
    icon: Banknote,
  },
  {
    id: "transfer",
    label: "Дансаар шилжүүлэх",
    description: "Захиалга баталгаажсаны дараа дансанд шилжүүлнэ.",
    icon: Landmark,
  },
  {
    id: "qpay",
    label: "QPay / SocialPay",
    description: "Гар утасны банкны апп ашиглан QR код уншуулна.",
    icon: QrCode,
  },
  {
    id: "stripe",
    label: "Картын төлбөр (Stripe)",
    description: "Олон улсын Visa, MasterCard, Amex картаар төлнө.",
    icon: CreditCard,
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "PayPal дансаар төлбөр хийнэ.",
    icon: Wallet,
  },
];

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useAtom(cartItemsAtom);
  const [total] = useAtom(cartTotalAtom);
  const { user } = useAuth();
  const [addDeal, { loading: isSubmitting }] = useMutation<CpDealsAddData>(CP_DEALS_ADD);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setError("");

    const orderNumber = `GG-${Date.now().toString().slice(-8)}`;
    const productsData = items.map((item) => ({
      productId: item.productId,
      quantity: item.count,
      unitPrice: item.unitPrice,
      amount: item.unitPrice * item.count,
    }));

    const deliveryText = [
      `Захиалгын дугаар: ${orderNumber}`,
      `Нэр: ${firstName} ${lastName}`.trim(),
      `Утас: ${phone}`,
      email ? `Имэйл: ${email}` : "",
      `Хүргэлтийн хаяг: ${address}`,
      description ? `Тайлбар: ${description}` : "",
      `Төлбөрийн хэлбэр: ${selectedPayment?.label}`,
      `Нийт дүн: ${formatPrice(total)}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const { data } = await addDeal({
        variables: {
          name: `Онлайн захиалга ${orderNumber} — ${firstName} ${lastName}`.trim(),
          stageId: process.env.NEXT_PUBLIC_ORDER_STAGE_ID,
          productsData,
          description: deliveryText,
          ...(user?._id ? { customerIds: [user._id] } : {}),
        },
      });

      if (data?.cpDealsAdd?._id) {
        sessionStorage.setItem(
          "lastOrder",
          JSON.stringify({ number: orderNumber, total, name: `${firstName} ${lastName}`.trim() })
        );
        setItems([]);
        router.push("/verify");
      } else {
        setError("Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      setError(`Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу. ${message}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1440px] flex-col items-center justify-center gap-4 px-10 py-16 text-center">
        <p className="text-[16px] text-muted-foreground">{t("cart.empty")}</p>
        <Button onClick={() => router.push("/products")} className="bg-primary text-white hover:bg-primary/90">
          {t("cart.continue")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[240px] w-full overflow-hidden sm:h-[280px]">
        <Image
          src="/images/products/tavtsan.jpg"
          alt={t("checkout.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Худалдан авалт
            </p>
            <h1 className="mt-2 text-[32px] font-bold text-white sm:text-[42px]">
              {t("checkout.title")}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-8">
            {/* Delivery form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="text-[18px] font-bold">{t("checkout.delivery")}</h2>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-[12px] font-medium">{t("checkout.firstName")}</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Нэр"
                      className="h-12 rounded-lg border-border bg-slate-50 pl-11 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[12px] font-medium">{t("checkout.lastName")}</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Овог"
                      className="h-12 rounded-lg border-border bg-slate-50 pl-11 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label className="text-[12px] font-medium">{t("checkout.phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Утасны дугаар"
                      className="h-12 rounded-lg border-border bg-slate-50 pl-11 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label className="text-[12px] font-medium">{t("checkout.email")} (заавал биш)</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Имэйл хаяг"
                      className="h-12 rounded-lg border-border bg-slate-50 pl-11 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label className="text-[12px] font-medium">{t("checkout.address")}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Хүргэлтийн хаяг"
                      className="h-12 rounded-lg border-border bg-slate-50 pl-11 pr-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label className="text-[12px] font-medium">{t("checkout.description")} (заавал биш)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Нэмэлт тайлбар..."
                    rows={3}
                    className="rounded-lg border-border bg-slate-50 px-4 py-3"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <h2 className="text-[18px] font-bold">Төлбөрийн хэлбэр</h2>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-slate-50 hover:border-primary"
                      )}
                    >
                      <method.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          selected ? "text-white" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold">{method.label}</span>
                        <span
                          className={cn(
                            "text-[12px]",
                            selected ? "text-white/70" : "text-muted-foreground"
                          )}
                        >
                          {method.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-[18px] font-bold">{t("checkout.summary")}</h2>

            <div className="mt-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.productImgUrl}
                      alt={item.productName || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[14px] font-medium">{item.productName}</span>
                    <span className="text-[13px] text-muted-foreground">x {item.count}</span>
                  </div>
                  <span className="text-[14px] font-semibold">
                    {formatPrice(item.unitPrice * item.count)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">{t("cart.shipping")}</span>
                <span className="font-medium text-primary">{t("cart.free")}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Төлбөрийн хэлбэр</span>
                <span className="font-medium">{selectedPayment?.label}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-[18px] font-bold">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-[13px] text-destructive">{error}</p>}

            <Button
              className="mt-8 h-14 w-full gap-2 rounded-lg bg-primary text-[14px] font-semibold uppercase tracking-wider text-white hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={isSubmitting || !firstName || !phone || !address}
            >
              {isSubmitting ? t("common.loading") : t("checkout.submit")}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
              <Check className="h-4 w-4 text-primary" />
              <span>Захиалга баталгаажсаны дараа хүргэлтийн компани тантай холбогдоно</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
