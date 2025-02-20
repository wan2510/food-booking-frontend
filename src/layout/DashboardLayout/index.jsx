import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderComponent from "./Header/HeaderComponent";
import FooterComponent from "./Footer/footercomponent";

const { Content } = Layout;

const DashboardLayout = () => {
  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: "1px", minHeight: "calc(100vh - 120px)" }}>
        <Outlet />
      </Content>
      <FooterComponent /> {}
    </Layout>
  );
};

export default DashboardLayout;