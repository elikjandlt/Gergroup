import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface WishlistItem {
  productId: string;
  productName?: string;
  unitPrice?: number;
  productImgUrl?: string;
}

export const wishlistItemsAtom = atomWithStorage<WishlistItem[]>("wishlist-items", []);

export const wishlistCountAtom = atom((get) => get(wishlistItemsAtom).length);
