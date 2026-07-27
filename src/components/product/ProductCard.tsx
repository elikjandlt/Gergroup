"use client";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Link } from "@/i18n/routing";
import { cartItemsAtom } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/graphql/ecommerce/queries/product";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group flex flex-col border border-border bg-background transition-colors hover:border-foreground"
    >
      <Link href={`/products/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.attachment?.url}
          alt={product.name || ""}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 border-t border-border p-4">
        <Link href={`/products/${product._id}`} className="flex-1">
          <h3 className="text-[14px] font-medium leading-snug transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
          <p className="mt-2 text-[14px] font-semibold">{formatPrice(product.unitPrice)}</p>
        </Link>
        <Button onClick={addToCart} variant="outline" size="sm" className="w-full">
          Сагсанд нэмэх
        </Button>
      </div>
    </motion.div>
  );
}
