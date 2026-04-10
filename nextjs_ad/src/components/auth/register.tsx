'use client'
import { Button, Divider, Form, Input, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const Register = () => {
    const onFinish = async (values: any) => {
        // TODO: handle register
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <UserOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Đăng Ký</Title>
                    <Text type="secondary">Tạo tài khoản mới</Text>
                </div>

                <Form name="register" onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="Họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input prefix={<MailOutlined style={{ color: '#bbb' }} />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
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
                                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            Đăng Ký
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Đã có tài khoản? </Text>
                    <Link href="/auth/login" style={{ color: '#f5576c', fontWeight: 600 }}>Đăng nhập</Link>
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

export default Register;
