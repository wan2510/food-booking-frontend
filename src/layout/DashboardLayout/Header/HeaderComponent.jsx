import React from "react";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./header.css";

const { Header } = Layout;

const menuItems = [
  { key: "1", label: <Link to="/">Home</Link> },
  { key: "2", label: <Link to="/recipes">Recipes</Link> },
  { key: "3", label: <Link to="/features">Features</Link> },
  { key: "4", label: <Link to="/shop">Shop</Link> },
  { key: "5", label: <Link to="/contact">Contact Us</Link> }
];

const HeaderComponent = () => {
  return (
    <Layout>
      <div className="top-bar">
        <div className="top-left">
          <span>About</span>
          <span>Setting</span>
          <span>Contact Us</span>
        </div>
        <div className="top-right">
          <a href="#" className="social-icon"><FaFacebook /></a>
          <a href="#" className="social-icon"><FaTwitter /></a>
          <a href="#" className="social-icon"><FaInstagram /></a>
        </div>
      </div>

      <Header className="header">
        <div className="logo"> Nhóm 3</div>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]} className="menu" items={menuItems} />
        <Button icon={<UserOutlined />} shape="circle" className="user-icon" />
      </Header>
    </Layout>
  );
};

export default HeaderComponent;
