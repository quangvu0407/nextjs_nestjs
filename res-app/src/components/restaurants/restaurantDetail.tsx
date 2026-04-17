"use client";

import { Rate, Tag, Typography, Tabs, Empty } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { IRestaurant } from "@/types/restaurant.type";

const { Title, Text } = Typography;

interface IMenu {
  _id: string;
  title: string;
  description: string;
  image: string;
  restaurant: string;
}

const COLORS = ["#e53935", "#fb8c00", "#43a047", "#1e88e5", "#8e24aa", "#00897b"];

const RestaurantDetail = ({ restaurant, menus }: { restaurant: IRestaurant; menus: IMenu[] }) => {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Hero */}
      <div style={{ padding: "20px 24px 0" }}>
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 12,
            background: "rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 8,
            color: "#333",
            padding: "6px 14px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
          }}
        >
          <ArrowLeftOutlined /> Quay lại
        </button>
        <div style={{ borderRadius: 16, overflow: "hidden", height: 320 }}>
          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: COLORS[0],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {restaurant.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ padding: "14px 4px 0" }}>
          <Title level={2} style={{ margin: 0 }}>
            {restaurant.name}
          </Title>
          <Rate disabled defaultValue={restaurant.rating} allowHalf style={{ fontSize: 14 }} />
        </div>
      </div>

      {/* Info card */}
      <div
        style={{
          background: "#fff",
          margin: "0 auto",
          maxWidth: 900,
          borderRadius: "0 0 16px 16px",
          padding: "20px 28px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Text style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <EnvironmentOutlined style={{ color: "#e53935" }} />
            {restaurant.address}
          </Text>
          <Text style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <PhoneOutlined style={{ color: "#1e88e5" }} />
            {restaurant.phone}
          </Text>
          <Text style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MailOutlined style={{ color: "#43a047" }} />
            {restaurant.email}
          </Text>
        </div>
      </div>

      {/* Menus */}
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <Tabs
          defaultActiveKey="menu"
          items={[
            {
              key: "menu",
              label: `Menu (${menus.length})`,
              children:
                menus.length === 0 ? (
                  <Empty description="Chưa có menu nào" />
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {menus.map((menu, idx) => (
                      <div
                        key={menu._id}
                        onClick={() => router.push(`/menus/${menu._id}`)}
                        style={{
                          background: "#fff",
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          marginBottom: '30px'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                      >
                        {menu.image ? (
                          <img
                            src={menu.image}
                            alt={menu.title}
                            style={{ width: "100%", height: 160, objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: 160,
                              background: COLORS[idx % COLORS.length],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 40,
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          >
                            {menu.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ padding: "12px 14px" }}>
                          <Text strong style={{ fontSize: 15, display: "block" }}>
                            {menu.title}
                          </Text>
                          {menu.description && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {menu.description}
                            </Text>
                          )}
                          <Tag color="red" style={{ marginTop: 8, borderRadius: 20, fontSize: 11 }}>
                            Xem món →
                          </Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RestaurantDetail;
