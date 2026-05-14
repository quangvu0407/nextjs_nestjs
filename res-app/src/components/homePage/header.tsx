"use client";

import { Layout, Menu, Button, Space, Dropdown, Badge } from "antd";
import { ShoppingCartOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Session } from "next-auth";
import { getCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

const { Header } = Layout;

const navItems = [
  { key: "restaurants", label: <Link href="/restaurants">Nhà hàng</Link> },
  { key: "orders", label: <Link href="/orders">Đơn hàng</Link> },
  { key: "about", label: <Link href="/about">Giới thiệu</Link> },
];

const HeaderPage = ({ session }: { session: Session | null }) => {
  const userId = session?.user?._id ?? "guest";
  const totalCount = getCartStore(userId)((s) => s.totalCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <>
      <style>{`
        .nav-menu { display: flex; }
        .nav-dropdown { display: none; }
        @media (max-width: 630px) {
          .nav-menu { display: none; }
          .nav-dropdown { display: flex; }
        }
      `}</style>

      <Header
        style={{
          display: "flex",
          height: '70px',
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "10px 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 26 }}>🍜</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: "#e53935" }}>FoodApp</span>
        </Link>

        {/* Nav - desktop */}
        <div className="nav-menu" style={{ flex: 1 }}>
          <Menu
            mode="horizontal"
            items={navItems}
            style={{ flex: 1, justifyContent: "center", border: "none" }}
          />
        </div>

        {/* Nav - mobile dropdown */}
        <div className="nav-dropdown">
          <Dropdown menu={{ items: navItems }} trigger={["click"]} placement="bottomLeft">
            <Button icon={<MenuOutlined />} type="text" size="large" />
          </Dropdown>
        </div>

        {/* Actions */}
        <Space size={12}>
          <Link href="/cart">
            <Badge count={mounted ? totalCount : 0} size="small">
              <Button icon={<ShoppingCartOutlined />} type="text" size="large" />
            </Badge>
          </Link>
          {
            session?.user?._id ?
              <Link href="/auth/profile">
                <Button icon={< UserOutlined />} type="text" size="large" />
              </Link>
              :
              <>
                <Link href="/auth/login">
                  <Button color="cyan" variant="outlined">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button color="primary" variant="outlined">
                    Đăng kí
                  </Button>
                </Link>
              </>

          }

        </Space>
      </Header>
    </>
  );
};

export default HeaderPage;
