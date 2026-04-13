"use client";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;

const Verify = (props: any) => {
  const { _id } = props;
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    setCountdown(120);
  };

  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [countdown]);

  const handleResendCode = async () => {
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sent-code`,
      method: "POST",
      body: { _id },
    });
    if (res?.data) {
      message.success("Đã gửi lại mã kích hoạt, vui lòng kiểm tra email");
      startCountdown();
    } else {
      notification.error({
        message: "Lỗi gửi mã",
        description: res?.message,
      });
    }
  };
  const onFinish = async (values: any) => {
    const { _id, code } = values;

    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        _id, code
      },
    });
    console.log("res", res);
    if (res?.data) {
      message.info("kích hoạt thành công tài khoản")
      router.push('/auth/login')
    } else {
      notification.error({
        message: "verify error",
        description: res?.message,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <UserOutlined style={{ fontSize: 24, color: "#fff" }} />
          </div>
          <Title level={3} style={{ margin: 0 }}>
            Kích hoạt tài khoản
          </Title>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item label="id" name="_id" initialValue={_id} hidden>
            <Input disabled />
          </Form.Item>

          <div style={{ color: "#de1818" }}>
            {" "}
            Mã code đã được gửi tới email đăng kí:{" "}
          </div>
          <Form.Item
            label="code"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã kích hoạt!" },
              { min: 6, message: "Mã code tối thiểu 6 kí tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Code"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: 46,
                background: "linear-gradient(135deg, #f093fb, #f5576c)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Kích hoạt
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              block
              disabled={countdown > 0}
              onClick={handleResendCode}
              style={{ height: 46, borderRadius: 8 }}
            >
              {countdown > 0 ? `Gửi lại mã (${countdown}s)` : "Gửi lại mã"}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link
            href="/auth/login"
            style={{ color: "#f5576c", fontWeight: 600 }}
          >
            Đăng nhập
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "#999", fontSize: 13 }}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
