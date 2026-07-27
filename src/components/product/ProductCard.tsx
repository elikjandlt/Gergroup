"use client";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Link } from "@/i18n/routing";
import { cartItemsAtom } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/graphql/ecommerce/queries/product";

export function ProductCard({
  product,
  category,
  index = 0,
}: {
  product: Product;
  category?: string;
  index?: number;
}) {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = cartItems.find((item) => item.productId === product._id);
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === product._id
            ? { ...item, count: item.count + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          count: 1,
          unitPrice: product.unitPrice || 0,
          productName: product.name,
          productImgUrl: product.attachment?.url,
        },
      ]);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group flex flex-col gap-3"
    >
      <Link
        href={`/products/${product._id}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.attachment?.url}
          alt={product.name || ""}
          fill
          className="object-contain p-6 transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-col gap-1.5 px-1">
        {category && <p className="text-[12px] uppercase tracking-wider text-muted-foreground">{category}</p>}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-[16px] font-semibold leading-snug transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="text-[15px] font-semibold">{formatPrice(product.unitPrice)}</p>
      </div>

      <Button
        onClick={addToCart}
        variant="default"
        size="sm"
        className="mx-1 w-[calc(100%-8px)] border-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        Сагсанд нэмэх
      </Button>
    </motion.article>
  );
}
