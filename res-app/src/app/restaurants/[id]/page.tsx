import RestaurantDetail from "@/components/restaurants/restaurantDetail";
import { Empty } from "antd";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [resRest, resMenus] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus?restaurant=${id}&pageSize=100`),
  ]);
  const restData = await resRest.json();
  const menuData = await resMenus.json();

  if (!restData.data) return <Empty description="Không tìm thấy nhà hàng" style={{ marginTop: 80 }} />;

  return <RestaurantDetail restaurant={restData.data} menus={menuData.data?.result ?? []} />;
}

