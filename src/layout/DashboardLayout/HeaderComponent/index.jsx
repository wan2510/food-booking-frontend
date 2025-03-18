import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Input, Badge, Space, Button } from "antd";
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  LogoutOutlined, 
  LoginOutlined,
  BellOutlined,
  SearchOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./header.css";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userUuid");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleRedirect = (path) => {
    if (accessToken) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (value) => {
    console.log("Searching for:", value);
    // Implement search logic here
  };

  const notificationMenu = {
    items: [
      {
        key: '1',
        label: 'Thông báo mới về đơn hàng',
        onClick: () => console.log('Notification 1 clicked'),
      },
      {
        key: '2',
        label: 'Khuyến mãi đặc biệt hôm nay',
        onClick: () => console.log('Notification 2 clicked'),
      },
    ],
  };

  const userMenu = {
    items: [
      {
        key: "1",
        icon: <UserOutlined />,
        label: (
          <span onClick={() => handleRedirect("/profile")} className="menu-item">
            Tài khoản của tôi
          </span>
        ),
      },
      {
        key: "2",
        icon: <ShoppingCartOutlined />,
        label: (
          <span onClick={() => handleRedirect("/cart")} className="menu-item">
            Giỏ hàng của tôi
          </span>
        ),
      },
      { type: "divider" },
      accessToken
        ? {
            key: "3",
            icon: <LogoutOutlined />,
            danger: true,
            label: (
              <span onClick={handleLogout} className="menu-item">
                Đăng xuất
              </span>
            ),
          }
        : {
            key: "4",
            icon: <LoginOutlined />,
            label: <Link to="/login" className="menu-item">Đăng nhập</Link>,
          },
    ],
  };

  const menuItems = [
    { key: "/", label: <Link to="/">Trang chủ</Link> },
    { key: "/foodlist", label: <Link to="/foodlist">Món ăn</Link> },
    { key: "/book", label: <Link to="/book">Đặt bàn ngay</Link> },
    { key: "/contact", label: <Link to="/contact">Liên hệ</Link> },
  ];

  return (
    <Layout>
      <div className="top-bar">
        <div className="top-left">
          <Space size={24}>
            <span className="top-bar-item">About</span>
            <span className="top-bar-item">Setting</span>
            <span className="top-bar-item">Contact Us</span>
          </Space>
        </div>
        <div className="top-right">
          <Space size={16}>
            <a href="#" className="social-icon hover-effect">
              <FaFacebook />
            </a>
            <a href="#" className="social-icon hover-effect">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon hover-effect">
              <FaInstagram />
            </a>
          </Space>
        </div>
      </div>

      <Header className="header">
        <div className="header-left">
          <Button 
            className="mobile-menu-button"
            icon={<MenuOutlined />}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
          <Link to="/" className="logo">
            Nomster
          </Link>
        </div>

        <div className={`header-center ${isMenuVisible ? 'visible' : ''}`}>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="menu"
            items={menuItems}
          />
          <Search
            placeholder="Tìm kiếm món ăn..."
            onSearch={handleSearch}
            className="search-input"
          />
        </div>

        <div className="header-right">
          <Space size={16}>
            <Dropdown menu={notificationMenu} trigger={["click"]}>
              <Badge count={2} className="notification-badge">
                <BellOutlined className="header-icon" />
              </Badge>
            </Dropdown>

            <Dropdown menu={userMenu} trigger={["hover"]}>
              <Avatar
                size="large"
                src={accessToken ? "/path-to-user-avatar.jpg" : null}
                icon={!accessToken && <UserOutlined />}
                className="user-avatar hover-effect"
              />
            </Dropdown>
          </Space>
        </div>
      </Header>
    </Layout>
  );
};

export default HeaderComponent;