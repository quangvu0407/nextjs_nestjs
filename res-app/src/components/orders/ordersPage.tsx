"use client";

import { useState } from "react";
import { Typography, Tag, Empty, Divider } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface IOrderDetail {
  _id: string;
  menuItem: { _id: string; title: string; basePrice: number };
  menuItemOption?: { _id: string; title: string; additionalPrice: number };
}

interface IOrder {
  _id: string;
  restaurant: { _id: string; name: string; image?: string };
  status: string;
  totalPrice: number;
  orderTime: string;
  items: IOrderDetail[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: "Chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
  PREPARING: { label: "Đang chuẩn bị", color: "blue", icon: <SyncOutlined spin /> },
  DELIVERING: { label: "Đang giao", color: "cyan", icon: <SyncOutlined spin /> },
  DELIVERED: { label: "Đã giao", color: "green", icon: <CheckCircleOutlined /> },
  CANCELLED: { label: "Đã hủy", color: "red", icon: <CloseCircleOutlined /> },
};

const FILTERS = ["Tất cả", "PENDING", "PREPARING", "DELIVERING", "DELIVERED", "CANCELLED"];

export default function OrdersPage({ orders }: { orders: IOrder[] }) {
  const [filter, setFilter] = useState("Tất cả");

  const filtered = filter === "Tất cả"
    ? orders
    : orders.filter((o) => o.status === filter);

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px 60px" }}>
      <Title level={3} style={{ marginBottom: 20 }}>Đơn hàng của tôi</Title>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px", borderRadius: 20, border: "1px solid",
              cursor: "pointer", fontSize: 13, fontWeight: 500,
              borderColor: filter === f ? "#e53935" : "#d9d9d9",
              background: filter === f ? "#e53935" : "#fff",
              color: filter === f ? "#fff" : "#555",
              transition: "all 0.2s",
            }}
          >
            {f === "Tất cả" ? f : STATUS_CONFIG[f]?.label ?? f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty description="Không có đơn hàng nào" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? { label: order.status, color: "default", icon: null };
            return (
              <div key={order._id} style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  padding: "14px 20px", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  borderBottom: "1px solid #f0f0f0",
                }}>
                  <div>
                    <Text strong style={{ fontSize: 15 }}>{order.restaurant?.name}</Text>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                      {new Date(order.orderTime).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <Tag icon={status.icon} color={status.color} style={{ fontSize: 12 }}>
                    {status.label}
                  </Tag>
                </div>

                {/* Items */}
                <div style={{ padding: "12px 20px" }}>
                  {order.items?.map((detail) => (
                    <div key={detail._id} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 6,
                    }}>
                      <div>
                        <Text style={{ fontSize: 13 }}>{detail.menuItem?.title}</Text>
                        {detail.menuItemOption && (
                          <div style={{ fontSize: 11, color: "#aaa" }}>
                            {detail.menuItemOption.title}
                            {detail.menuItemOption.additionalPrice > 0 &&
                              ` +${detail.menuItemOption.additionalPrice.toLocaleString("vi-VN")}đ`}
                          </div>
                        )}
                      </div>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        {((detail.menuItem?.basePrice ?? 0) + (detail.menuItemOption?.additionalPrice ?? 0)).toLocaleString("vi-VN")}đ
                      </Text>
                    </div>
                  ))}

                  <Divider style={{ margin: "10px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>Tổng cộng</Text>
                    <Text strong style={{ color: "#e53935", fontSize: 15 }}>
                      {order.totalPrice.toLocaleString("vi-VN")}đ
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
