"use client";

import {
  Button,
  Empty,
  InputNumber,
  Typography,
  Divider,
  notification,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "@/store/useCart";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const { Title, Text } = Typography;
const COLORS = [
  "#e53935",
  "#fb8c00",
  "#43a047",
  "#1e88e5",
  "#8e24aa",
  "#00897b",
];

const CartPage = () => {
  const store = useCart();
  const items = store((s) => s.items);
  const clearCart = store((s) => s.clearCart);
  const removeItem = store((s) => s.removeItem);
  const updateQuantity = store((s) => s.updateQuantity);
  const { data: session } = useSession();
  const router = useRouter();
  const [ordering, setOrdering] = useState(false);

  const grandTotal = items.reduce((sum, item) => {
    const optionTotal = item.selectedOptions.reduce(
      (s, o) => s + o.additionalPrice,
      0,
    );
    return sum + (item.basePrice + optionTotal) * item.quantity;
  }, 0);

  const handleOrder = async () => {
    // console.log(session);
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Gom items theo restaurantId
    const byRestaurant = items.reduce<Record<string, typeof items>>(
      (acc, item) => {
        if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
        acc[item.restaurantId].push(item);
        return acc;
      },
      {},
    );

    setOrdering(true);
    try {
      for (const [restaurantId, restItems] of Object.entries(byRestaurant)) {
        const orderItems: { menuItem: string; menuItemOption?: string }[] = [];
        for (const item of restItems) {
          for (let q = 0; q < item.quantity; q++) {
            if (item.selectedOptions.length === 0) {
              orderItems.push({ menuItem: item.menuItemId });
            } else {
              for (const opt of item.selectedOptions) {
                orderItems.push({
                  menuItem: item.menuItemId,
                  menuItemOption: opt._id,
                });
              }
            }
          }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.access_token}`,
          },
          body: JSON.stringify({ restaurant: restaurantId, items: orderItems }),
        });

        if (res.status === 401) {
          await signOut({ redirect: false });
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error("Đặt hàng thất bại");
      }

      clearCart();
      notification.success({ title: "Đặt hàng thành công!" });
      router.push("/orders");
    } catch {
      notification.error({ title: "Đặt hàng thất bại, thử lại sau" });
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px 60px" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <ShoppingCartOutlined style={{ marginRight: 8 }} />
        Giỏ hàng ({items.length} món)
      </Title>

      {items.length === 0 ? (
        <Empty description="Giỏ hàng trống">
          <Link href="/">
            <Button type="primary" danger>
              Khám phá nhà hàng
            </Button>
          </Link>
        </Empty>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, idx) => {
              const optionTotal = item.selectedOptions.reduce(
                (s, o) => s + o.additionalPrice,
                0,
              );
              const itemTotal = (item.basePrice + optionTotal) * item.quantity;
              const optionKey = item.selectedOptions
                .map((o) => o._id)
                .join(",");

              return (
                <div
                  key={`${item.menuItemId}-${optionKey}`}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Ảnh */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: COLORS[idx % COLORS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 15 }}>
                      {item.title}
                    </Text>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      Giá gốc: {item.basePrice.toLocaleString("vi-VN")}đ
                    </div>
                    {item.selectedOptions.length > 0 && (
                      <div
                        style={{
                          marginTop: 4,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                        }}
                      >
                        {item.selectedOptions.map((o) => (
                          <span
                            key={o._id}
                            style={{
                              background: "#fff3e0",
                              color: "#e65100",
                              borderRadius: 12,
                              padding: "2px 8px",
                              fontSize: 11,
                            }}
                          >
                            {o.title}{" "}
                            {o.additionalPrice > 0
                              ? `+${o.additionalPrice.toLocaleString("vi-VN")}đ`
                              : ""}
                          </span>
                        ))}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 10,
                      }}
                    >
                      <InputNumber
                        min={1}
                        max={99}
                        size="small"
                        value={item.quantity}
                        onChange={(v) =>
                          updateQuantity(
                            item.menuItemId,
                            item.selectedOptions.map((o) => o._id),
                            v ?? 1,
                          )
                        }
                      />
                      <Text strong style={{ color: "#e53935" }}>
                        {itemTotal.toLocaleString("vi-VN")}đ
                      </Text>
                      <Button
                        size="small"
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          removeItem(
                            item.menuItemId,
                            item.selectedOptions.map((o) => o._id),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Divider />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Tổng cộng
            </Title>
            <Title level={4} style={{ margin: 0, color: "#e53935" }}>
              {grandTotal.toLocaleString("vi-VN")}đ
            </Title>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Button danger onClick={clearCart} style={{ flex: 1 }}>
              Xóa giỏ hàng
            </Button>
            <Button
              type="primary"
              danger
              style={{ flex: 2 }}
              loading={ordering}
              onClick={handleOrder}
            >
              Đặt hàng
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
