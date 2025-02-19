import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderComponent from "./Header/HeaderComponent";

const { Content } = Layout;

const DashboardLayout = () => {
  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: "1px" }}> {}
        <Outlet />
      </Content>
    </Layout>
  );
};

export default DashboardLayout;
