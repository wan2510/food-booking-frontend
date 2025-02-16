import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Content } from 'antd/es/layout/layout';
import { Sider } from './Sider';

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout>
                <Sider />
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
