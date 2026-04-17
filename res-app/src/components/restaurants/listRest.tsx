"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Rate,
  Tag,
  Skeleton,
  Empty,
  Typography,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { IRestaurant } from "@/types/restaurant.type";

const { Text, Title } = Typography;

const COLORS = [
  "#e53935",
  "#fb8c00",
  "#43a047",
  "#1e88e5",
  "#8e24aa",
  "#00897b",
];

const ListRest = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  useEffect(() => {
    fetchRestaurants(current);
  }, [current]);

  const fetchRestaurants = async (page: number) => {
    setLoading(true);
    console.log(process.env.NEXT_PUBLIC_API_URL);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants?current=${page}&pageSize=${pageSize}`,
      );
      const data = await res.json();
      setRestaurants(data.data?.results ?? []);
      setTotal(data.data?.totalItem ?? 0);
      console.log(data)
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", padding: "32px 40px", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{
        marginBottom: 24, backgroundColor: '#ffffffff', backdropFilter: 'blur(1px)',
        background: 'rgba(255, 255, 255, 0.15)',
        padding: '5px 5px 10px', width: '220px', border: '1px solid red', borderRadius: 12
      }}>
        <Title
          level={4}
          style={{
            color: "#392912ff",
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <ShopOutlined style={{ marginRight: 8 }} />
          Nhà hàng nổi bật
        </Title>
        <Text style={{ color: "rgba(63, 28, 28, 0.7)", fontSize: 13, marginLeft: 28 }}>
          {total} nhà hàng đang hoạt động
        </Text>
      </div>

      {/* Grid */}
      {
        loading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: pageSize }).map((_, i) => (
              <Col key={i} xs={24} sm={12} xl={8}>
                <Card
                  style={{
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : restaurants.length === 0 ? (
          <Empty
            description={
              <Text style={{ color: "#fff" }}>Chưa có nhà hàng nào</Text>
            }
          />
        ) : (
          <Row gutter={[16, 16]}>
            {restaurants.map((r, idx) => (
              <Col key={r._id} xs={24} sm={12} xl={8}>
                <Card
                  hoverable
                  onClick={() => router.push(`/restaurants/${r._id}`)}
                  style={{
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                  styles={{ body: { padding: 16 } }}
                >
                  {/* Name + Rating */}
                  <div style={{ marginBottom: 10 }}>
                    <Text
                      strong
                      style={{
                        fontSize: 15,
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.name}
                    </Text>
                    <Rate
                      disabled
                      defaultValue={r.rating}
                      style={{ fontSize: 11 }}
                      allowHalf
                    />
                  </div>

                  {/* Ảnh to */}
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.name}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginBottom: 12,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 180,
                        borderRadius: 10,
                        background: COLORS[idx % COLORS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 12,
                      }}
                    >
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <EnvironmentOutlined />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.address}
                      </span>
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <PhoneOutlined />
                      {r.phone}
                    </Text>
                  </div>

                  <Tag
                    color="red"
                    style={{ marginTop: 10, borderRadius: 20, fontSize: 11 }}
                  >
                    Xem menu →
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        )
      }

      {/* Pagination */}
      {
        total > pageSize && (
          <div
            style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
          >
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={setCurrent}
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "8px 16px",
                borderRadius: 12,
              }}
            />
          </div>
        )
      }
    </div >
  );
};

export default ListRest;
