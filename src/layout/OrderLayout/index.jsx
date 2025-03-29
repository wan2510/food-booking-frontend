// FullScreenOrderLayout.jsx
import { Layout, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Content, Header } = Layout;

const FullScreenOrderLayout = () => {
  const navigate = useNavigate();

  const handleBackToAdmin = () => {
    navigate("/admin"); 
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header 
        style={{ 
          background: "#fff", 
          padding: "0 24px", 
          height: "64px", 
          lineHeight: "64px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackToAdmin}
          style={{ fontSize: "16px" }}
        >
          Quay lại trang quản lý
        </Button>
      </Header>
      <Content 
        style={{ 
          padding: 24, 
          margin: 0, 
          background: "#fff",
          minHeight: "calc(100vh - 64px)" 
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default FullScreenOrderLayout;