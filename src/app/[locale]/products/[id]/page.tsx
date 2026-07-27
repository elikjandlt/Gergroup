"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartItemsAtom } from "@/store/cart.store";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/common/Image";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";

interface ProductSpec {
  label: string;
  value: string;
}

interface MockProduct {
  _id: string;
  name: string;
  unitPrice: number;
  category: string;
  shortDesc: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  attachment?: { url: string };
  inStock: boolean;
}

const MOCK_PRODUCTS: Record<string, MockProduct> = {
  "suulgalt-khoos": {
    _id: "suulgalt-khoos",
    name: "СУУЛГАЛТЫН ХӨӨС",
    unitPrice: 29700,
    category: "Хөөс",
    shortDesc: "Цонх, хаалганы суулгалтын дулаан тусгаарлагч полиуретан хөөс.",
    description:
      "Суулгалтын хөөс нь цонх, хаалганы хүрээн дэх хөндий зайг битүүмжлэх, дулаан алдагдлыг бууруулах, чийг, тоос, чимээнээр хамгаалах зориулалттай. Монголын уур амьсгалд тохируулан бэлтгэгдсэн, өндөр наалдамжтай, хурдан хатуурдаг найрлагатай.",
    features: [
      "Дулаан тусгаарлалт сайтай",
      "Чийг, ус чийг тусгаарлана",
      "Тоос шороо нэвтрүүлэхгүй",
      "Дуу чимээ багасгана",
      "Хялбар хэрэглэхэд ээлтэй",
    ],
    specs: [
      { label: "Багцын хэмжээ", value: "750 мл" },
      { label: "Өнгө", value: "Цайвар саарал" },
      { label: "Хэрэглээ", value: "Мөнгөн ууттай буу эсвэл шүршдэг" },
      { label: "Хадгалах", value: "+5°C-ээс +25°C хооронд" },
    ],
    inStock: true,
  },
  "block-khoos": {
    _id: "block-khoos",
    name: "БЛОКНЫ ХӨӨС",
    unitPrice: 45000,
    category: "Хөөс",
    shortDesc: "Блокон хана дулаан тусгаарлахад зориулсан өндөр чанарын хөөс.",
    description:
      "Блокны хөөс нь тоосгоны болон блокон ханаар дулаан алдагдлыг ихээхэн бууруулах зориулалттай. Барилгын дотоод болон гадна хананд хэрэглэх боломжтой, галд тэсвэртэй, химийн бодисоос хамгаалагдсан.",
    features: [
      "Өндөр дулаан тусгаарлалт",
      "Галд тэсвэртэй найрлага",
      "Урт насалдаг",
      "Хөндий зайг бүрэн бөглөнө",
      "Барилгын стандартад нийцсэн",
    ],
    specs: [
      { label: "Багцын хэмжээ", value: "1000 мл" },
      { label: "Гарч буй хөөс", value: "65 литр хүртэл" },
      { label: "Хэрэглээ", value: "Барилгын хананд" },
      { label: "Хадгалах", value: "Хуурай газар" },
    ],
    attachment: { url: "/images/products/block-foam.jpg" },
    inStock: true,
  },
  "shurdeg-khoos": {
    _id: "shurdeg-khoos",
    name: "ШҮРШДЭГ ХӨӨС",
    unitPrice: 52000,
    category: "Хөөс",
    shortDesc: "Хөндий зайг дулаан тусгаарлах шүршдэг полиуретан хөөс.",
    description:
      "Шүршдэг хөөс нь томоохон хэмжээний хөндий зайг хурдан бөглөх, дулаан тусгаарлах зориулалттай. Мөнгөн ууттай буугаар хэрэглэхэд тохиромжтой, өндөр өргөтгөлийн коэффициенттэй.",
    features: [
      "Хурдан бөглөх чадвар",
      "Өндөр дулаан тусгаарлалт",
      "Чийгэнд тэсвэртэй",
      "Бат бөх бүтэц",
      "Эрчим хүчний хэмнэлт",
    ],
    specs: [
      { label: "Багцын хэмжээ", value: "900 мл" },
      { label: "Өргөтгөл", value: "50-60 дахин" },
      { label: "Хэрэглээ", value: "Шүршдэг буу" },
      { label: "Хадгалах", value: "Хуурай, сэрүүн" },
    ],
    inStock: true,
  },
  "khoos-tseverlegch": {
    _id: "khoos-tseverlegch",
    name: "ХӨӨС ЦЭВЭРЛЭГЧ",
    unitPrice: 18000,
    category: "Хөөс",
    shortDesc: "Наалдсан хөөс болон бохирдлыг хялбар цэвэрлэнэ.",
    description:
      "Хөөс цэвэрлэгч нь суулгалтын дараа илүү гарсан, наалдсан хөөсийг хурдан хялбар цэвэрлэхэд зориулагдсан. Гадаргууг гэмтээхгүй, аюулгүй найрлагатай.",
    features: [
      "Хөөс болон наалдсан бохирдлыг арилгана",
      "Гадаргууг гэмтээхгүй",
      "Хурдан үйлчилнэ",
      "Аюулгүй найрлага",
      "Хялбар хэрэглээ",
    ],
    specs: [
      { label: "Багцын хэмжээ", value: "500 мл" },
      { label: "Хэрэглээ", value: "Гадаргуу цэвэрлэх" },
      { label: "Төрөл", value: "Шингэн" },
      { label: "Хадгалах", value: "Хүүхдийн гар хүрэхгүй газар" },
    ],
    attachment: { url: "/images/products/foam-cleaner.jpg" },
    inStock: true,
  },
  "khoosnii-buu": {
    _id: "khoosnii-buu",
    name: "ХӨӨСНИЙ БУУ",
    unitPrice: 75000,
    category: "Хөөс",
    shortDesc: "Мөнгөн ууттай хөөс зөөвөрлөх, хэрэглэх мэргэжлийн буу.",
    description:
      "Хөөсний буу нь мөнгөн ууттай хөөстэй хослуулан ашиглахад зориулагдсан, удаан эдэлгээтэй, хялбар удирдлагатай мэргэжлийн багаж юм.",
    features: [
      "Удаан эдэлгээтэй металл бие",
      "Хялбар удирдлага",
      "Тохируулгатай даралт",
      "Мөнгөн ууттай хөөстэй тохиромжтой",
      "Барилгын мэргэжилтнүүдэд зориулсан",
    ],
    specs: [
      { label: "Материал", value: "Металл / хуванцар" },
      { label: "Хэрэглээ", value: "Мөнгөн ууттай хөөс" },
      { label: "Жин", value: "450 гр" },
      { label: "Улс", value: "Хятад" },
    ],
    attachment: { url: "/images/products/foam-gun.jpg" },
    inStock: true,
  },
  "khoos-idewkhijulegch": {
    _id: "khoos-idewkhijulegch",
    name: "ХӨӨС ИДЭВХИЖҮҮЛЭГЧ",
    unitPrice: 12000,
    category: "Хөөс",
    shortDesc: "Хөөсний хатуурах хурдыг нэмэгдүүлж, чанарыг сайжруулна.",
    description:
      "Хөөс идэвхижүүлэгч нь хөөсний хатуурах хугацааг богиносгож, наалдамж, бат бөх байдлыг дээшлүүлэхэд тусална. Хүйтэн уур амьсгалд хэрэглэхэд тохиромжтой.",
    features: [
      "Хатуурах хугацааг богиносгоно",
      "Наалдамжийг сайжруулна",
      "Бат бөх байдлыг нэмэгдүүлнэ",
      "Хүйтэн нөхцөлд тохиромжтой",
      "Хэрэглээ бага",
    ],
    specs: [
      { label: "Багцын хэмжээ", value: "250 мл" },
      { label: "Хэрэглээ", value: "Хөөстэй хольж хэрэглэнэ" },
      { label: "Хадгалах", value: "Хуурай газар" },
      { label: "Аюулгүй байдал", value: "Нүд, арьсанд бүү хүр" },
    ],
    attachment: { url: "/images/products/foam-activator.jpg" },
    inStock: true,
  },
  mako2: {
    _id: "mako2",
    name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ",
    unitPrice: 85000,
    category: "Түгжээ",
    shortDesc: "Мако брендын 2 онгойлтын найдвартай түгжээ.",
    description:
      "МАКО 2 онгойлтын түгжээ нь хуванцар цонхонд зориулсан, удаан эдэлгээтэй, хулгайгаас хамгаалах зориулалттай. Цайвар болон хар өнгөөр хүрэлцэн ирдэг.",
    features: [
      "2 онгойлтын систем",
      "Хулгайгаас хамгаалах функц",
      "Удаан эдэлгээтэй цайнк бүрээстэй",
      "Хуванцар цонхонд тохиромжтой",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Бренд", value: "МАКО" },
      { label: "Онгойлт", value: "2 онгойлт" },
      { label: "Материал", value: "Цайнк бүрээстэй ган" },
      { label: "Өнгө", value: "Цайвар / Хар" },
    ],
    attachment: { url: "/images/products/mako2.jpg" },
    inStock: true,
  },
  kinlong: {
    _id: "kinlong",
    name: "КИНЛОНГ ТҮГЖЭЭ",
    unitPrice: 95000,
    category: "Түгжээ",
    shortDesc: "Кинлонг брендын чанартай, бат бөх цонхны түгжээ.",
    description:
      "Кинлонг түгжээ нь хуванцар болон хөнгөн цагаан цонхонд зориулсан, өндөр ачаалал даах чадвартай, бат бөх бүтэцтэй. Хятадын тэргүүлэх фурнитурын бренд юм.",
    features: [
      "Өндөр ачаалал даах чадвар",
      "Зэврэлтээс хамгаалсан бүрээс",
      "Хуванцар, хөнгөн цагаан цонхонд тохиромжтой",
      "Удаан эдэлгээ",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Бренд", value: "Kinlong" },
      { label: "Материал", value: "Зэвэрдэггүй ган" },
      { label: "Хэрэглээ", value: "Цонхны фурнитур" },
      { label: "Гарал үүслийн газар", value: "Хятад" },
    ],
    attachment: { url: "/images/products/kinlong.jpg" },
    inStock: true,
  },
  "us-uur-inside": {
    _id: "us-uur-inside",
    name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ INSIDE",
    unitPrice: 180000,
    category: "Ус уур чийг тусгаарлагч",
    shortDesc: "Цонхны дотор талын ус, чийг, уур тусгаарлагч резин.",
    description:
      "Дотор талын тусгаарлагч нь цонхны дотор талын завсрыг битүүмжилж, өрөөн доторх дулааныг хадгалах, чийг орж ирэхээс сэргийлнэ. EPDM резинээр хийгдсэн, удаан эдэлгээтэй.",
    features: [
      "Дулаан тусгаарлалт сайтай",
      "Чийг, ус чийг нэвтрүүлэхгүй",
      "EPDM резин — удаан эдэлгээ",
      "Цонхны дотор талд зориулсан",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Төрөл", value: "Дотор тал" },
      { label: "Хэрэглээ", value: "Хуванцар цонх" },
      { label: "Хадгалах", value: "Хуурай, хараас хол" },
    ],
    attachment: { url: "/images/products/us-uur.jpg" },
    inStock: true,
  },
  "us-uur-outside": {
    _id: "us-uur-outside",
    name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ OUTSIDE",
    unitPrice: 240000,
    category: "Ус уур чийг тусгаарлагч",
    shortDesc: "Цонхны гадна талын ус, чийг, уур тусгаарлагч резин.",
    description:
      "Гадна талын тусгаарлагч нь бороо, цас, тоос шороо, салхи нэвтрүүлэхээс хамгаалж, цонхны битүүмжлэлийг бүрэн хангана. UV туяанд тэсвэртэй EPDM резинээр хийгдсэн.",
    features: [
      "UV туяанд тэсвэртэй",
      "Бороо, цас, салхи тусгаарлана",
      "EPDM резин — удаан эдэлгээ",
      "Гадна орчинд зориулсан",
      "Битүүмжлэл бүрэн",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Төрөл", value: "Гадна тал" },
      { label: "Хэрэглээ", value: "Хуванцар цонх" },
      { label: "Урт", value: "1 метр эсвэл захиалгаар" },
    ],
    attachment: { url: "/images/products/us-uur.jpg" },
    inStock: true,
  },
  "epdm-rm228": {
    _id: "epdm-rm228",
    name: "EPDM РЕЗИН РМ-228",
    unitPrice: 65000,
    category: "Резин",
    shortDesc: "EPDM резинэн тусгаарлагч РМ-228.",
    description:
      "EPDM резин РМ-228 нь хуванцар цонхны битүүмжлэлд зориулсан, уян хатан, удаан эдэлгээтэй резинэн уруулга. Температурын өндөр хэлбэлзэлд тэсвэртэй.",
    features: [
      "Уян хатан, удаан эдэлгээ",
      "Температурын өөрчлөлтөд тэсвэртэй",
      "UV туяанд тэсвэртэй",
      "Чийг, ус тусгаарлана",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Загвар", value: "РМ-228" },
      { label: "Хэрэглээ", value: "Цонхны уруулга" },
      { label: "Өнгө", value: "Хар" },
    ],
    attachment: { url: "/images/products/epdm.jpg" },
    inStock: true,
  },
  "epdm-pru05016": {
    _id: "epdm-pru05016",
    name: "EPDM РЕЗИН ПРУ-05016",
    unitPrice: 72000,
    category: "Резин",
    shortDesc: "EPDM резинэн тусгаарлагч ПРУ-05016.",
    description:
      "EPDM резин ПРУ-05016 нь хуванцар цонхны битүүмжлэлд өргөн хэрэглэгддэг, өндөр чанартай резинэн уруулга. Уян хатан байдлыг удаан хугацаанд хадгална.",
    features: [
      "Өндөр уян хатан чанар",
      "Удаан эдэлгээ",
      "Битүүмжлэл бүрэн",
      "Температурын эсэргүүцэл өндөр",
      "Стандарт загвар",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Загвар", value: "ПРУ-05016" },
      { label: "Хэрэглээ", value: "Цонхны уруулга" },
      { label: "Өнгө", value: "Хар" },
    ],
    attachment: { url: "/images/products/epdm.jpg" },
    inStock: true,
  },
  "epdm-rm124": {
    _id: "epdm-rm124",
    name: "EPDM РЕЗИН РМ-124",
    unitPrice: 68000,
    category: "Резин",
    shortDesc: "EPDM резинэн тусгаарлагч РМ-124.",
    description:
      "EPDM резин РМ-124 нь тусгай хэлбэртэй цонхны битүүмжлэлд зориулсан, сайн битүүмжлэл өгдөг, удаан эдэлгээтэй резинэн уруулга.",
    features: [
      "Тусгай хэлбэртэй цонхонд тохиромжтой",
      "Сайн битүүмжлэл",
      "Удаан эдэлгээ",
      "Уян хатан",
      "Хялбар угсралт",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Загвар", value: "РМ-124" },
      { label: "Хэрэглээ", value: "Цонхны уруулга" },
      { label: "Өнгө", value: "Хар" },
    ],
    attachment: { url: "/images/products/epdm.jpg" },
    inStock: true,
  },
  "epdm-rm050": {
    _id: "epdm-rm050",
    name: "EPDM РЕЗИН РМ-050",
    unitPrice: 55000,
    category: "Резин",
    shortDesc: "EPDM резинэн тусгаарлагч РМ-050.",
    description:
      "EPDM резин РМ-050 нь энгийн хэлбэртэй цонхны битүүмжлэлд зориулсан, үнэ хүрэлцээтэй, чанарын баталгаатай резинэн уруулга.",
    features: [
      "Үнэ хүрэлцээтэй",
      "Чанарын баталгаатай",
      "Уян хатан",
      "Битүүмжлэл сайн",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Материал", value: "EPDM резин" },
      { label: "Загвар", value: "РМ-050" },
      { label: "Хэрэглээ", value: "Цонхны уруулга" },
      { label: "Өнгө", value: "Хар" },
    ],
    attachment: { url: "/images/products/epdm.jpg" },
    inStock: true,
  },
  "amalgaa-45": {
    _id: "amalgaa-45",
    name: "ХУВАНЦАР АМАЛГАА 45СМ",
    unitPrice: 95000,
    category: "Хуванцар амалгаа",
    shortDesc: "Хуванцар цонхны 45 см өргөнтэй амалгаа.",
    description:
      "Хуванцар цонхны амалгаа нь цонхны дотор талын өнгийг сайжруулж, ханын болон цонхны хүрээний завсрыг дуусгахад хэрэглэгддэг. 45 см өргөнтэй, өнгөний сонголттой.",
    features: [
      "45 см өргөн",
      "Өнгөний сонголттой",
      "Удаан эдэлгээ",
      "Угсрахад хялбар",
      "Цонхны дотор талд зориулсан",
    ],
    specs: [
      { label: "Өргөн", value: "45 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны амалгаа" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/amalgaa.jpg" },
    inStock: true,
  },
  "amalgaa-60": {
    _id: "amalgaa-60",
    name: "ХУВАНЦАР АМАЛГАА 60СМ",
    unitPrice: 120000,
    category: "Хуванцар амалгаа",
    shortDesc: "Хуванцар цонхны 60 см өргөнтэй амалгаа.",
    description:
      "60 см өргөнтэй хуванцар цонхны амалгаа нь өргөн хүрээтэй цонхонд тохиромжтой, сайн чанарын PVC материалаар хийгдсэн, удаан эдэлгээтэй.",
    features: [
      "60 см өргөн",
      "Өргөн хүрээтэй цонхонд тохиромжтой",
      "PVC материал",
      "Удаан эдэлгээ",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Өргөн", value: "60 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны амалгаа" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/amalgaa.jpg" },
    inStock: true,
  },
  "amalgaa-zam": {
    _id: "amalgaa-zam",
    name: "АМАЛГААНЫ ЗАМ",
    unitPrice: 35000,
    category: "Хуванцар амалгаа",
    shortDesc: "Амалгааны хоорондох завсрыг дуусгах зам.",
    description:
      "Амалгааны зам нь амалгааны хэсгүүдийн хоорондох холболтыг цэвэрхэн, бат бөх болгоход хэрэглэгддэг туслах элемент юм.",
    features: [
      "Цэвэрхэн холболт",
      "Бат бөх",
      "Угсрахад хялбар",
      "Өнгөний сонголттой",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Амалгааны холболт" },
      { label: "Урт", value: "2.5 метр" },
      { label: "Өнгө", value: "Цайвар / Хар" },
    ],
    attachment: { url: "/images/products/amalgaa.jpg" },
    inStock: true,
  },
  "amalgaa-tag": {
    _id: "amalgaa-tag",
    name: "АМАЛГААНЫ ТАГ",
    unitPrice: 18000,
    category: "Хуванцар амалгаа",
    shortDesc: "Амалгааны төгсгөлийн таг.",
    description:
      "Амалгааны таг нь амалгааны төгсгөлийн хэсгийг хааж, тоос шороо орохоос сэргийлэхээс гадна эстетик харагдах байдлыг сайжруулна.",
    features: [
      "Төгсгөлийн хэсгийг хаана",
      "Тоос шороо оруулахгүй",
      "Эстетик харагдах байдал",
      "Угсрахад хялбар",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Амалгааны төгсгөл" },
      { label: "Тоо", value: "1 хос" },
      { label: "Өнгө", value: "Цайвар / Хар" },
    ],
    attachment: { url: "/images/products/amalgaa.jpg" },
    inStock: true,
  },
  "tavtsan-20": {
    _id: "tavtsan-20",
    name: "ХУВАНЦАР ТАВЦАН 20СМ",
    unitPrice: 120000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 20 см өргөнтэй тавцан.",
    description:
      "Хуванцар цонхны тавцан нь цонхны доод хэсэгт угаар, чийг хуримтлагдахаас сэргийлж, цонхны бүтцийг бүрэн болгоход хэрэглэгддэг. 20 см өргөнтэй.",
    features: [
      "20 см өргөн",
      "Угаар, чийг хуримтлуулахгүй",
      "Бат бөх PVC материал",
      "Угсрахад хялбар",
      "Өнгөний сонголттой",
    ],
    specs: [
      { label: "Өргөн", value: "20 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-25": {
    _id: "tavtsan-25",
    name: "ХУВАНЦАР ТАВЦАН 25СМ",
    unitPrice: 135000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 25 см өргөнтэй тавцан.",
    description:
      "25 см өргөнтэй хуванцар цонхны тавцан нь дунд хэмжээний цонхонд тохиромжтой, чийг, угаар хуримтлуулахгүй, бат бөх бүтэцтэй.",
    features: [
      "25 см өргөн",
      "Чийг, угаар тусгаарлана",
      "Бат бөх бүтэц",
      "Удаан эдэлгээ",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Өргөн", value: "25 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-30": {
    _id: "tavtsan-30",
    name: "ХУВАНЦАР ТАВЦАН 30СМ",
    unitPrice: 150000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 30 см өргөнтэй тавцан.",
    description:
      "30 см өргөнтэй хуванцар цонхны тавцан нь том цонхонд тохиромжтой, өргөн тавцангийн хэрэгцээг бүрэн хангана.",
    features: [
      "30 см өргөн",
      "Том цонхонд тохиромжтой",
      "Бат бөх PVC",
      "Угаар хуримтлуулахгүй",
      "Угсрахад хялбар",
    ],
    specs: [
      { label: "Өргөн", value: "30 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-35": {
    _id: "tavtsan-35",
    name: "ХУВАНЦАР ТАВЦАН 35СМ",
    unitPrice: 165000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 35 см өргөнтэй тавцан.",
    description:
      "35 см өргөнтэй хуванцар цонхны тавцан нь өргөн цонхны доод хэсгийг бүрэн хамарч, чийг, угаар хуримтлагдахаас сэргийлнэ.",
    features: [
      "35 см өргөн",
      "Өргөн цонхонд тохиромжтой",
      "Бүрэн хамарсан тавцан",
      "Чийг тусгаарлана",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Өргөн", value: "35 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-40": {
    _id: "tavtsan-40",
    name: "ХУВАНЦАР ТАВЦАН 40СМ",
    unitPrice: 180000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 40 см өргөнтэй тавцан.",
    description:
      "40 см өргөнтэй хуванцар цонхны тавцан нь хамгийн өргөн цонхонд тохиромжтой, бат бөх бүтэц, өндөр чанартай PVC материалаар хийгдсэн.",
    features: [
      "40 см өргөн",
      "Хамгийн өргөн цонхонд тохиромжтой",
      "Өндөр чанарын PVC",
      "Бат бөх бүтэц",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Өргөн", value: "40 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-45": {
    _id: "tavtsan-45",
    name: "ХУВАНЦАР ТАВЦАН 45СМ",
    unitPrice: 195000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 45 см өргөнтэй тавцан.",
    description:
      "45 см өргөнтэй хуванцар цонхны тавцан нь тусгай хэмжээний том цонхонд тохиромжтой, бүрэн битүүмжлэл, өндөр тэсвэртэй.",
    features: [
      "45 см өргөн",
      "Тусгай том цонхонд тохиромжтой",
      "Бүрэн битүүмжлэл",
      "Өндөр тэсвэртэй",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Өргөн", value: "45 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-50": {
    _id: "tavtsan-50",
    name: "ХУВАНЦАР ТАВЦАН 50СМ",
    unitPrice: 210000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 50 см өргөнтэй тавцан.",
    description:
      "50 см өргөнтэй хуванцар цонхны тавцан нь хамгийн өргөн, тусгай захиалгын цонхонд тохиромжтой, дээд зэргийн чанартай.",
    features: [
      "50 см өргөн",
      "Хамгийн өргөн цонхонд тохиромжтой",
      "Дээд зэргийн чанар",
      "Бат бөх бүтэц",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Өргөн", value: "50 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
  "tavtsan-60": {
    _id: "tavtsan-60",
    name: "ХУВАНЦАР ТАВЦАН 60СМ",
    unitPrice: 240000,
    category: "Хуванцар тавцан",
    shortDesc: "Хуванцар цонхны 60 см өргөнтэй тавцан.",
    description:
      "60 см өргөнтэй хуванцар цонхны тавцан нь хамгийн том, тусгай зориулалтын цонхонд тохиромжтой, дээд зэргийн бат бөх байдалтай.",
    features: [
      "60 см өргөн",
      "Тусгай зориулалтын цонхонд",
      "Дээд зэргийн бат бөх байдал",
      "Бүрэн битүүмжлэл",
      "Удаан эдэлгээ",
    ],
    specs: [
      { label: "Өргөн", value: "60 см" },
      { label: "Материал", value: "PVC хуванцар" },
      { label: "Хэрэглээ", value: "Цонхны тавцан" },
      { label: "Урт", value: "2.5 метр" },
    ],
    attachment: { url: "/images/products/tavtsan.jpg" },
    inStock: true,
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const { id: productId } = use(params);
  const product = MOCK_PRODUCTS[productId];

  const [, setCartItems] = useAtom(cartItemsAtom);
  const [, setWishlistItems] = useAtom(wishlistItemsAtom);
  const { user } = useAuth();

  const addToCart = () => {
    if (!product) return;
    setIsPending(true);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, count: item.count + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          count: quantity,
          unitPrice: product.unitPrice || 0,
          productName: product.name,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
    setTimeout(() => setIsPending(false), 400);
  };

  const addToWishlist = () => {
    if (!product || !user?._id) return;
    setWishlistItems((prev) => {
      if (prev.find((item) => item.productId === product._id)) return prev;
      return [
        ...prev,
        {
          productId: product._id,
          productName: product.name,
          unitPrice: product.unitPrice,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
  };

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-start justify-center px-10 py-16">
        <p className="text-[16px] font-medium text-muted-foreground">{t("products.notFound")}</p>
        <Button onClick={() => router.push("/products")} className="mt-6">
          {t("products.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("products.back")}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-muted"
        >
          <Image
            src={product.attachment?.url}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <p className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight">{product.name}</h1>
          <p className="mt-4 text-[24px] font-semibold">{formatPrice(product.unitPrice)}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {product.shortDesc}
          </p>

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
              Тоо хэмжээ
            </span>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center bg-muted text-[15px] font-semibold transition-colors hover:bg-muted/80"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-[15px] font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center bg-muted text-[15px] font-semibold transition-colors hover:bg-muted/80"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={addToCart}
              disabled={!product.inStock || isPending}
              className="h-12 w-full gap-2 text-[14px] font-semibold uppercase tracking-wider"
            >
              <ShoppingBag className="h-4 w-4" />
              {product.inStock ? t("product.addToCart") : "Бараа дууссан"}
            </Button>
            <Button
              variant="ghost"
              onClick={addToWishlist}
              className="h-12 w-full gap-2 text-[14px] font-semibold uppercase tracking-wider"
            >
              <Heart className="h-4 w-4" />
              {t("product.addToWishlist")}
            </Button>
          </div>

          {/* Delivery note */}
          <div className="mt-8 flex items-start gap-3 border-t border-border pt-6">
            <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-[14px] font-semibold">Хүргэлтийн мэдээлэл</p>
              <p className="text-[13px] text-muted-foreground">
                Улаанбаатар хотод 24-48 цагийн дотор хүргэж өгнө. 100,000₮-өөс дээш захиалга үнэгүй хүргэлттэй.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Details section */}
      <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-[20px] font-bold">Бүтээгдэхүүний тайлбар</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div>
          <h2 className="text-[20px] font-bold">Үндсэн онцлог</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-foreground" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-16">
        <h2 className="text-[20px] font-bold">Техникийн үзүүлэлт</h2>
        <div className="mt-6 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {product.specs.map((spec, i) => (
            <div key={i} className="bg-background p-5">
              <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                {spec.label}
              </p>
              <p className="mt-1 text-[15px] font-semibold">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
}
