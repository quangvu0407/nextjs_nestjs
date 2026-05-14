"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Typography, Tag } from "antd";
import {
  SearchOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

const { Text } = Typography;

const TRENDING = ["Phở", "Bún bò", "Cơm tấm", "Lẩu", "Pizza", "Sushi"];
const RECENT_KEY = "recent_searches";
const MAX_RECENT = 5;

const tagColors: Record<string, string> = {
  Phở: "red", "Bún bò": "orange", "Cơm tấm": "gold",
  Lẩu: "volcano", Pizza: "green", Sushi: "blue",
};

const SearchSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [recents, setRecents] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
      setRecents(stored);
    } catch { }
  }, []);

  const saveRecent = (keyword: string) => {
    if (!keyword.trim()) return;
    const updated = [keyword, ...recents.filter((r) => r !== keyword)].slice(0, MAX_RECENT);
    setRecents(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const doSearch = (keyword: string) => {
    const q = keyword.trim();
    if (q) {
      saveRecent(q);
      router.push(`/?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/");
    }
  };

  // Debounce search khi gõ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const handlePressEnter = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(value);
  };

  const handleTag = (keyword: string) => {
    setValue(keyword);
    doSearch(keyword);
  };

  const handleClear = () => {
    setValue("");
    router.push("/");
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
      <Text strong style={{ fontSize: 16, display: "block", marginBottom: 8, color: "#da4343" }}>
        🔍 Tìm nhà hàng
      </Text>
      <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16, color: "#fff" }}>
        Đặt hàng nhanh chóng chỉ trong 30 phút
      </Text>

      <Input
        size="large"
        placeholder="Tìm nhà hàng, món ăn..."
        prefix={<SearchOutlined style={{ color: "#e53935" }} />}
        value={value}
        onChange={handleChange}
        onPressEnter={handlePressEnter}
        allowClear={{ clearIcon: <span onClick={handleClear}>✕</span> }}
        style={{ borderRadius: 10 }}
      />

      {/* Trending */}
      <div style={{ marginTop: 20 }}>
        <Text type="secondary" style={{
          fontSize: 12, display: "flex", alignItems: "center",
          gap: 4, marginBottom: 10, color: "rgba(255,255,255,0.75)",
        }}>
          <FireOutlined style={{ color: "#e53935" }} /> Đang hot
        </Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TRENDING.map((item) => (
            <Tag
              key={item}
              color={tagColors[item]}
              style={{ cursor: "pointer", borderRadius: 20, padding: "2px 12px", fontSize: 12 }}
              onClick={() => handleTag(item)}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      {/* Recent searches */}
      {recents.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Text type="secondary" style={{
            fontSize: 12, display: "flex", alignItems: "center",
            gap: 4, marginBottom: 10, color: "rgba(255,255,255,0.75)",
          }}>
            <ClockCircleOutlined /> Tìm kiếm gần đây
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recents.map((item) => (
              <div
                key={item}
                onClick={() => handleTag(item)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", padding: "6px 8px", borderRadius: 8,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <ClockCircleOutlined style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                <Text style={{ fontSize: 13, color: "#fff" }}>{item}</Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSidebar;
