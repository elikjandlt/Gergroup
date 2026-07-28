import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface CartItem {
  productId: string;
  count: number;
  unitPrice: number;
  productName?: string;
  productImgUrl?: string;
}

export const cartItemsAtom = atomWithStorage<CartItem[]>("cart-items", []);

export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.unitPrice * item.count, 0)
);

export const cartCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.count, 0)
);
