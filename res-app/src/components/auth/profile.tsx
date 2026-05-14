"use client";

import { Avatar, Button, Card, Descriptions, Typography } from "antd";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

const { Title, Text } = Typography;

const Profile = ({ session }: { session: Session }) => {
  const user = session.user;

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f5f5",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <Card style={{ width: "100%", maxWidth: 480, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={80}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", fontSize: 32 }}
            icon={<UserOutlined />}
          />
          <Title level={4} style={{ margin: "12px 0 4px" }}>{user.name}</Title>
          <Text type="secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <MailOutlined /> {user.email}
          </Text>
        </div>

        <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Họ tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="ID">{user._id}</Descriptions.Item>
        </Descriptions>

        <Button
          block
          danger
          icon={<LogoutOutlined />}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Đăng xuất
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
