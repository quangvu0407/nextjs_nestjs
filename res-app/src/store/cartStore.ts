import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ICartOption {
  _id: string;
  title: string;
  additionalPrice: number;
}

export interface ICartItem {
  menuItemId: string;
  title: string;
  basePrice: number;
  image: string;
  quantity: number;
  selectedOptions: ICartOption[];
  restaurantId: string;
}

interface CartStore {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (menuItemId: string, optionIds: string[]) => void;
  updateQuantity: (menuItemId: string, optionIds: string[], quantity: number) => void;
  clearCart: () => void;
  totalCount: () => number;
}

const sameOptions = (a: ICartOption[], b: ICartOption[]) => {
  if (a.length !== b.length) return false;
  const aIds = a.map((o) => o._id).sort();
  const bIds = b.map((o) => o._id).sort();
  return aIds.every((id, i) => id === bIds[i]);
};

const storeCache = new Map<string, ReturnType<typeof createCartStore>>();

const createCartStore = (userId: string) =>
  create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],
        addItem: (newItem) => {
          const items = get().items;
          const idx = items.findIndex(
            (i) => i.menuItemId === newItem.menuItemId && sameOptions(i.selectedOptions, newItem.selectedOptions)
          );
          if (idx >= 0) {
            const updated = [...items];
            updated[idx].quantity += newItem.quantity;
            set({ items: updated });
          } else {
            set({ items: [...items, newItem] });
          }
        },
        removeItem: (menuItemId, optionIds) => {
          set({
            items: get().items.filter(
              (i) => !(i.menuItemId === menuItemId && sameOptions(i.selectedOptions, i.selectedOptions.filter((o) => optionIds.includes(o._id))))
            ),
          });
        },
        updateQuantity: (menuItemId, optionIds, quantity) => {
          set({
            items: get().items.map((i) =>
              i.menuItemId === menuItemId && sameOptions(i.selectedOptions, i.selectedOptions.filter((o) => optionIds.includes(o._id)))
                ? { ...i, quantity }
                : i
            ),
          });
        },
        clearCart: () => set({ items: [] }),
        totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      }),
      { name: `cart-storage-${userId}` }
    )
  );

export const getCartStore = (userId: string) => {
  if (!storeCache.has(userId)) {
    storeCache.set(userId, createCartStore(userId));
  }
  return storeCache.get(userId)!;
};

// fallback cho guest
export const useCartStore = getCartStore("guest");
