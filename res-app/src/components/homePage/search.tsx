"use client";

import { useState, useCallback } from "react";
import { AutoComplete, Input, Typography, Space, Tag } from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

// Mock data - sau thay bằng API call thật
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Phở Thìn Bờ Hồ",
    address: "Hoàn Kiếm, Hà Nội",
    rating: 4.8,
    tag: "Phở",
  },
  {
    id: "2",
    name: "Bún Bò Huế Mợ Tư",
    address: "Đống Đa, Hà Nội",
    rating: 4.6,
    tag: "Bún bò",
  },
  {
    id: "3",
    name: "Cơm Tấm Sài Gòn",
    address: "Cầu Giấy, Hà Nội",
    rating: 4.5,
    tag: "Cơm tấm",
  },
  {
    id: "4",
    name: "Lẩu Thái Mama",
    address: "Tây Hồ, Hà Nội",
    rating: 4.7,
    tag: "Lẩu",
  },
  {
    id: "5",
    name: "Pizza 4P's",
    address: "Ba Đình, Hà Nội",
    rating: 4.9,
    tag: "Pizza",
  },
  {
    id: "6",
    name: "Bún Đậu Mắm Tôm",
    address: "Hoàng Mai, Hà Nội",
    rating: 4.4,
    tag: "Bún đậu",
  },
  {
    id: "7",
    name: "Gà Rán KFC",
    address: "Hai Bà Trưng, Hà Nội",
    rating: 4.2,
    tag: "Gà rán",
  },
  {
    id: "8",
    name: "Sushi Hokkaido",
    address: "Nam Từ Liêm, Hà Nội",
    rating: 4.7,
    tag: "Sushi",
  },
];

const TRENDING = ["Phở", "Bún bò", "Cơm tấm", "Lẩu", "Pizza", "Sushi"];

const tagColors: Record<string, string> = {
  Phở: "red",
  "Bún bò": "orange",
  "Cơm tấm": "gold",
  Lẩu: "volcano",
  Pizza: "green",
  Sushi: "blue",
  "Bún đậu": "purple",
  "Gà rán": "cyan",
};

const SearchSidebar = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<
    { value: string; label: React.ReactNode }[]
  >([]);

  const buildOptions = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return [];

      const filtered = MOCK_RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword.toLowerCase()) ||
          r.tag.toLowerCase().includes(keyword.toLowerCase()) ||
          r.address.toLowerCase().includes(keyword.toLowerCase()),
      );

      return filtered.map((r) => ({
        value: r.name,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
            onClick={() => router.push(`/restaurants/${r.id}`)}
          >
            <Space>
              <ShopOutlined style={{ color: "#e53935" }} />
              <div>
                <Text strong style={{ fontSize: 13 }}>
                  {r.name}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {r.address}
                </Text>
              </div>
            </Space>
            <Space orientation="vertical" align="end" size={2}>
              <Tag
                color={tagColors[r.tag] ?? "default"}
                style={{ fontSize: 10, margin: 0 }}
              >
                {r.tag}
              </Tag>
              <Text style={{ fontSize: 11, color: "#faad14" }}>
                ⭐ {r.rating}
              </Text>
            </Space>
          </div>
        ),
      }));
    },
    [router],
  );

  const handleSearch = (val: string) => {
    setValue(val);
    setOptions(buildOptions(val));
  };

  const handleSelect = (val: string) => {
    const found = MOCK_RESTAURANTS.find((r) => r.name === val);
    if (found) router.push(`/restaurants/${found.id}`);
  };

  const handlePressEnter = () => {
    if (value.trim())
      router.push(`/restaurants?search=${encodeURIComponent(value)}`);
  };

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 16,
        padding: 32,
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      {/* Title */}
      <Text
        strong
        style={{
          fontSize: 16,
          display: "block",
          marginBottom: 16,
          color: "#da4343",
        }}
      >
        🔍 Tìm nhà hàng
      </Text>
      <Text
        strong
        style={{
          fontSize: 16,
          display: "block",
          marginBottom: 16,
          color: "#fff",
        }}
      >
        Đặt hàng nhanh chóng chỉ trong 30 phút
      </Text>

      {/* Search input */}
      <AutoComplete
        style={{ width: "100%" }}
        options={options}
        value={value}
        onSearch={handleSearch}
        onSelect={handleSelect}
        notFoundContent={
          value ? (
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                padding: "8px 0",
                display: "block",
                textAlign: "center",
              }}
            >
              Không tìm thấy kết quả
            </Text>
          ) : null
        }
      >
        <Input
          size="large"
          placeholder="Tìm nhà hàng, món ăn..."
          prefix={<SearchOutlined style={{ color: "#e53935" }} />}
          onPressEnter={handlePressEnter}
          style={{ borderRadius: 10 }}
          allowClear
        />
      </AutoComplete>

      {/* Trending */}
      <div style={{ marginTop: 20 }}>
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 10,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <FireOutlined style={{ color: "#e53935" }} /> Đang hot
        </Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TRENDING.map((item) => (
            <Tag
              key={item}
              color={tagColors[item]}
              style={{
                cursor: "pointer",
                borderRadius: 20,
                padding: "2px 12px",
                fontSize: 12,
              }}
              onClick={() => {
                setValue(item);
                setOptions(buildOptions(item));
              }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      {/* Recent searches */}
      <div style={{ marginTop: 20 }}>
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 10,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <ClockCircleOutlined /> Tìm kiếm gần đây
        </Text>
        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
          {["Phở Thìn", "Lẩu Thái"].map((item) => (
            <div
              key={item}
              onClick={() => {
                setValue(item);
                setOptions(buildOptions(item));
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: 8,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <ClockCircleOutlined
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
              <Text style={{ fontSize: 13, color: "#fff" }}>{item}</Text>
            </div>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default SearchSidebar;
