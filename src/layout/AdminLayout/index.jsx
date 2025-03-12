import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sider from "./Sider";

const { Content } = Layout;

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Layout>
                <Sider />
                <Content
                    style={{
                        padding: 24, 
                        margin: 0, 
                        background: "#fff", 
                        overflow: "auto",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
