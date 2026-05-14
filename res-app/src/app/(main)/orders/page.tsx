import { auth } from "@/auth";
import OrdersPage from "@/components/orders/ordersPage";

export default async function Orders() {
  const session = await auth();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`,
    {
      headers: { Authorization: `Bearer ${session?.user?.access_token}` },
      cache: "no-store",
    }
  );
  const json = await res.json();
  const orders = json?.data?.result ?? [];

  return <OrdersPage orders={orders} />;
}
