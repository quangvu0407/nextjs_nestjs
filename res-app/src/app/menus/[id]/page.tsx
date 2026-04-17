import MenuDetail from "@/components/menus/menuDetail";
import { Empty } from "antd";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resMenu, resItems] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-items?menu=${id}&pageSize=100`),
  ]);
  const menuData = await resMenu.json();
  const itemsData = await resItems.json();

  if (!menuData.data) return <Empty description="Không tìm thấy menu" style={{ marginTop: 80 }} />;

  return <MenuDetail menu={menuData.data} items={itemsData.data?.result ?? []} />;
}
