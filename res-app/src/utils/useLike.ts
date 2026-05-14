"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

export function useLike(restaurantId: string) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch trạng thái like ban đầu
  useEffect(() => {
    if (!session?.user?.access_token || !restaurantId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/my/ids`, {
      headers: { Authorization: `Bearer ${session.user.access_token}` },
    })
      .then((r) => r.json())
      .then((res: { data: string[] }) => setLiked((res.data ?? []).includes(restaurantId)))
      .catch(() => { });
  }, [session, restaurantId]);

  const toggle = useCallback(async () => {
    if (!session?.user?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.access_token}`,
        },
        body: JSON.stringify({ restaurantId }),
      });
      const json = await res.json();
      setLiked(json.data?.liked ?? json.liked);
    } catch { }
    setLoading(false);
  }, [session, restaurantId]);

  return { liked, loading, toggle, isLoggedIn: !!session };
}
