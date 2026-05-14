"use client";

import { useEffect, useState, useCallback } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { IRestaurant } from "@/types/restaurant.type";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useSession } from "next-auth/react";

const { Text, Title } = Typography;

const COLORS = [
  "#e53935", "#fb8c00", "#43a047", "#1e88e5", "#8e24aa", "#00897b",
];

// Nhận likedIds + onToggle từ parent, không tự fetch
const LikeButton = ({
  restaurantId,
  liked,
  onToggle,
}: {
  restaurantId: string;
  liked: boolean;
  onToggle: (id: string) => void;
}) => (
  <button
    onClick={(e) => { e.stopPropagation(); onToggle(restaurantId); }}
    style={{
      position: "absolute", top: 10, right: 10,
      background: "rgba(255,255,255,0.85)", border: "none",
      borderRadius: "50%", width: 32, height: 32,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", fontSize: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }}
  >
    {liked
      ? <HeartFilled style={{ color: "#e53935" }} />
      : <HeartOutlined style={{ color: "#e53935" }} />}
  </button>
);

const ListRest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("search") ?? "";
  const { data: session } = useSession();

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  // Set các restaurantId đã like - fetch 1 lần duy nhất
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const pageSize = 6;

  // Fetch liked ids 1 lần khi login
  useEffect(() => {
    if (!session?.user?.access_token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/my/ids`, {
      headers: { Authorization: `Bearer ${session.user.access_token}` },
    })
      .then((r) => r.json())
      .then((res: { data: string[] }) => setLikedIds(new Set(res.data ?? [])))
      .catch(() => { });
  }, [session]);

  const handleToggle = useCallback(async (restaurantId: string) => {
    if (!session?.user?.access_token) return;
    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(restaurantId) ? next.delete(restaurantId) : next.add(restaurantId);
      return next;
    });
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
      // Sync lại với server
      setLikedIds((prev) => {
        const next = new Set(prev);
        json.data?.liked ? next.add(restaurantId) : next.delete(restaurantId);
        return next;
      });
    } catch {
      // Rollback nếu lỗi
      setLikedIds((prev) => {
        const next = new Set(prev);
        next.has(restaurantId) ? next.delete(restaurantId) : next.add(restaurantId);
        return next;
      });
    }
  }, [session]);

  useEffect(() => { setCurrent(1); }, [keyword]);
  useEffect(() => { fetchRestaurants(current, keyword); }, [current, keyword]);

  const fetchRestaurants = async (page: number, search: string) => {
    setLoading(true);
    try {
      const searchQuery = search.trim()
        ? `&name=/${encodeURIComponent(search)}/i`
        : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurants?current=${page}&pageSize=${pageSize}${searchQuery}`,
      );
      const data = await res.json();
      setRestaurants(data.data?.results ?? []);
      setTotal(data.data?.totalItem ?? 0);
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
          {keyword ? `Kết quả: "${keyword}"` : "Nhà hàng nổi bật"}
        </Title>
        <Text style={{ color: "rgba(63, 28, 28, 0.7)", fontSize: 13, marginLeft: 28 }}>
          {total} nhà hàng {keyword ? "tìm thấy" : "đang hoạt động"}
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
                    position: "relative",
                  }}
                  styles={{ body: { padding: 16 } }}
                >
                  {session && (
                    <LikeButton
                      restaurantId={r._id}
                      liked={likedIds.has(r._id)}
                      onToggle={handleToggle}
                    />
                  )}
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
