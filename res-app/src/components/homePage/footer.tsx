"use client";

import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Footer } = Layout;
const { Text, Title } = Typography;

const FooterPage = () => {
  return (
    <Footer style={{ background: "#1a1a1a", color: "#ccc", padding: "48px 64px 24px" }}>
      <Row gutter={[32, 32]}>
        {/* Brand */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff", marginBottom: 12 }}>
            🍜 FoodApp
          </Title>
          <Text style={{ color: "#aaa", fontSize: 13 }}>
            Đặt món ngon từ các nhà hàng yêu thích, giao tận nơi nhanh chóng.
          </Text>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <FacebookOutlined style={{ fontSize: 20, color: "#aaa", cursor: "pointer" }} />
            <InstagramOutlined style={{ fontSize: 20, color: "#aaa", cursor: "pointer" }} />
            <YoutubeOutlined style={{ fontSize: 20, color: "#aaa", cursor: "pointer" }} />
          </div>
        </Col>

        {/* Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff", marginBottom: 12 }}>
            Khám phá
          </Title>
          <Space orientation="vertical" size={8}>
            {[
              { href: "/restaurants", label: "Nhà hàng" },
              { href: "/orders", label: "Đơn hàng" },
              { href: "/about", label: "Giới thiệu" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ color: "#aaa", fontSize: 13 }}>
                {item.label}
              </Link>
            ))}
          </Space>
        </Col>

        {/* Support */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff", marginBottom: 12 }}>
            Hỗ trợ
          </Title>
          <Space orientation="vertical" size={8}>
            {[
              { href: "/faq", label: "FAQ" },
              { href: "/terms", label: "Điều khoản sử dụng" },
              { href: "/privacy", label: "Chính sách bảo mật" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ color: "#aaa", fontSize: 13 }}>
                {item.label}
              </Link>
            ))}
          </Space>
        </Col>

        {/* Contact */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff", marginBottom: 12 }}>
            Liên hệ
          </Title>
          <Space orientation="vertical" size={10}>
            <Text style={{ color: "#aaa", fontSize: 13 }}>
              <PhoneOutlined style={{ marginRight: 8 }} />
              0123 456 789
            </Text>
            <Text style={{ color: "#aaa", fontSize: 13 }}>
              <MailOutlined style={{ marginRight: 8 }} />
              support@foodapp.vn
            </Text>
            <Text style={{ color: "#aaa", fontSize: 13 }}>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              Hà Nội, Việt Nam
            </Text>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#333", margin: "32px 0 16px" }} />

      <Text style={{ color: "#666", fontSize: 12, display: "block", textAlign: "center" }}>
        © {new Date().getFullYear()} FoodApp. All rights reserved.
      </Text>
    </Footer>
  );
};

export default FooterPage;
