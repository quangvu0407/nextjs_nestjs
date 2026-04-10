'use client'
import { Button, Col, Divider, Form, Input, Row, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const Login = () => {
    const onFinish = async (values: any) => {
        // TODO: handle login
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 56, height: 56,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <LockOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Đăng Nhập</Title>
                    <Text type="secondary">Chào mừng bạn quay trở lại</Text>
                </div>

                <Form name="login" onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined style={{ color: '#bbb' }} />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 12 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{
                                height: 46,
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Chưa có tài khoản? </Text>
                    <Link href="/auth/register" style={{ color: '#667eea', fontWeight: 600 }}>Đăng ký ngay</Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Link href="/" style={{ color: '#999', fontSize: 13 }}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
