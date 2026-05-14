import MenuDetail from "@/components/menus/menuDetail";
import { auth } from "@/auth";
import { Empty } from "antd";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const headers: HeadersInit = session?.user?.access_token
    ? { Authorization: `Bearer ${session.user.access_token}` }
    : {};

  const [resMenu, resItems] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${id}`, { headers }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-items?menu=${id}&pageSize=100`, { headers }),
  ]);
  const menuData = await resMenu.json();
  const itemsData = await resItems.json();

  if (!menuData.data) return <Empty description="Không tìm thấy menu" style={{ marginTop: 80 }} />;

  return <MenuDetail menu={menuData.data} items={itemsData.data?.result ?? []} />;
}
