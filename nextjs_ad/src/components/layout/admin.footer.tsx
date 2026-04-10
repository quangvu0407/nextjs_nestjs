'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Quang Tran ©{new Date().getFullYear()} Created by @QuangTran
            </Footer>
        </>
    )
}

export default AdminFooter;