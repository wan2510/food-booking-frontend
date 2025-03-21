import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Input, Badge, Space, Button, message } from "antd";
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
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userUuid");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    message.success("Bạn đã đăng xuất thành công");
    navigate("/");
  };

  const handleRedirect = (path) => {
    if (accessToken) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/food?name=${value}`);
      if (!response.ok) throw new Error("Lỗi khi tìm kiếm món ăn");

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm món ăn:", error);
      setSearchResults([]);
    }
  };

  const notificationMenu = {
    items: [
      { key: '1', label: 'Thông báo mới về đơn hàng', onClick: () => console.log('Notification 1 clicked') },
      { key: '2', label: 'Khuyến mãi đặc biệt hôm nay', onClick: () => console.log('Notification 2 clicked') },
    ],
  };

  const userMenu = {
    items: [
      { key: "1", icon: <UserOutlined />, label: <span onClick={() => handleRedirect("/profile")}>Tài khoản của tôi</span> },
      { key: "2", icon: <ShoppingCartOutlined />, label: <span onClick={() => handleRedirect("/cart")}>Giỏ hàng của tôi</span> },
      { type: "divider" },
      accessToken
        ? { key: "3", icon: <LogoutOutlined />, danger: true, label: <span onClick={handleLogout}>Đăng xuất</span> }
        : { key: "4", icon: <LoginOutlined />, label: <Link to="/login">Đăng nhập</Link> },
    ],
  };

  const menuItems = [
    { key: "/", label: <Link to="/">Trang chủ</Link> },
    { key: "/foodlist", label: <Link to="/foodlist">Món ăn</Link> },
    { key: "/book", label: <Link to="/book">Đặt bàn ngay</Link> },
    { key: "/order", label: <Link to="/order">Gọi món tại quầy</Link> },
    { key: "/contact", label: <Link to="/contact">Liên hệ</Link> },
  ];

  return (
    <Layout>
      <Header className="header">
        <div className="header-left">
          <Button className="mobile-menu-button" icon={<MenuOutlined />} onClick={() => setIsMenuVisible(!isMenuVisible)} />
          <Link to="/" className="logo">Nomster</Link>
        </div>

        <div className={`header-center ${isMenuVisible ? 'visible' : ''}`}>
          <Menu theme="light" mode="horizontal" selectedKeys={[location.pathname]} className="menu" items={menuItems} />
          <div className="search-container">
            <Search 
              placeholder="Tìm kiếm món ăn..." 
              onChange={(e) => handleSearch(e.target.value)}
              value={searchTerm}
              className="search-input"
            />
            {searchResults.length > 0 && (
              <ul className="search-dropdown">
                {searchResults.map((food) => (
                  <li key={food.uuid} onClick={() => navigate(`/food/${food.uuid}`)}>
                    <img src={food.imageUrl || "/images/default-food.png"} alt={food.name} className="search-food-img" />
                    <span>{food.name} - {food.price?.toLocaleString('vi-VN')}đ</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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