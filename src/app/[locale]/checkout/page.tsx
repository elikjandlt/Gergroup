"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { useRouter } from "@/i18n/routing";
import { useMutation } from "@apollo/client/react";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart.store";
import { useAuth } from "@/lib/auth/AuthContext";
import { CP_DEALS_ADD, type CpDealsAddData } from "@/graphql/hotel/mutations/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Banknote, Landmark, QrCode, CreditCard, Wallet } from "lucide-react";

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
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <p className="text-muted-foreground">{t("cart.empty")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("checkout.title")}</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          {/* Delivery info */}
          <div className="border border-border p-6">
            <h2 className="mb-6 text-[13px] uppercase tracking-wider">
              {t("checkout.delivery")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label>{t("checkout.firstName")}</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>{t("checkout.lastName")}</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.phone")}</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.address")}</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.description")}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="border border-border p-6">
            <h2 className="mb-6 text-[13px] uppercase tracking-wider">
              Төлбөрийн хэлбэр
            </h2>
            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex items-center gap-4 border p-4 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background hover:border-foreground"
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

        {/* Order summary */}
        <div className="border border-border p-6">
          <h2 className="mb-6 text-[13px] uppercase tracking-wider">
            {t("checkout.summary")}
          </h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-[13px]">
                <span>{item.productName} x {item.count}</span>
                <span>{formatPrice(item.unitPrice * item.count)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-[15px]">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="mt-4 flex justify-between text-[13px]">
            <span className="text-muted-foreground">Төлбөрийн хэлбэр</span>
            <span className="font-medium">{selectedPayment?.label}</span>
          </div>
          {error && <p className="mt-4 text-[13px] text-destructive">{error}</p>}
          <Button
            className="mt-8 w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={isSubmitting || !firstName || !phone || !address}
          >
            {isSubmitting ? t("common.loading") : t("checkout.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
