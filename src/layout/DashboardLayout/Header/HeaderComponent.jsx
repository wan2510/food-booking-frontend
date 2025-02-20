import React from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

const { Header } = Layout;

const menuItems = [
  { key: "1", label: <Link to="/home">Trang chủ</Link> },
  { key: "2", label: <Link to="/food">Món ăn</Link> },
  { key: "3", label: <Link to="/book">Đặt bàn ngay</Link> },
  { key: "4", label: <Link to="/contact">Liên hệ</Link> },
];

const HeaderComponent = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleRedirect = (path) => {
    if (userToken) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const userMenu = {
    items: [
      {
        key: "1",
        icon: <UserOutlined />,
        label: (
          <span onClick={() => handleRedirect("/profile")} style={{ cursor: "pointer" }}>
            Tài khoản của tôi
          </span>
        ),
      },
      {
        key: "2",
        icon: <ShoppingCartOutlined />,
        label: (
          <span onClick={() => handleRedirect("/cart")} style={{ cursor: "pointer" }}>
            Giỏ hàng của tôi
          </span>
        ),
      },
      { type: "divider" },
      userToken ? (
        {
          key: "3",
          icon: <LogoutOutlined />,
          danger: true,
          label: (
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              Đăng xuất
            </span>
          ),
        }
      ) : (
        {
          key: "4",
          icon: <LoginOutlined />,
          label: <Link to="/login">Đăng nhập</Link>,
        }
      ),
    ],
  };

  return (
    <Layout>
      {/* Thanh trên cùng */}
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

      {/* Header chính */}
      <Header className="header">
        <Link to="/" className="logo" onClick={() => window.location.reload()}>
          Nomster
        </Link>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]} className="menu" items={menuItems} />
        
        {/* Avatar + Dropdown Menu */}
        <Dropdown menu={userMenu} trigger={["hover"]}>
          <Avatar
            size="large"
            src={userToken ? "/path-to-user-avatar.jpg" : null}
            className="user-avatar"
          />
        </Dropdown>
      </Header>
    </Layout>
  );
};

export default HeaderComponent;
