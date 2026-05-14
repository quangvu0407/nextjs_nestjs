"use client";

import { useSession } from "next-auth/react";
import { getCartStore, ICartItem, ICartOption } from "./cartStore";

// Returns the zustand store bound to the current user
export const useCart = () => {
  const { data: session } = useSession();
  const userId = session?.user?._id ?? "guest";
  return getCartStore(userId);
};
