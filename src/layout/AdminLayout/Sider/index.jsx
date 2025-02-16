import { Layout } from 'antd';
import { Menu } from './Menu';
import './sider.css';

export const Sider = () => {
    return (
        <Layout.Sider className="admin-sider">
            <Menu />
        </Layout.Sider>
    );
};
