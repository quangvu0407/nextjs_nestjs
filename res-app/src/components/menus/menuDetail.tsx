"use client";

import { Typography, Empty, Card } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface IMenu {
  _id: string;
  title: string;
  description: string;
  image: string;
  restaurant: string;
}

interface IMenuItem {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  image: string;
  menu: string;
}

const COLORS = ["#e53935", "#fb8c00", "#43a047", "#1e88e5", "#8e24aa", "#00897b"];

const MenuDetail = ({ menu, items }: { menu: IMenu; items: IMenuItem[] }) => {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Hero */}
      <div style={{ minWidth: '100vh', margin: "0 auto", paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', position: "relative", height: 320, overflow: "hidden", borderRadius: "0 0 20px 20px" }}>
          {menu.image ? (
            <img
              src={menu.image}
              alt={menu.title}
              style={{ width: "80%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "80%", height: "100%",
              background: `linear-gradient(135deg, ${COLORS[0]}, ${COLORS[4]})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 96, fontWeight: 700, color: "#fff",
            }}>
              {menu.title.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => router.back()}
            style={{
              position: "absolute", top: 0, left: 16,
              background: "rgba(255,255,255,0.85)", border: "none",
              borderRadius: 8, color: "#333", padding: "7px 16px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            <ArrowLeftOutlined /> Quay lại
          </button>
        </div>

        {/* Title + description dưới ảnh */}
        <div style={{
          width: '80%',
          margin: '0 auto',
          background: "#fff",
          padding: "20px 28px 16px",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          marginBottom: 24,
        }}>
          <Title level={2} style={{ margin: 0, color: "#1a1a1a" }}>{menu.title}</Title>
          {menu.description && (
            <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
              {menu.description}
            </Text>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 40px" }}>
        <Title level={4} style={{ marginBottom: 16, color: "#333" }}>
          Các món ({items.length})
        </Title>

        {items.length === 0 ? (
          <Empty description="Chưa có món nào trong menu này" />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {items.map((item, idx) => (
              <Card
                key={item._id}
                hoverable
                styles={{ body: { padding: 16 } }}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                cover={
                  item.image ? (
                    <img src={item.image} alt={item.title} style={{ height: 180, objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      height: 180,
                      background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}cc, ${COLORS[(idx + 2) % COLORS.length]}99)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 52, fontWeight: 700, color: "#fff",
                    }}>
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                  )
                }
              >
                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4, color: "#1a1a1a" }}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12, lineHeight: 1.5 }}>
                    {item.description}
                  </Text>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700, color: "#e53935",
                  }}>
                    {item.basePrice?.toLocaleString("vi-VN")}đ
                  </span>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#e53935", color: "#fff", border: "none",
                    borderRadius: 20, padding: "6px 14px", fontSize: 12,
                    cursor: "pointer", fontWeight: 500,
                  }}>
                    <ShoppingCartOutlined /> Thêm vào giỏ
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDetail;
